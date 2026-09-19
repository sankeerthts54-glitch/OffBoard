import json
import logging
import os
import boto3
from boto3.dynamodb.conditions import Key

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

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'OffboardAccounts')
try:
    table = dynamodb.Table(TABLE_NAME)
except Exception as e:
    logger.error(f"Failed to initialize DynamoDB table: {e}")
    table = None

def lambda_handler(event, context):
    try:
        path_parameters = event.get('pathParameters') or {}
        session_id = path_parameters.get('session_id')
        
        if not session_id:
            return build_cors_response(400, {'error': 'session_id path parameter is required'})
            
        # TODO (Laptop 3): Handle pagination if necessary
        try:
            response = table.query(
                KeyConditionExpression=Key('session_id').eq(session_id)
            )
            accounts = response.get('Items', [])
        except Exception as e:
            logger.error(f"Error fetching accounts for session {session_id}: {e}")
            return build_cors_response(500, {'error': 'Failed to query database'})
            
        return build_cors_response(200, {'accounts': accounts})
        
    except Exception as e:
        logger.error(f"Error in status: {e}")
        return build_cors_response(500, {'error': str(e)})
