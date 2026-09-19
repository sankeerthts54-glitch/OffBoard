import json
import logging

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
# ---------------------------------

def lambda_handler(event, context):
    try:
        # TODO (Laptop 3): Flesh out notification logic
        
        for record in event.get('Records', []):
            if 'Sns' in record:
                sns_message = record['Sns'].get('Message', '{}')
                try:
                    message_data = json.loads(sns_message)
                    logger.info(f"Received notification for account: {message_data.get('account_id')} in session: {message_data.get('session_id')}")
                    logger.info(f"Status: {message_data.get('status')}, Service: {message_data.get('service_name')}")
                    
                    # TODO: Add SES email sending logic here
                    # ses_client = boto3.client('ses')
                    # ses_client.send_email(...)
                    
                except json.JSONDecodeError:
                    logger.error("Failed to parse SNS message JSON")
                    
        return build_cors_response(200, {'message': 'Notifications processed'})
        
    except Exception as e:
        logger.error(f"Error in notify: {e}")
        return build_cors_response(500, {'error': str(e)})
