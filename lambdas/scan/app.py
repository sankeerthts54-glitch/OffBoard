import json
import uuid
import datetime
import logging
import os
import re
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# --- Shared Helpers Copied In ---
TRANSITION_TYPES = ['moving_abroad', 'marriage', 'divorce', 'loss_of_loved_one', 'new_job', 'retirement']
CLASSIFICATIONS = ['KEEP', 'TRANSFER', 'CANCEL', 'CLOSE_OR_MEMORIALIZE', 'MIGRATE']
CONFIDENCE_LEVELS = ['HIGH', 'MEDIUM', 'LOW']
ACCOUNT_STATUSES = ['DETECTED', 'CLASSIFIED', 'ACTION_PENDING', 'EXECUTING', 'COMPLETED', 'FAILED']
CATEGORIES = ['streaming', 'utilities', 'shopping', 'finance', 'social_media', 'productivity', 'gaming', 'news', 'fitness', 'other']
BILLING_STATUSES = ['active_recurring', 'free', 'unknown']

def generate_session_id():
    return str(uuid.uuid4())

def generate_account_id():
    return 'acc_' + str(uuid.uuid4().hex)[:10]

def get_current_timestamp():
    return datetime.datetime.utcnow().isoformat() + 'Z'

def build_cors_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body)
    }
# ---------------------------------

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'OffboardAccounts')
try:
    table = dynamodb.Table(TABLE_NAME)
except Exception as e:
    logger.error(f"Failed to initialize DynamoDB table: {e}")
    table = None

SERVICE_MAP = {
    # Streaming
    'netflix': 'streaming',
    'spotify': 'streaming',
    'hulu': 'streaming',
    'hotstar': 'streaming',
    'primevideo': 'streaming',
    'zee5': 'streaming',
    'sonyliv': 'streaming',
    # Shopping / E-commerce
    'amazon': 'shopping',
    'apple': 'shopping',
    'flipkart': 'shopping',
    'myntra': 'shopping',
    # Productivity / SaaS
    'google': 'productivity',
    'microsoft': 'productivity',
    'dropbox': 'cloud_storage',
    'adobe': 'saas',
    'notion': 'saas',
    'slack': 'saas',
    'atlassian': 'saas',
    'github': 'saas',
    # Finance / Banking
    'hdfcbank': 'banking',
    'sbi': 'banking',
    'icicibank': 'banking',
    'axisbank': 'banking',
    'chase': 'banking',
    'bankofamerica': 'banking',
    'paypal': 'finance',
    'razorpay': 'finance',
    # Utilities / Telecom
    'airtel': 'utility',
    'jio': 'utility',
    'vodafone': 'utility',
    'bsnl': 'utility',
    'coned': 'utility',
    'pge': 'utility',
    # Social Media
    'facebook': 'social',
    'facebookmail': 'social',
    'instagram': 'social',
    'twitter': 'social',
    'linkedin': 'social',
    'snapchat': 'social',
    # Gaming
    'steam': 'gaming',
    'playstation': 'gaming',
    # News / Content
    'nytimes': 'content',
    'wsj': 'content',
    'medium': 'content',
    'substack': 'content',
    # Fitness
    'curefit': 'fitness',
    'cultfit': 'fitness',
    'peloton': 'fitness',
    'strava': 'fitness',
    # Food delivery
    'zomato': 'food_delivery',
    'swiggy': 'food_delivery',
    # Cloud
    'aws': 'cloud_storage',
    # Travel
    'makemytrip': 'travel',
    'irctc': 'travel',
}

def lambda_handler(event, context):
    try:
        if 'body' in event and event['body']:
            body = json.loads(event['body'])
        else:
            body = event
            
        session_id = body.get('session_id', generate_session_id())
        inbox_data = body.get('inbox_data', [])
        
        detected_accounts = []
        
        for email in inbox_data:
            from_address = email.get('from', '')
            subject = email.get('subject', '').lower()
            snippet = email.get('snippet', '').lower()
            date = email.get('date', get_current_timestamp())

            # Extract service name — handle subdomains like no-reply@mail.instagram.com
            # Take the second-to-last part of the domain (the actual brand name)
            domain_match = re.search(r'@([a-zA-Z0-9.\-]+)', from_address)
            if domain_match:
                domain_parts = domain_match.group(1).lower().split('.')
                # Filter out common subdomains/TLDs to get the brand name
                filtered = [p for p in domain_parts if p not in (
                    'com', 'in', 'net', 'org', 'co', 'io', 'so',
                    'no', 'reply', 'noreply', 'mail', 'email', 'e',
                    'auto', 'confirm', 'notification', 'notification',
                    'alert', 'alerts', 'billing', 'hello', 'message',
                )]
                service_name_raw = filtered[0] if filtered else 'unknown'
            else:
                service_name_raw = 'unknown'

            service_name = service_name_raw.capitalize()
            category = SERVICE_MAP.get(service_name_raw, 'other')

            billing_status = 'unknown'
            billing_kws = ['bill', 'invoice', 'renewal', 'charged', 'receipt', 'subscription', 'billed', 'payment', 'renewed']
            free_kws = ['free', 'trial', 'activity', 'login', 'alert', 'low on storage']
            if any(kw in subject or kw in snippet for kw in billing_kws):
                billing_status = 'active_recurring'
            elif any(kw in subject or kw in snippet for kw in free_kws):
                billing_status = 'free'

            shared_with = None
            if any(kw in snippet for kw in ['family plan', 'shared with', 'joint account', 'team member', 'partner']):
                shared_with = 'family plan' if 'family' in snippet else 'shared'

            linked_email = 'user@example.com'

            account = {
                'session_id': session_id,
                'account_id': generate_account_id(),
                'service_name': service_name,
                'category': category,
                'billing_status': billing_status,
                'shared_with': shared_with,
                'linked_email': linked_email,
                'last_activity_date': date,
                'status': 'DETECTED',
                'created_at': get_current_timestamp()
            }

            detected_accounts.append(account)

            if table:
                try:
                    table.put_item(Item=account)
                except Exception as ddb_err:
                    logger.error(f"DynamoDB put_item failed for {service_name}: {ddb_err}")

        return build_cors_response(200, {
            'session_id': session_id,
            'accounts': detected_accounts           # ← fixed: was 'detected_accounts'
        })

    except Exception as e:
        logger.error(f"Error processing scan: {e}")
        return build_cors_response(500, {'error': str(e)})

