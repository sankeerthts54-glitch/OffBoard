"""
Status Lambda — Returns all accounts and their current status for a session.
Owner: Laptop 1 (completed since Laptop 3 didn't push)
"""
import json
import logging
import os
import boto3
from boto3.dynamodb.conditions import Key

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def build_cors_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body, default=str)
    }


dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'OffboardAccounts')
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    try:
        path_params = event.get('pathParameters') or {}
        session_id = path_params.get('session_id')

        if not session_id:
            return build_cors_response(400, {'error': 'session_id path parameter is required'})

        logger.info(f"Fetching accounts for session: {session_id}")

        # Query all accounts for this session (handles pagination)
        accounts = []
        last_evaluated_key = None

        while True:
            query_kwargs = {
                'KeyConditionExpression': Key('session_id').eq(session_id)
            }
            if last_evaluated_key:
                query_kwargs['ExclusiveStartKey'] = last_evaluated_key

            response = table.query(**query_kwargs)
            accounts.extend(response.get('Items', []))

            last_evaluated_key = response.get('LastEvaluatedKey')
            if not last_evaluated_key:
                break

        logger.info(f"Found {len(accounts)} accounts for session {session_id}")

        # Compute summary stats
        summary = {
            'total': len(accounts),
            'detected': 0,
            'classified': 0,
            'executing': 0,
            'cancelled': 0,
            'failed': 0,
            'manual': 0
        }
        for acc in accounts:
            status = acc.get('status', '').upper()
            key = status.lower()
            if key in summary:
                summary[key] += 1

        return build_cors_response(200, {
            'session_id': session_id,
            'accounts': accounts,
            'summary': summary
        })

    except Exception as e:
        logger.error(f"Unhandled error in status lambda: {e}", exc_info=True)
        return build_cors_response(500, {'error': str(e)})
