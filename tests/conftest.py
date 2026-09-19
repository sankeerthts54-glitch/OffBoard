"""
Offboard Test Fixtures
Shared test fixtures for all test modules.
Owner: Laptop 3 (Orchestration)
"""
import json
import os
import pytest


@pytest.fixture
def sample_session_id():
    return "test-session-001"


@pytest.fixture
def sample_accounts():
    """Sample detected accounts for testing."""
    return [
        {
            "account_id": "acc_001",
            "service_name": "Netflix",
            "category": "streaming",
            "billing_status": "active_recurring",
            "last_activity_date": "2026-09-01",
            "linked_email": "user@gmail.com",
            "shared_with": "family plan",
            "status": "DETECTED"
        },
        {
            "account_id": "acc_002",
            "service_name": "Spotify",
            "category": "streaming",
            "billing_status": "active_recurring",
            "last_activity_date": "2026-09-10",
            "linked_email": "user@gmail.com",
            "shared_with": None,
            "status": "DETECTED"
        },
        {
            "account_id": "acc_003",
            "service_name": "Medium",
            "category": "content",
            "billing_status": "active_recurring",
            "last_activity_date": "2026-08-15",
            "linked_email": "user@gmail.com",
            "shared_with": None,
            "status": "DETECTED"
        },
        {
            "account_id": "acc_004",
            "service_name": "Facebook",
            "category": "social",
            "billing_status": "free",
            "last_activity_date": "2026-07-01",
            "linked_email": "user@gmail.com",
            "shared_with": None,
            "status": "DETECTED"
        },
        {
            "account_id": "acc_005",
            "service_name": "HDFC Bank",
            "category": "banking",
            "billing_status": "free",
            "last_activity_date": "2026-09-15",
            "linked_email": "user@gmail.com",
            "shared_with": "joint account",
            "status": "DETECTED"
        }
    ]


@pytest.fixture
def sample_classified_accounts(sample_accounts):
    """Sample classified accounts for testing."""
    classifications = [
        {"classification": "MIGRATE", "confidence": "high", "reason": "Netflix is available globally but library changes by country.", "auto_actionable": False, "next_step": "Update your country in Netflix settings after relocating."},
        {"classification": "KEEP", "confidence": "high", "reason": "Spotify works globally with same account.", "auto_actionable": False, "next_step": "No action needed."},
        {"classification": "CANCEL", "confidence": "high", "reason": "Medium subscription not needed during transition.", "auto_actionable": True, "next_step": "Cancel Medium membership from account settings."},
        {"classification": "CLOSE_OR_MEMORIALIZE", "confidence": "medium", "reason": "Facebook holds personal identity data.", "auto_actionable": False, "next_step": "Download your data, then deactivate or memorialize the account."},
        {"classification": "TRANSFER", "confidence": "high", "reason": "Joint bank account needs co-owner coordination.", "auto_actionable": False, "next_step": "Coordinate with joint account holder before making changes."},
    ]
    for acc, cls in zip(sample_accounts, classifications):
        acc.update(cls)
        acc["status"] = "CLASSIFIED"
    return sample_accounts


@pytest.fixture
def sample_inbox_data():
    """Sample inbox data for scan testing."""
    return [
        {
            "from": "noreply@netflix.com",
            "subject": "Your monthly bill for September",
            "date": "2026-09-01",
            "snippet": "Your Netflix Premium plan (₹649/mo) has been renewed. Family plan shared with 3 members."
        },
        {
            "from": "no-reply@spotify.com",
            "subject": "Spotify Premium receipt",
            "date": "2026-09-10",
            "snippet": "Thanks for your payment of ₹119 for Spotify Premium Individual."
        },
        {
            "from": "noreply@medium.com",
            "subject": "Your Medium membership renewal",
            "date": "2026-08-15",
            "snippet": "Your Medium membership ($5/month) has been renewed."
        },
        {
            "from": "security@facebookmail.com",
            "subject": "New login to your account",
            "date": "2026-07-01",
            "snippet": "We noticed a new login to your Facebook account from Chrome on Windows."
        },
        {
            "from": "alerts@hdfcbank.net",
            "subject": "Your HDFC Bank account statement",
            "date": "2026-09-15",
            "snippet": "Dear Customer, your joint account statement for September 2026 is ready."
        }
    ]


@pytest.fixture
def api_gateway_event():
    """Helper to create an API Gateway proxy event."""
    def _make_event(body=None, path_params=None, method="POST"):
        event = {
            "httpMethod": method,
            "headers": {"Content-Type": "application/json"},
            "pathParameters": path_params or {},
            "body": json.dumps(body) if body else None,
            "requestContext": {
                "requestId": "test-request-id"
            }
        }
        return event
    return _make_event


@pytest.fixture(autouse=True)
def set_env_vars():
    """Set environment variables for testing."""
    os.environ["TABLE_NAME"] = "OffboardAccounts-test"
    os.environ["BEDROCK_MODEL_ID"] = "anthropic.claude-3-haiku-20240307-v1:0"
    os.environ["STATE_MACHINE_ARN"] = "arn:aws:states:us-east-1:123456789:stateMachine:test"
    os.environ["SNS_TOPIC_ARN"] = "arn:aws:sns:us-east-1:123456789:test-topic"
    yield
    for key in ["TABLE_NAME", "BEDROCK_MODEL_ID", "STATE_MACHINE_ARN", "SNS_TOPIC_ARN"]:
        os.environ.pop(key, None)
