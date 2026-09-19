import uuid
import time
import json

TRANSITION_TYPES = ['moving_abroad', 'new_job', 'breakup', 'retirement', 'family_affairs', 'decluttering']
CLASSIFICATIONS = ['KEEP', 'TRANSFER', 'CANCEL', 'CLOSE_OR_MEMORIALIZE', 'MIGRATE']
CONFIDENCE_LEVELS = ['high', 'medium', 'low']
ACCOUNT_STATUSES = ['DETECTED', 'CLASSIFIED', 'EXECUTING', 'CANCELLED', 'FAILED', 'MANUAL']
CATEGORIES = ['streaming', 'banking', 'utility', 'social', 'cloud_storage', 'saas', 'fitness', 'content', 'finance', 'shopping', 'food_delivery', 'travel']
BILLING_STATUSES = ['active_recurring', 'free', 'unknown']

def generate_session_id():
    """Generates a unique session ID."""
    return f"session_{uuid.uuid4().hex[:12]}"

def generate_account_id():
    """Generates a unique account ID."""
    return f"acc_{uuid.uuid4().hex[:12]}"

def get_current_timestamp():
    """Returns current timestamp as an ISO string."""
    from datetime import datetime
    return datetime.utcnow().isoformat() + "Z"

def build_cors_response(status_code: int, body: dict):
    """Builds an API Gateway proxy response with CORS headers."""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(body)
    }
