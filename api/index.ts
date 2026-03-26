import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DROPMAIL_URL =
  "https://dropmail.me/api/graphql/af_AQVpxNazAQVsJnTBSfmcQFFiyMfBqhq6drh9XVFQ";

async function dropMailQuery(
  query: string,
  variables?: Record<string, unknown>,
) {
  const response = await fetch(DROPMAIL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`DropMail API error: ${response.status}`);
  }

  const data = (await response.json()) as {
    data?: unknown;
    errors?: Array<{ message: string }>;
  };

  if (data.errors && data.errors.length > 0) {
    throw new Error(data.errors[0].message);
  }

  return data.data;
}

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/email/create", async (_req, res) => {
  try {
    const data = (await dropMailQuery(`
      mutation {
        introduceSession {
          id
          expiresAt
          addresses {
            address
          }
        }
      }
    `)) as {
      introduceSession: {
        id: string;
        expiresAt: string;
        addresses: Array<{ address: string }>;
      };
    };

    const session = data.introduceSession;
    res.json({
      sessionId: session.id,
      email: session.addresses[0]?.address ?? "",
      expiresAt: session.expiresAt,
    });
  } catch {
    res.status(500).json({ error: "មិនអាចបង្កើត Email បានទេ" });
  }
});

app.get("/api/email/:sessionId/messages", async (req, res) => {
  try {
    const sessionId = req.params.sessionId as string;

    const data = (await dropMailQuery(
      `
      query GetMessages($id: ID!) {
        session(id: $id) {
          mails {
            id
            fromAddr
            toAddr
            headerSubject
            receivedAt
            text
            html
          }
        }
      }
    `,
      { id: sessionId },
    )) as {
      session: {
        mails: Array<{
          id: string;
          fromAddr: string;
          toAddr: string;
          headerSubject: string;
          receivedAt: string;
          text: string;
          html: string;
        }>;
      } | null;
    };

    if (!data.session) {
      res.status(500).json({ error: "Session មិនត្រឹមត្រូវ" });
      return;
    }

    const messages = (data.session.mails ?? []).map((m) => ({
      id: m.id,
      fromAddr: m.fromAddr,
      toAddr: m.toAddr,
      headerSubject: m.headerSubject || "(មិនមានប្រធានបទ)",
      receivedAt: m.receivedAt,
      text: m.text ?? "",
      html: m.html ?? "",
    }));

    res.json({ messages });
  } catch {
    res.status(500).json({ error: "មិនអាចទទួលបាន Messages" });
  }
});

export default app;
