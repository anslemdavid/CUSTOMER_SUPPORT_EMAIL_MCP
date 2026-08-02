# 📧 Customer Support Email MCP

<p>
  <a href="https://github.com/anslemdavid/CUSTOMER_SUPPORT_EMAIL_MCP">
    <img src="https://img.shields.io/badge/View%20Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="view code" />
  </a>
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Runtime-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/License-MIT-000?style=for-the-badge" alt="license" />
</p>

## Built with / Development tools

<p>
  <img src="https://skillicons.dev/icons?i=typescript,nodejs,npm,vscode,java,cs,css,python" alt="tools" />
</p>

**Languages & Frameworks:** TypeScript (Node.js) — recommended: Node 18, TypeScript 5

**Integrations:** Gmail API, Anthropic Claude

**Editor:** VS Code

---

Let Claude read, search, draft, and send customer support emails directly through Gmail — no manual copy-pasting required!

## Features

- Read emails from Gmail
- Search and filter by keywords
- Draft professional responses using Claude
- Send drafted emails through Gmail (with proper OAuth setup)

## Requirements

- Node.js (recommended: 18+)
- npm
- Claude / Anthropic API key (for AI features)
- Gmail API credentials (OAuth client ID and secret)

## Installation

```bash
git clone https://github.com/anslemdavid/CUSTOMER_SUPPORT_EMAIL_MCP
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

## Environment variables

Copy `.env.example` and fill in your keys (do NOT commit secrets):

```bash
# Anthropic / Claude
ANTHROPIC_API_KEY=your_anthropic_key

# Gmail OAuth
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=http://localhost:3000/oauth2callback
GMAIL_REFRESH_TOKEN=your_refresh_token
```

## Example Functions

### read_email
Read a specific email from the inbox.

```typescript
read_email({ email_id: "1" })
// Returns email with from, subject, body, timestamp
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

---

## Security & Notes

- Do NOT commit API keys or OAuth credentials. Use environment variables or GitHub Secrets.
- For production, use a secure secrets store and rotate credentials regularly.

## Integration Notes

- Configure Gmail OAuth credentials in Google Cloud Console and add the redirect URI used by this project.
- Store Anthropic/Claude API keys in ANTHROPIC_API_KEY env var.

## Contact

For issues or questions, open an issue or contact: anslemdavdmuse@email.com
