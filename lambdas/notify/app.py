"""
Notify Lambda — Handles SNS notifications and updates DynamoDB status.
Owner: Laptop 1 (completed since Laptop 3 didn't push)
"""
import json
import datetime
import logging
import os
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'OffboardAccounts')
table = dynamodb.Table(TABLE_NAME)

SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', '')


def get_current_timestamp():
    return datetime.datetime.utcnow().isoformat() + 'Z'


def lambda_handler(event, context):
    """
    Triggered by SNS. Each SNS record contains a JSON message with:
    {account_id, session_id, service_name, status, message}
    """
    processed = 0
    errors = 0

    for record in event.get('Records', []):
        try:
            sns_payload = record.get('Sns', {})
            raw_message = sns_payload.get('Message', '{}')

            # SNS can send the Message as a JSON string or a plain string
            try:
                message = json.loads(raw_message)
            except (json.JSONDecodeError, TypeError):
                message = {'raw': raw_message}

            account_id = message.get('account_id')
            session_id = message.get('session_id')
            service_name = message.get('service_name', 'Unknown')
            status = message.get('status', 'UNKNOWN')
            detail = message.get('message', '')

            logger.info(
                f"Notification received — service={service_name}, "
                f"account={account_id}, session={session_id}, status={status}"
            )

            # Update DynamoDB status as a safety net
            # (Step Functions also writes status directly, but this ensures consistency)
            if account_id and session_id and status in ('CANCELLED', 'FAILED'):
                try:
                    table.update_item(
                        Key={'session_id': session_id, 'account_id': account_id},
                        UpdateExpression='SET #s = :status, updated_at = :ts',
                        ExpressionAttributeNames={'#s': 'status'},
                        ExpressionAttributeValues={
                            ':status': status,
                            ':ts': get_current_timestamp()
                        }
                    )
                    logger.info(f"DynamoDB updated: {account_id} → {status}")
                except Exception as ddb_err:
                    logger.error(f"DynamoDB update failed for {account_id}: {ddb_err}")

            # TODO: SES email notification (add sender/recipient after SES verification)
            # send_ses_email(session_id, service_name, status, detail)

            processed += 1

        except Exception as e:
            logger.error(f"Error processing SNS record: {e}", exc_info=True)
            errors += 1

    logger.info(f"Notify lambda complete — processed={processed}, errors={errors}")
    return {'processed': processed, 'errors': errors}
