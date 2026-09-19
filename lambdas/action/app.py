import json
import uuid
import datetime
import logging
import os
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# --- Shared Helpers Copied In ---
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
def get_current_timestamp():
    return datetime.datetime.utcnow().isoformat() + 'Z'
# ---------------------------------

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'OffboardAccounts')
try:
    table = dynamodb.Table(TABLE_NAME)
except Exception as e:
    logger.error(f"Failed to initialize DynamoDB table: {e}")
    table = None

stepfunctions = boto3.client('stepfunctions')
STATE_MACHINE_ARN = os.environ.get('STATE_MACHINE_ARN', '')

def lambda_handler(event, context):
    try:
        if 'body' in event and event['body']:
            body = json.loads(event['body'])
        else:
            body = event
            
        session_id = body.get('session_id')
        account_ids = body.get('account_ids', [])
        
        if not session_id or not account_ids:
            return build_cors_response(400, {'error': 'session_id and account_ids are required'})
            
        execution_ids = []
        
        for account_id in account_ids:
            # TODO (Laptop 3): Enhance fetching logic and error handling
            try:
                response = table.get_item(Key={'session_id': session_id, 'account_id': account_id})
                account = response.get('Item')
            except Exception as e:
                logger.error(f"Error fetching account {account_id}: {e}")
                continue
                
            if not account:
                continue
                
            # Filter only auto_actionable=true accounts
            if not account.get('auto_actionable'):
                continue
                
            # Start Step Functions execution
            # TODO (Laptop 3): Add proper execution naming and error handling
            if STATE_MACHINE_ARN:
                try:
                    sfn_response = stepfunctions.start_execution(
                        stateMachineArn=STATE_MACHINE_ARN,
                        input=json.dumps({
                            'session_id': session_id,
                            'account_id': account_id,
                            'service_name': account.get('service_name')
                        })
                    )
                    execution_ids.append(sfn_response['executionArn'])
                except Exception as e:
                    logger.error(f"Error starting step function for {account_id}: {e}")
            
            # Update DynamoDB status to 'EXECUTING'
            # TODO (Laptop 3): Improve status update logic
            try:
                table.update_item(
                    Key={'session_id': session_id, 'account_id': account_id},
                    UpdateExpression="SET #status = :s, updated_at = :u",
                    ExpressionAttributeNames={'#status': 'status'},
                    ExpressionAttributeValues={
                        ':s': 'EXECUTING',
                        ':u': get_current_timestamp()
                    }
                )
            except Exception as e:
                logger.error(f"Error updating account status {account_id}: {e}")
                
        return build_cors_response(200, {'execution_ids': execution_ids})
        
    except Exception as e:
        logger.error(f"Error in action: {e}")
        return build_cors_response(500, {'error': str(e)})
