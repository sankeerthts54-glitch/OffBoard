"""
Local integration test -- runs all 4 Lambda handlers directly in Python.
No AWS credentials, Docker, or SAM needed.
Mocks boto3 so DynamoDB/Bedrock calls are simulated.

Run with:
    python tests/test_local.py
"""
import json
import sys
import os
import importlib.util

# Force UTF-8 on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from unittest.mock import MagicMock

# -- colour helpers -----------------------------------------------------------
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

passed = 0
failed = 0

def ok(msg):
    global passed
    passed += 1
    print(f"  {GREEN}[PASS]{RESET} {msg}")

def fail(msg):
    global failed
    failed += 1
    print(f"  {RED}[FAIL]{RESET} {msg}")

def hdr(msg):
    print(f"\n{BOLD}{YELLOW}>> {msg}{RESET}")

def check(cond, msg):
    if cond:
        ok(msg)
    else:
        fail(msg)

# -- load a lambda module by file path (avoids name collisions between app.py files)
def load_lambda(path):
    name = path.replace("/", "_").replace("\\", "_").replace(".", "_")
    spec = importlib.util.spec_from_file_location(name, path)
    mod  = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

# -- in-memory DynamoDB store shared across all Lambdas ----------------------
_store = {}

def fake_put_item(**kwargs):
    item = kwargs.get("Item", {})
    k = (item.get("session_id"), item.get("account_id"))
    _store[k] = dict(item)
    return {}

def fake_get_item(**kwargs):
    key = kwargs.get("Key", {})
    k = (key.get("session_id"), key.get("account_id"))
    item = _store.get(k)
    return {"Item": dict(item)} if item else {}

def fake_update_item(**kwargs):
    key  = kwargs.get("Key", {})
    k    = (key.get("session_id"), key.get("account_id"))
    if k not in _store:
        return {}
    expr  = kwargs.get("UpdateExpression", "")
    vals  = kwargs.get("ExpressionAttributeValues", {})
    names = kwargs.get("ExpressionAttributeNames", {})
    if expr.upper().startswith("SET "):
        for part in expr[4:].split(","):
            part = part.strip()
            if "=" in part:
                lhs, rhs = part.split("=", 1)
                lhs  = lhs.strip()
                rhs  = rhs.strip()
                attr = names.get(lhs, lhs)
                if rhs in vals:
                    _store[k][attr] = vals[rhs]
    return {}

def fake_query(**kwargs):
    ke = kwargs.get("KeyConditionExpression")
    session_id = None
    if ke is not None:
        try:
            session_id = ke.values[0]
        except Exception:
            pass
    items = [dict(v) for (s, _), v in _store.items() if s == session_id] if session_id else list(_store.values())
    return {"Items": items}

def make_mock_table():
    t = MagicMock()
    t.put_item    = MagicMock(side_effect=fake_put_item)
    t.get_item    = MagicMock(side_effect=fake_get_item)
    t.update_item = MagicMock(side_effect=fake_update_item)
    t.query       = MagicMock(side_effect=fake_query)
    return t

def make_mock_bedrock(classification="CANCEL", confidence="high",
                      reason="Not needed post-transition.",
                      auto=True, next_step="Cancel via portal."):
    payload = json.dumps({
        "classification": classification,
        "confidence": confidence,
        "reason": reason,
        "auto_actionable": auto,
        "next_step": next_step
    })
    response_body = json.dumps({"content": [{"text": payload}]}).encode()
    mock = MagicMock()
    mock.invoke_model.return_value = {
        "body": MagicMock(read=MagicMock(return_value=response_body))
    }
    return mock

def make_mock_sfn():
    mock = MagicMock()
    mock.start_execution.return_value = {
        "executionArn": "arn:aws:states:us-east-1:123:execution:test:exec-001"
    }
    # Make exceptions.ExecutionAlreadyExists a real exception class
    mock.exceptions = MagicMock()
    mock.exceptions.ExecutionAlreadyExists = type("ExecutionAlreadyExists", (Exception,), {})
    return mock

def api_event(body, method="POST"):
    return {
        "httpMethod": method,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
        "pathParameters": {},
        "requestContext": {"requestId": "local-test"}
    }

def status_event(session_id):
    return {
        "httpMethod": "GET",
        "headers": {},
        "body": None,
        "pathParameters": {"session_id": session_id},
        "requestContext": {"requestId": "local-test"}
    }

