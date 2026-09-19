# Offboard API Contract

## POST /scan
**Request:**
```json
{
  "session_id": "session_12345",
  "inbox_data": [
    {
      "from": "no-reply@netflix.com",
      "subject": "Your Netflix membership renewal",
      "date": "2026-09-15T10:00:00Z",
      "snippet": "We've successfully billed ₹649 for your Premium family plan..."
    }
  ]
}
```

**Response:**
```json
{
  "session_id": "session_12345",
  "accounts": [
    {
      "account_id": "acc_abc123",
      "service_name": "Netflix",
      "category": "streaming",
      "billing_status": "active_recurring",
      "last_activity_date": "2026-09-15T10:00:00Z",
      "linked_email": "user@example.com",
      "shared_with": ["family_member@example.com"],
      "status": "DETECTED"
    }
  ]
}
```

## POST /classify
**Request:**
```json
{
  "session_id": "session_12345",
  "transition_type": "moving_abroad",
  "account_ids": ["acc_abc123", "acc_def456"]
}
```

**Response:**
```json
{
  "session_id": "session_12345",
  "results": [
    {
      "account_id": "acc_abc123",
      "service_name": "Netflix",
      "classification": "CANCEL",
      "confidence": "high",
      "reason": "Streaming service geo-locked, recommend cancelling before move.",
      "auto_actionable": true,
      "next_step": "cancel_subscription",
      "status": "CLASSIFIED"
    }
  ]
}
```

## POST /action
**Request:**
```json
{
  "session_id": "session_12345",
  "account_ids": ["acc_abc123"]
}
```

**Response:**
```json
{
  "session_id": "session_12345",
  "executions": [
    {
      "account_id": "acc_abc123",
      "execution_id": "exec_789xyz",
      "status": "EXECUTING"
    }
  ]
}
```

## GET /status/{session_id}
**Request Parameters:**
- `session_id` (Path Parameter)

**Response:**
```json
{
  "session_id": "session_12345",
  "accounts": [
    {
      "account_id": "acc_abc123",
      "service_name": "Netflix",
      "category": "streaming",
      "classification": "CANCEL",
      "confidence": "high",
      "reason": "Streaming service geo-locked, recommend cancelling before move.",
      "auto_actionable": true,
      "next_step": "cancel_subscription",
      "status": "CANCELLED",
      "billing_status": "active_recurring"
    }
  ]
}
```
