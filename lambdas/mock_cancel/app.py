import json
import logging
import time
import random

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
        if 'body' in event and event['body']:
            body = json.loads(event['body'])
        else:
            body = event
            
        account_id = body.get('account_id')
        service_name = body.get('service_name', 'Unknown Service')
        
        # Simulate API latency
        # TODO (Laptop 3): Modify latency parameters if needed
        time.sleep(random.uniform(1.0, 2.0))
        
        # Simulate success (70%) or failure (30%)
        is_success = random.random() < 0.70
        
        if is_success:
            logger.info(f"Successfully simulated cancellation for {service_name} ({account_id})")
            return build_cors_response(200, {
                'success': True,
                'message': f"Cancellation for {service_name} processed successfully."
            })
        else:
            logger.warning(f"Simulated cancellation failed for {service_name} ({account_id})")
            return build_cors_response(400, {
                'success': False,
                'message': f"Failed to cancel {service_name}. Manual intervention required."
            })
            
    except Exception as e:
        logger.error(f"Error in mock_cancel: {e}")
        return build_cors_response(500, {'error': str(e)})
