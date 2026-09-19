"""
Action Lambda — Triggers Step Functions for auto-cancellable accounts.
Owner: Laptop 1 (completed since Laptop 3 didn't push)
"""
import json
import uuid
import datetime
import logging
import os
import boto3

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


def get_current_timestamp():
    return datetime.datetime.utcnow().isoformat() + 'Z'


dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'OffboardAccounts')
table = dynamodb.Table(TABLE_NAME)

stepfunctions = boto3.client('stepfunctions')
STATE_MACHINE_ARN = os.environ.get('STATE_MACHINE_ARN', '')


def lambda_handler(event, context):
    try:
        body = json.loads(event['body']) if event.get('body') else event
        session_id = body.get('session_id')
        account_ids = body.get('account_ids', [])

        if not session_id or not account_ids:
            return build_cors_response(400, {'error': 'session_id and account_ids are required'})

        executions = []
        skipped = []

        for account_id in account_ids:
            # Fetch account from DynamoDB
            try:
                resp = table.get_item(Key={'session_id': session_id, 'account_id': account_id})
                account = resp.get('Item')
            except Exception as e:
                logger.error(f"DynamoDB get_item failed for {account_id}: {e}")
                skipped.append({'account_id': account_id, 'reason': 'db_error'})
                continue

            if not account:
                logger.warning(f"Account {account_id} not found in session {session_id}")
                skipped.append({'account_id': account_id, 'reason': 'not_found'})
                continue

            # Only process CLASSIFIED + auto_actionable accounts
            if account.get('status') != 'CLASSIFIED':
                logger.warning(f"Skipping {account_id} — status is '{account.get('status')}', expected CLASSIFIED")
                skipped.append({'account_id': account_id, 'reason': f"status_is_{account.get('status')}"})
                continue

            if not account.get('auto_actionable'):
                logger.info(f"Skipping {account_id} — not auto_actionable")
                skipped.append({'account_id': account_id, 'reason': 'not_auto_actionable'})
                continue

            # Start Step Functions execution with idempotent name
            execution_name = f"{session_id[:8]}-{account_id[-8:]}-{uuid.uuid4().hex[:6]}"
            execution_id = None

            if STATE_MACHINE_ARN:
                try:
                    sfn_resp = stepfunctions.start_execution(
                        stateMachineArn=STATE_MACHINE_ARN,
                        name=execution_name,
                        input=json.dumps({
                            'session_id': session_id,
                            'account_id': account_id,
                            'service_name': account.get('service_name', 'Unknown')
                        })
                    )
                    # Return just the readable part of the executionArn
                    execution_id = sfn_resp['executionArn'].split(':')[-1]
                    logger.info(f"Started execution {execution_name} for {account.get('service_name')}")
                except stepfunctions.exceptions.ExecutionAlreadyExists:
                    logger.warning(f"Execution already exists for {account_id}, skipping")
                    execution_id = execution_name
                except Exception as e:
                    logger.error(f"Step Functions start_execution failed for {account_id}: {e}")
                    skipped.append({'account_id': account_id, 'reason': 'sfn_error'})
                    continue
            else:
                logger.warning("STATE_MACHINE_ARN not set — running in local mode")
                execution_id = f"local-{uuid.uuid4().hex[:8]}"

            # Update DynamoDB status → EXECUTING
            try:
                table.update_item(
                    Key={'session_id': session_id, 'account_id': account_id},
                    UpdateExpression='SET #s = :status, execution_id = :eid, updated_at = :ts',
                    ExpressionAttributeNames={'#s': 'status'},
                    ExpressionAttributeValues={
                        ':status': 'EXECUTING',
                        ':eid': execution_id,
                        ':ts': get_current_timestamp()
                    }
                )
            except Exception as e:
                logger.error(f"DynamoDB update failed for {account_id}: {e}")

            executions.append({
                'account_id': account_id,
                'execution_id': execution_id,
                'status': 'EXECUTING'
            })

        return build_cors_response(200, {
            'session_id': session_id,
            'executions': executions,
            'skipped': skipped
        })

    except Exception as e:
        logger.error(f"Unhandled error in action lambda: {e}", exc_info=True)
        return build_cors_response(500, {'error': str(e)})