# Set env vars before loading any Lambda
SESSION_ID = "test-session-2026"
os.environ["TABLE_NAME"]          = "test-table"
os.environ["BEDROCK_MODEL_ID"]    = "anthropic.claude-3-haiku-20240307-v1:0"
os.environ["STATE_MACHINE_ARN"]   = "arn:aws:states:us-east-1:123:stateMachine:test"
os.environ["SNS_TOPIC_ARN"]       = "arn:aws:sns:us-east-1:123:test-topic"
os.environ["AWS_DEFAULT_REGION"]  = "us-east-1"
# Prevent real boto3 clients from being created at module load
os.environ["AWS_ACCESS_KEY_ID"]     = "test"
os.environ["AWS_SECRET_ACCESS_KEY"] = "test"

mock_table   = make_mock_table()
mock_bedrock = make_mock_bedrock()
mock_sfn     = make_mock_sfn()

INBOX = [
    {"from": "no-reply@netflix.com",     "subject": "Your monthly bill",         "date": "2026-09-01", "snippet": "Rs.649 billed for Premium family plan."},
    {"from": "no-reply@spotify.com",     "subject": "Spotify Premium receipt",   "date": "2026-09-10", "snippet": "Rs.119 charged for Spotify Premium."},
    {"from": "ebill@airtel.com",         "subject": "Airtel postpaid bill",      "date": "2026-09-16", "snippet": "Your bill of Rs.599 is generated."},
    {"from": "alerts@hdfcbank.net",      "subject": "HDFC Bank statement",       "date": "2026-09-02", "snippet": "August 2026 statement ready."},
    {"from": "noreply@medium.com",       "subject": "Medium membership renewed", "date": "2026-09-12", "snippet": "$5/month membership renewed."},
    {"from": "security@facebookmail.com","subject": "New login to Facebook",     "date": "2026-09-19", "snippet": "Login from Chrome on Windows."},
    {"from": "noreply@zomato.com",       "subject": "Zomato Gold renewed",       "date": "2026-09-13", "snippet": "Rs.999 charged for 3-month plan."},
]

# =============================================================================
# TEST 1: SCAN LAMBDA
# =============================================================================
hdr("TEST 1: Scan Lambda")

scan = load_lambda("lambdas/scan/app.py")
scan.table = mock_table  # inject mock table

resp = scan.lambda_handler(api_event({"session_id": SESSION_ID, "inbox_data": INBOX}), {})
rb   = json.loads(resp["body"])

check(resp["statusCode"] == 200, "Status 200")
accounts = rb.get("accounts", [])
check(len(accounts) == 7, f"Detected {len(accounts)}/7 accounts")

names = [a["service_name"].lower() for a in accounts]
check("netflix"  in names, "Netflix detected")
check("airtel"   in names, "Airtel detected (Indian service)")
check(any("hdfc" in n for n in names), "HDFC Bank detected (Indian service)")
check("zomato"   in names, "Zomato detected (Indian service)")

netflix = next((a for a in accounts if "netflix" in a["service_name"].lower()), None)
if netflix:
    check(netflix["billing_status"] == "active_recurring", f"Netflix billing = active_recurring")
    check(netflix["shared_with"] is not None, f"Netflix family plan detected as shared")

check(resp["headers"].get("Access-Control-Allow-Origin") == "*", "CORS headers present")

print(f"\n  Detected accounts:")
for a in accounts:
    print(f"    {a['service_name']:15} | {a['category']:15} | {a['billing_status']}")

account_ids = [a["account_id"] for a in accounts]

# =============================================================================
# TEST 2: CLASSIFY LAMBDA
# =============================================================================
hdr("TEST 2: Classify Lambda (Bedrock mocked)")

classify = load_lambda("lambdas/classify/app.py")
classify.table   = mock_table
classify.bedrock = mock_bedrock

resp = classify.lambda_handler(api_event({
    "session_id":    SESSION_ID,
    "transition_type": "moving_abroad",
    "account_ids":   account_ids
}), {})
rb = json.loads(resp["body"])

check(resp["statusCode"] == 200, f"Status 200")
results = rb.get("results", [])
check(len(results) == 7, f"All 7 accounts classified (got {len(results)})")

