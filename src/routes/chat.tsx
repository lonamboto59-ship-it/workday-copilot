import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Check, Loader2, MessagesSquare, Pencil, SendHorizontal, Trash2, User, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton, Disclaimer, PageHeader } from "@/components/workspace";
import { generateAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — WorkPilot AI" },
      { name: "description", content: "Chat with Atlas, a contextual AI assistant for everyday workplace tasks." },
      { property: "og:title", content: "AI Chatbot — WorkPilot AI" },
      { property: "og:description", content: "A contextual workplace assistant for planning, writing and prioritising." },
    ],
  }),
  component: ChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; content: string };
const suggestions = ["Plan my week around 3 deadlines", "Write an agenda for a 30-min kickoff", "How do I give constructive feedback?"];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { id: crypto.randomUUID(), role: "user", content }];
    setMessages(next);
    setDraft("");
    setLoading(true);
    try {
      const r = await generateAI({ data: { kind: "chat", messages: next.slice(-40).map(({ role, content }) => ({ role, content })) } });
      if (r.ok) setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: r.text }]);
      else toast.error(r.error);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = () => {
    setMessages((m) => m.map((x) => (x.id === editing ? { ...x, content: editText } : x)));
    setEditing(null);
  };

  return (
    <div className="mx-auto flex h-[calc(100svh-7rem)] max-w-4xl flex-col">
      <div className="flex items-start justify-between gap-3">
        <PageHeader icon={MessagesSquare} title="AI Chatbot" description="Atlas remembers this conversation until you leave or refresh." />
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setMessages([])} disabled={loading}>
            <Trash2 className="size-4" /> <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>
      <div className="panel flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6" aria-live="polite">
          {messages.length === 0 && !loading && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="icon-tile mb-3 size-14"><Bot className="size-7" aria-hidden /></div>
              <p className="font-semibold">Hi, I'm Atlas</p>
              <p className="mt-1 text-sm text-muted-foreground">Ask anything about your work. Try one of these:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <Button key={s} variant="outline" size="sm" className="rounded-full" onClick={() => send(s)}>{s}</Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                <div className={`grid size-8 shrink-0 place-items-center rounded-full ${isUser ? "bg-secondary text-primary" : "bg-primary text-primary-foreground"}`}>
                  {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
                </div>
                <div className={`group min-w-0 max-w-[85%] ${isUser ? "items-end" : ""} flex flex-col`}>
                  {editing === m.id ? (
                    <div className="w-[min(36rem,75vw)] space-y-2">
                      <Textarea aria-label="Edit message" value={editText} onChange={(e) => setEditText(e.target.value)} rows={6} />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}><Check className="size-4" /> Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="size-4" /> Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className={`whitespace-pre-wrap break-words text-sm leading-relaxed ${isUser ? "rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground" : "pt-1"}`}>
                      {m.content}
                    </div>
                  )}
                  {editing !== m.id && (
                    <div className="mt-1 flex gap-0.5 opacity-70 transition group-hover:opacity-100">
                      <CopyButton text={m.content} size="icon" />
                      <Button variant="ghost" size="icon" className="size-7" aria-label="Edit message" onClick={() => { setEditing(m.id); setEditText(m.content); }}>
                        <Pencil className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {loading && (
            <div role="status" className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><Bot className="size-4" /></div>
              <Loader2 className="size-4 animate-spin" /> Atlas is thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>
        <form className="border-t border-border p-3 md:p-4" onSubmit={(e) => { e.preventDefault(); send(draft); }}>
          <div className="flex items-end gap-2">
            <Textarea
              aria-label="Message"
              placeholder="Message Atlas…  (Enter to send, Shift+Enter for new line)"
              value={draft}
              rows={1}
              maxLength={4000}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(draft); } }}
              className="max-h-40 min-h-11 resize-none"
            />
            <Button type="submit" size="icon" className="size-11 shrink-0" disabled={loading || !draft.trim()} aria-label="Send message">
              <SendHorizontal className="size-4" />
            </Button>
          </div>
          <div className="mt-2"><Disclaimer /></div>
        </form>
      </div>
    </div>
  );
}
