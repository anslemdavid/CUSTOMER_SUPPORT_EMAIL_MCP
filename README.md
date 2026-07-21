# 📧 Kundensupport Email MCP

> Let Claude read, search, draft, and send customer-support emails directly through Gmail — no manual copy-pasting.

---

## ✨ What is this?

This config connects Claude to a **Gmail inbox** via MCP, so it can help manage customer support (*Kundensupport*) email conversations: reading incoming messages, drafting replies, searching threads, and sending responses — all through natural language.

| | |
|---|---|
| 🔌 **Server** | [`@gongrzhe/server-gmail-autoauth-mcp`](https://github.com/GongRzhe/Gmail-MCP-Server) |
| 📬 **Capabilities** | Send, search, read, and organize emails, with attachment support |
| 🔐 **Auth** | Google OAuth2 (one-time setup, auto-refreshes after) |
| ⚙️ **Setup time** | ~5 minutes (includes Google Cloud step) |

---

## 📦 What's inside

```
kundensupport-email/
├── email-kundensupport.json   ← MCP server config
└── README-Kundensupport.md    ← you are here
```

---

## 🚀 Setup

### 1️⃣ Create Google OAuth credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create (or select) a project
3. Enable the **Gmail API**
4. Under **APIs & Services → Credentials**, create an **OAuth Client ID** (type: Desktop App)
5. Download the credentials as `gcp-oauth.keys.json`

### 2️⃣ Place credentials
```bash
mkdir -p ~/.gmail-mcp
mv gcp-oauth.keys.json ~/.gmail-mcp/
```

### 3️⃣ Authenticate once
```bash
npx @gongrzhe/server-gmail-autoauth-mcp auth
```
This opens a browser to sign in and grant access. Credentials are then stored securely and refresh automatically — no need to repeat this step.

### 4️⃣ Connect it
Rename `email-kundensupport.json` to `.mcp.json` (for Claude Code) and place it at your project root, **or** merge its contents into your `claude_desktop_config.json`:

| OS | Location |
|---|---|
| 🍎 macOS/Linux | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| 🪟 Windows | `%AppData%\Claude\claude_desktop_config.json` |

Restart Claude Code or Claude Desktop.

---

## 💬 Try it out

> ✉️ *"Show me unread support emails from today"*
> ✍️ *"Draft a reply to the customer asking about their refund"*
> 📤 *"Send that reply once I approve it"*

---

## ⚠️ Security Notes

- This grants **real access** to the connected Gmail account — only connect an inbox you're comfortable with Claude reading/sending from.
- Consider using a **dedicated support inbox** (e.g. `support@yourcompany.de`) rather than a personal account.
- Review drafts before sending — treat Claude as a fast drafting assistant, not an autonomous sender, unless you fully trust the workflow.

---

## 📄 License

Configuration is free to use and modify. The underlying server is MIT licensed.
