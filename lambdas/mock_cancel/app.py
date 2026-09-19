"""
Mock Cancel Lambda — Simulates a real subscription cancellation API.
Invoked directly by Step Functions (not via API Gateway).
Owner: Laptop 1 (completed since Laptop 3 didn't push)
"""
import json
import logging
import time
import random

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    """
    Called by Step Functions with:
    {
        "action": "validate" | "cancel",
        "account_id": "acc_xxx",
        "session_id": "session_yyy",
        "service_name": "Netflix"
    }
    Note: event is raw dict (not API Gateway proxy) — no event['body'] parsing needed.
    """
    action = event.get('action', 'cancel')
    account_id = event.get('account_id', 'unknown')
    service_name = event.get('service_name', 'Unknown Service')
    session_id = event.get('session_id', 'unknown')

    logger.info(f"MockCancel invoked — action={action}, service={service_name}, account={account_id}")

    # Simulate network latency
    time.sleep(random.uniform(0.5, 1.5))

    # --- VALIDATE action ---
    if action == 'validate':
        logger.info(f"Validation successful for {service_name}")
        return {
            'success': True,
            'action': 'validate',
            'account_id': account_id,
            'service_name': service_name,
            'message': f'Account {service_name} is valid and ready for cancellation.'
        }

    # --- CANCEL action ---
    # 70% success, 30% temporary failure (triggers Step Functions retry)
    success_roll = random.random()
    is_success = success_roll < 0.70

    if is_success:
        logger.info(f"Cancellation SUCCESS for {service_name} ({account_id}) — roll={success_roll:.2f}")
        return {
            'success': True,
            'action': 'cancel',
            'account_id': account_id,
            'service_name': service_name,
            'message': f'Subscription for {service_name} successfully cancelled.'
        }
    else:
        # Raise with the exact error name the ASL catches for retry
        error_msg = f"CancellationTemporaryError: {service_name} API temporarily unavailable (roll={success_roll:.2f})"
        logger.warning(f"Cancellation FAILED (retriable) for {service_name} — {error_msg}")
        raise Exception(error_msg)
