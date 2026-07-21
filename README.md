# 📧 Customer Support Email MCP

Let Claude read, search, draft, and send customer support emails directly through Gmail — no manual copy-pasting required!

## Features

✉️ **Read Emails** - Claude reads support requests from your inbox
🔍 **Search** - Find emails by keyword instantly
✍️ **Draft** - Claude auto-drafts professional responses
📤 **Send** - Send emails directly without leaving Claude
🤖 **AI-Powered** - Intelligent response generation for common issues

## Installation

```bash
cd CUSTOMER_SUPPORT_EMAIL_MCP
npm install
```

## Usage

### Development

```bash
npm run dev
```

### Build & Run

```bash
npm run build
npm start
```

## Available Functions

### read_email
Read a specific email from the inbox.

```typescript
read_email({ email_id: "1" })
// Returns email with from, subject, body, timestamp
```

### list_inbox
List emails from the inbox.

```typescript
list_inbox({ limit: 10 })
// Returns array of emails
```

### search_emails
Search for emails by keyword.

```typescript
search_emails({ query: "refund" })
// Returns matching emails
```

### draft_email
Draft a response email.

```typescript
draft_email({
  to: "customer@example.com",
  subject: "RE: Your Support Request",
  body: "Thank you for contacting us..."
})
// Returns draft with index
```

### send_email
Send a drafted email.

```typescript
send_email({ draft_index: 0 })
// Returns confirmation
```

## Example Workflow

1. **Tell Claude**: "Check my support emails and send responses to unhappy customers"
2. **Claude reads** all inbox emails
3. **Claude searches** for complaint keywords
4. **Claude drafts** professional responses
5. **Claude sends** the emails automatically

## Integration with Claude

Configure this MCP in Claude's settings to enable:
- "What are my support requests?"
- "Draft responses to angry customers"
- "Send thank you emails to recent customers"

## Requirements

- Node.js 16+
- TypeScript
- Anthropic Claude API key

## Technical Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Protocol**: Model Context Protocol (MCP)
- **AI**: Anthropic Claude 3.5 Sonnet

## License

MIT