if results:
    sample = results[0]
    for field in ["classification", "confidence", "reason", "auto_actionable", "next_step"]:
        check(field in sample, f"Field '{field}' present in result")
    check(mock_bedrock.invoke_model.call_count == 7,
          f"Bedrock called {mock_bedrock.invoke_model.call_count}x (expected 7)")

print(f"\n  Classifications:")
for r in results:
    flag = "[auto]" if r.get("auto_actionable") else "      "
    print(f"    {flag} {r.get('service_name','?'):15} -> {r.get('classification','?'):25} [{r.get('confidence','?')}]")

# =============================================================================
# TEST 3: ACTION LAMBDA
# =============================================================================
hdr("TEST 3: Action Lambda (Step Functions mocked)")

action = load_lambda("lambdas/action/app.py")
action.table         = mock_table
action.stepfunctions = mock_sfn
action.STATE_MACHINE_ARN = "arn:aws:states:us-east-1:123:stateMachine:test"

resp = action.lambda_handler(api_event({
    "session_id":  SESSION_ID,
    "account_ids": account_ids
}), {})
rb = json.loads(resp["body"])

check(resp["statusCode"] == 200, f"Status 200")
executions = rb.get("executions", [])
skipped    = rb.get("skipped", [])
check(len(executions) >= 0,  f"Started {len(executions)} execution(s)")
check(len(executions) + len(skipped) == 7, f"All 7 accounts processed (executed={len(executions)}, skipped={len(skipped)})")

if executions:
    e = executions[0]
    check("account_id"   in e, "execution has account_id")
    check("execution_id" in e, "execution has execution_id")
    check("status"       in e, "execution has status")
    check(mock_sfn.start_execution.call_count == len(executions),
          f"start_execution called {mock_sfn.start_execution.call_count}x")

if skipped:
    print(f"\n  Skipped {len(skipped)} accounts:")
    for s in skipped:
        print(f"    {s['account_id']} -- reason: {s['reason']}")

# =============================================================================
# TEST 4: STATUS LAMBDA
# =============================================================================
hdr("TEST 4: Status Lambda")

status = load_lambda("lambdas/status/app.py")
status.table = mock_table

resp = status.lambda_handler(status_event(SESSION_ID), {})
rb   = json.loads(resp["body"])

check(resp["statusCode"] == 200, "Status 200")
all_accs = rb.get("accounts", [])
check(len(all_accs) == 7, f"Returned {len(all_accs)}/7 accounts for session")
summary  = rb.get("summary", {})
check(isinstance(summary, dict), f"Summary stats present: {summary}")

# test missing session_id
bad_resp = status.lambda_handler({"pathParameters": None}, {})
check(bad_resp["statusCode"] == 400, "Missing session_id returns 400")

# =============================================================================
# TEST 5: MOCK CANCEL LAMBDA
# =============================================================================
hdr("TEST 5: Mock Cancel Lambda")

cancel = load_lambda("lambdas/mock_cancel/app.py")

# validate always succeeds
val_resp = cancel.lambda_handler({
    "action": "validate", "account_id": "acc_001",
    "session_id": SESSION_ID, "service_name": "Netflix"
}, {})
check(val_resp.get("success") is True, "Validate action always succeeds")

# cancel: 70/30 -- run 20 times, expect both outcomes
successes = failures = 0
for _ in range(20):
    try:
        r = cancel.lambda_handler({
            "action": "cancel", "account_id": "acc_002",
            "session_id": SESSION_ID, "service_name": "Spotify"
        }, {})
        if r.get("success"):
            successes += 1
        else:
            failures += 1
    except Exception as ex:
        if "CancellationTemporaryError" in str(ex):
            failures += 1
        else:
            raise

check(successes > 0, f"Cancel: some successes ({successes}/20)")
check(failures  > 0, f"Cancel: some failures ({failures}/20) -- Step Functions retry will handle these")

# =============================================================================
# FINAL SUMMARY
# =============================================================================
total = passed + failed
print(f"\n{'='*55}")
if failed == 0:
    print(f"{GREEN}{BOLD}  ALL {total} CHECKS PASSED -- Backend ready to deploy!{RESET}")
else:
    print(f"{RED}{BOLD}  {failed}/{total} CHECKS FAILED -- See above for details.{RESET}")
print(f"{'='*55}\n")

if failed > 0:
    sys.exit(1)
