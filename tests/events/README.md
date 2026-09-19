# Test events for local SAM testing

This directory can hold JSON event files for testing Lambda functions locally.

Example:
```bash
sam local invoke ScanFunction --event tests/events/scan_event.json
```
