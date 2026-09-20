import json
import uuid
import datetime
import logging
import os
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

bedrock = boto3.client('bedrock-runtime')
BEDROCK_MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-haiku-4-5-20250514-v1:0')

def lambda_handler(event, context):
    try:
        if 'body' in event and event['body']:
            body = json.loads(event['body'])
        else:
            body = event
            
        session_id = body.get('session_id')
        transition_type = body.get('transition_type', 'unknown')
        account_ids = body.get('account_ids', [])
        
        if not session_id or not account_ids:
            return build_cors_response(400, {'error': 'session_id and account_ids are required'})
            
        results = []
        
        for account_id in account_ids:
            # Fetch account
            try:
                response = table.get_item(Key={'session_id': session_id, 'account_id': account_id})
                account = response.get('Item')
            except Exception as e:
                logger.error(f"Error fetching account {account_id}: {e}")
                continue
                
            if not account:
                continue
                
            prompt = f"""You are an account-transition classifier for "Offboard," an app that helps people manage their digital accounts and subscriptions during a major life change.

CONTEXT:
Transition type: {transition_type}

INPUT:
- service_name: {account.get('service_name', 'Unknown')}
- category: {account.get('category', 'Unknown')}
- last_activity_date: {account.get('last_activity_date', 'Unknown')}
- linked_email: {account.get('linked_email', 'Unknown')}
- billing_status: {account.get('billing_status', 'Unknown')}
- shared_with: {account.get('shared_with', 'Unknown')}

TASK:
Classify this account into exactly one action: KEEP, TRANSFER, CANCEL, CLOSE_OR_MEMORIALIZE, or MIGRATE.

Rules:
- If billing_status is active_recurring and classification is CANCEL, auto_actionable should be true unless shared_with is not null.
- If shared_with is not null, always set auto_actionable to false and note the shared party in next_step.
- Be conservative with CLOSE_OR_MEMORIALIZE — only use for accounts holding personal/social identity.
- Never assume account access already exists.

OUTPUT FORMAT (JSON only, no other text):
{{"classification": "", "confidence": "", "reason": "", "auto_actionable": true/false, "next_step": ""}}"""

            try:
                bedrock_response = bedrock.invoke_model(
                    modelId=BEDROCK_MODEL_ID,
                    body=json.dumps({
                        "anthropic_version": "bedrock-2023-05-31",
                        "max_tokens": 300,
                        "messages": [{"role": "user", "content": prompt}]
                    })
                )
                response_body = json.loads(bedrock_response['body'].read())
                output_text = response_body['content'][0]['text']
                classification_result = json.loads(output_text)
            except Exception as e:
                logger.error(f"Bedrock error for {account_id}: {e}")
                classification_result = {
                    "classification": "KEEP",
                    "confidence": "LOW",
                    "reason": "Fallback due to classification error",
                    "auto_actionable": False,
                    "next_step": "Review manually"
                }
                
            # Update account
            try:
                table.update_item(
                    Key={'session_id': session_id, 'account_id': account_id},
                    UpdateExpression="SET #status = :s, transition_type = :t, classification = :c, confidence = :conf, reason = :r, auto_actionable = :a, next_step = :n, updated_at = :u",
                    ExpressionAttributeNames={'#status': 'status'},
                    ExpressionAttributeValues={
                        ':s': 'CLASSIFIED',
                        ':t': transition_type,
                        ':c': classification_result.get('classification', 'KEEP'),
                        ':conf': classification_result.get('confidence', 'LOW'),
                        ':r': classification_result.get('reason', ''),
                        ':a': classification_result.get('auto_actionable', False),
                        ':n': classification_result.get('next_step', ''),
                        ':u': get_current_timestamp()
                    }
                )
                
                account.update(classification_result)
                account['status'] = 'CLASSIFIED'
                account['transition_type'] = transition_type
                results.append(account)
                
            except Exception as e:
                logger.error(f"Error updating account {account_id}: {e}")
                
        return build_cors_response(200, {'results': results})
        
    except Exception as e:
        logger.error(f"Error in classify: {e}")
        return build_cors_response(500, {'error': str(e)})
