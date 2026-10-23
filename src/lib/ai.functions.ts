import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const emailSchema = z.object({
  kind: z.literal("email"),
  recipient: z.string().min(1).max(200),
  purpose: z.string().min(1).max(500),
  details: z.string().max(4000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});
const researchSchema = z.object({
  kind: z.literal("research"),
  mode: z.enum(["topic", "article", "url"]),
  input: z.string().min(1).max(30000),
});
const chatSchema = z.object({
  kind: z.literal("chat"),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(20000) }))
    .min(1)
    .max(40),
});
const inputSchema = z.discriminatedUnion("kind", [emailSchema, researchSchema, chatSchema]);
type Input = z.infer<typeof inputSchema>;

const toneGuide = {
  Formal: "polished, respectful, concise corporate language; no contractions or slang",
  Friendly: "warm, approachable and conversational while remaining professional",
  Persuasive: "confident and benefit-led, with a clear value proposition and a specific call to action",
};

function buildPrompt(i: Input): { instructions: string; input: string } {
  if (i.kind === "email") {
    return {
      instructions: `You are an expert business communications writer. Write ONE complete, ready-to-send email.
Rules:
- Tone: ${i.tone} — ${toneGuide[i.tone]}.
- Start with "Subject: <specific subject line>", then a blank line, then the email body.
- Address the recipient appropriately for the tone.
- Use every key detail provided; do not invent facts, names, dates or figures. Use [bracketed placeholders] only where essential information is missing.
- Structure: purpose in the opening line, supporting details, a clear next step, a sign-off.
- Plain text only, no markdown. Keep it under 250 words unless the details require more.`,
      input: `Recipient: ${i.recipient}\nPurpose: ${i.purpose}\nKey details:\n${i.details || "(none provided)"}`,
    };
  }
  if (i.kind === "research") {
    const src =
      i.mode === "topic"
        ? `Topic to research from your general knowledge: ${i.input}`
        : i.mode === "article"
          ? `Article text to analyse (base analysis ONLY on this text):\n"""\n${i.input}\n"""`
          : `URL provided: ${i.input}\nYou cannot browse the web. State clearly at the top that the page content was not retrieved, then analyse only what can reasonably be inferred from the URL and general knowledge of the subject, marking assumptions.`;
    return {
      instructions: `You are a senior research analyst preparing a briefing for a busy professional.
Produce plain text with these exact section headings, each on its own line in uppercase:
SUMMARY
(3-5 sentences)
KEY FINDINGS
(4-6 bullets starting with "- ", specific and factual)
INSIGHTS
(3-4 bullets on implications, trends or tensions)
RECOMMENDATIONS
(3-5 numbered, actionable steps a team could take)
LIMITATIONS
(1-2 bullets on gaps, uncertainty or what to verify)
Do not use markdown symbols like ** or #. Be specific to the material; avoid generic filler.`,
      input: src,
    };
  }
  const transcript = i.messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");
  return {
    instructions: `You are Atlas, a workplace productivity assistant. Help with planning, writing, meetings, prioritisation, analysis and professional communication.
- Use the conversation history for context and refer back to earlier details.
- Be practical and specific; prefer short paragraphs, numbered steps or "- " bullets.
- Ask one brief clarifying question only if the request is truly ambiguous.
- Plain text, no markdown headings or bold markers. Never fabricate facts; flag uncertainty.`,
    input: `${transcript}\n\nAssistant:`,
  };
}

function extractText(res: unknown): string {
  const r = res as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  if (typeof r.output_text === "string" && r.output_text) return r.output_text;
  const parts: string[] = [];
  for (const item of r.output ?? [])
    for (const c of item.content ?? []) if (c.type === "output_text" && c.text) parts.push(c.text);
  return parts.join("\n").trim();
}

export const generateAI = createServerFn({ method: "POST" })
  .validator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const { generateResponse, GatewayError, RateLimitError, PaymentRequiredError } = await import(
      "@lovable.dev/ai-gateway"
    );
    const { instructions, input } = buildPrompt(data);
    try {
      const res = await generateResponse({ model: "openai/gpt-6-astra", instructions, input });
      const text = extractText(res);
      if (!text) return { ok: false as const, error: "The assistant returned an empty response. Please try again." };
      return { ok: true as const, text };
    } catch (e) {
      if (e instanceof RateLimitError) return { ok: false as const, error: "Too many requests right now. Please wait a moment and try again." };
      if (e instanceof PaymentRequiredError) return { ok: false as const, error: "AI credits are exhausted for this workspace." };
      if (e instanceof GatewayError) {
        console.error("AI gateway error", e.code, e.ids);
        return { ok: false as const, error: "The AI service couldn't complete this request. Please try again." };
      }
      throw e;
    }
  });
