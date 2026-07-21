import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const MODEL_NAME = "claude-3-5-sonnet-20241022";

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
}

interface DraftEmail {
  to: string;
  subject: string;
  body: string;
}

// Mock Gmail data storage
const gmailDatabase: { inbox: EmailMessage[]; sent: DraftEmail[] } = {
  inbox: [
    {
      id: "1",
      from: "customer1@example.com",
      subject: "Order Issue - Need Help",
      body: "Hi, I received my order today but one item is missing. Can you help me?",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      from: "customer2@example.com",
      subject: "Refund Status",
      body: "I submitted a refund request 5 days ago. Can you provide an update?",
      timestamp: new Date().toISOString(),
    },
    {
      id: "3",
      from: "customer3@example.com",
      subject: "Product Quality Complaint",
      body: "The product quality is not as described. Very disappointed.",
      timestamp: new Date().toISOString(),
    },
  ],
  sent: [],
};

// Define Gmail tools
const tools: Anthropic.Tool[] = [
  {
    name: "read_email",
    description: "Read a specific email from the inbox",
    input_schema: {
      type: "object" as const,
      properties: {
        email_id: {
          type: "string",
          description: "The ID of the email to read",
        },
      },
      required: ["email_id"],
    },
  },
  {
    name: "list_inbox",
    description: "List all emails in the inbox",
    input_schema: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description: "Number of emails to retrieve (default: 10)",
        },
      },
      required: [],
    },
  },
  {
    name: "search_emails",
    description: "Search for emails by keyword in subject or body",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Search term",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "draft_email",
    description: "Draft a customer support email response",
    input_schema: {
      type: "object" as const,
      properties: {
        to: {
          type: "string",
          description: "Recipient email address",
        },
        subject: {
          type: "string",
          description: "Email subject line",
        },
        body: {
          type: "string",
          description: "Email body - keep professional and helpful",
        },
      },
      required: ["to", "subject", "body"],
    },
  },
  {
    name: "send_email",
    description: "Send a drafted customer support email",
    input_schema: {
      type: "object" as const,
      properties: {
        draft_index: {
          type: "number",
          description: "Index of the draft email to send",
        },
      },
      required: ["draft_index"],
    },
  },
];

function readEmail(emailId: string): EmailMessage | { error: string } {
  const email = gmailDatabase.inbox.find((e) => e.id === emailId);
  if (!email) {
    return { error: `Email with ID ${emailId} not found` };
  }
  return email;
}

function listInbox(limit: number = 10): EmailMessage[] {
  return gmailDatabase.inbox.slice(0, limit);
}

function searchEmails(query: string): EmailMessage[] {
  const lowerQuery = query.toLowerCase();
  return gmailDatabase.inbox.filter(
    (e) =>
      e.subject.toLowerCase().includes(lowerQuery) ||
      e.body.toLowerCase().includes(lowerQuery) ||
      e.from.toLowerCase().includes(lowerQuery)
  );
}

function draftEmail(
  to: string,
  subject: string,
  body: string
): { status: string; index: number; preview: DraftEmail } {
  const draft = { to, subject, body };
  gmailDatabase.sent.push(draft);
  return {
    status: "draft_created",
    index: gmailDatabase.sent.length - 1,
    preview: draft,
  };
}

function sendEmail(draftIndex: number): object {
  if (draftIndex < 0 || draftIndex >= gmailDatabase.sent.length) {
    return {
      status: "error",
      message: `Invalid draft index: ${draftIndex}`,
    };
  }

  const draft = gmailDatabase.sent[draftIndex];
  return {
    status: "sent",
    timestamp: new Date().toISOString(),
    message: `Email successfully sent to ${draft.to} with subject "${draft.subject}"`,
  };
}

function processToolCall(
  toolName: string,
  toolInput: Record<string, string | number>
): object {
  switch (toolName) {
    case "read_email":
      return readEmail(toolInput.email_id as string);
    case "list_inbox":
      return { emails: listInbox((toolInput.limit as number) || 10) };
    case "search_emails":
      return { results: searchEmails(toolInput.query as string) };
    case "draft_email":
      return draftEmail(
        toolInput.to as string,
        toolInput.subject as string,
        toolInput.body as string
      );
    case "send_email":
      return sendEmail(toolInput.draft_index as number);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

async function gmailAssistant(userMessage: string): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`User: ${userMessage}`);
  console.log('='.repeat(60));

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: userMessage,
    },
  ];

  let response = await client.messages.create({
    model: MODEL_NAME,
    max_tokens: 4096,
    tools: tools,
    messages: messages,
  });

  console.log(`\nInitial Response - Stop Reason: ${response.stop_reason}`);

  while (response.stop_reason === "tool_use") {
    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
    );

    if (toolUseBlocks.length === 0) break;

    for (const toolUseBlock of toolUseBlocks) {
      console.log(`\n📧 Tool: ${toolUseBlock.name}`);
      console.log(`   Input: ${JSON.stringify(toolUseBlock.input, null, 2)}`);

      const toolResult = processToolCall(
        toolUseBlock.name,
        toolUseBlock.input as Record<string, string | number>
      );

      console.log(`   Result: ${JSON.stringify(toolResult, null, 2)}`);

      messages.push({
        role: "assistant",
        content: response.content,
      });

      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUseBlock.id,
            content: JSON.stringify(toolResult),
          },
        ],
      });
    }

    response = await client.messages.create({
      model: MODEL_NAME,
      max_tokens: 4096,
      tools: tools,
      messages: messages,
    });

    console.log(`\nNext Response - Stop Reason: ${response.stop_reason}`);
  }

  const finalTextBlocks = response.content.filter(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );

  if (finalTextBlocks.length > 0) {
    const finalResponse = finalTextBlocks.map((block) => block.text).join("");
    console.log(`\n✉️ Assistant: ${finalResponse}`);
  }
}

async function main(): Promise<void> {
  try {
    // Scenario 1: Check inbox and identify support requests
    await gmailAssistant(
      "Check my Gmail inbox and tell me about any customer support requests that need urgent attention."
    );

    // Scenario 2: Find specific issues and draft responses
    await gmailAssistant(
      "Search for emails about refunds, read them, and draft helpful response emails."
    );

    // Scenario 3: Handle product complaints
    await gmailAssistant(
      "Look for any complaint emails in my inbox and send professional apology responses offering help."
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

main();