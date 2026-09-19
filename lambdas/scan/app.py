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
    'netflix': 'streaming',
    'spotify': 'streaming',
    'hulu': 'streaming',
    'amazon': 'shopping',
    'apple': 'shopping',
    'google': 'productivity',
    'microsoft': 'productivity',
    'dropbox': 'productivity',
    'adobe': 'productivity',
    'chase': 'finance',
    'bankofamerica': 'finance',
    'paypal': 'finance',
    'facebook': 'social_media',
    'twitter': 'social_media',
    'instagram': 'social_media',
    'linkedin': 'social_media',
    'steam': 'gaming',
    'playstation': 'gaming',
    'nytimes': 'news',
    'wsj': 'news',
    'peloton': 'fitness',
    'strava': 'fitness',
    'coned': 'utilities',
    'pge': 'utilities'
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
            
            # Extract service name from email domain
            match = re.search(r'@([a-zA-Z0-9-]+)\.', from_address)
            service_name_raw = match.group(1).lower() if match else 'unknown'
            service_name = service_name_raw.capitalize()
            
            category = SERVICE_MAP.get(service_name_raw, 'other')
            
            billing_status = 'unknown'
            if any(kw in subject or kw in snippet for kw in ['bill', 'invoice', 'renewal', 'charged']):
                billing_status = 'active_recurring'
            elif any(kw in subject or kw in snippet for kw in ['free', 'trial']):
                billing_status = 'free'
                
            shared_with = None
            if any(kw in snippet for kw in ['family plan', 'shared with', 'joint account']):
                shared_with = "Family/Shared"
                
            linked_email = "user@example.com"
            
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
                table.put_item(Item=account)
                
        return build_cors_response(200, {
            'session_id': session_id,
            'detected_accounts': detected_accounts
        })
        
    except Exception as e:
        logger.error(f"Error processing scan: {e}")
        return build_cors_response(500, {'error': str(e)})
