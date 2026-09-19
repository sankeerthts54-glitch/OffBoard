# 🚀 Offboard — Universal Digital Life-Transition Assistant

> **AWS Bharat Builds — First Commit Hackathon (Sep 17–20, 2026)**

Life events (moving abroad, switching jobs, a breakup, retiring, decluttering) all create the same mess — dozens of accounts and subscriptions scattered across email, nobody sure what to keep, transfer, or cancel.

**Offboard** is a single engine with one front-end question: *"What's changing?"* — then the same backend pipeline (**Scan → Classify → Act**) adapts its logic to that context.

---

## 🏗️ Architecture

| AWS Service | Role |
|---|---|
| **Lambda** | Email/account scanning, classification, action execution |
| **Bedrock** | AI classification engine (context-aware per transition type) |
| **DynamoDB** | Detected accounts + status tracking |
| **Step Functions** | Orchestrates auto-cancellation sequence with retry logic |
| **EventBridge** | Scheduled re-scans and reminders |
| **SNS/SES** | User notifications for completed/pending actions |
| **Amplify** | React frontend hosting |
| **API Gateway** | REST API layer |

## 🔄 Flow

1. **Pick transition**: Moving abroad / New job / Breakup / Retirement / Family affairs / Decluttering
2. **Scan**: App scans linked accounts via email metadata (simulated for demo)
3. **Classify**: AI sorts each item → Keep / Transfer / Cancel / Close or Memorialize / Migrate
4. **Act**: Auto-execute cancellations where possible; generate manual checklists for the rest
5. **Track**: Monitor progress, get notifications on completion

## 📂 Project Structure

```
OffBoard/
├── template.yaml              # SAM template (all AWS resources)
├── frontend/                  # React + Vite + Tailwind
├── lambdas/
│   ├── scan/                  # Inbox parser
│   ├── classify/              # Bedrock AI classifier
│   ├── action/                # Step Functions trigger
│   ├── status/                # Status fetcher
│   ├── notify/                # SNS/SES handler
│   └── mock_cancel/           # Mock subscription cancel API
├── shared/                    # Shared types & contracts
├── statemachines/             # Step Functions ASL definitions
├── sample_data/               # Demo inbox data
└── tests/                     # Unit & integration tests
```

## 🚀 Quick Start

### Backend (SAM)
```bash
# Prerequisites: Python 3.11+, AWS SAM CLI, Docker
sam build
sam local start-api  # Local development
sam deploy --guided   # Deploy to AWS
```

### Frontend
```bash
cd frontend
npm install
npm run dev           # Local development (http://localhost:5173)
```

## 👥 Team

Built with ❤️ for the AWS Bharat Builds First Commit Hackathon.

## 📄 License

MIT
