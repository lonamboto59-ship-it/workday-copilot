import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Disclaimer, EditableOutput, EmptyState, LoadingState, PageHeader, Panel } from "@/components/workspace";
import { generateAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkPilot AI" },
      { name: "description", content: "Generate context-specific professional emails in Formal, Friendly or Persuasive tone." },
      { property: "og:title", content: "Smart Email Generator — WorkPilot AI" },
      { property: "og:description", content: "Write tailored professional emails in seconds." },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!recipient.trim() || !purpose.trim()) { toast.error("Please add a recipient and purpose."); return; }
    setLoading(true);
    try {
      const r = await generateAI({ data: { kind: "email", recipient, purpose, details, tone } });
      if (r.ok) setOutput(r.text);
      else toast.error(r.error);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader icon={Mail} title="Smart Email Generator" description="Describe who you're writing to and why — get a ready-to-edit draft." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Email details">
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); run(); }}>
            <div className="grid gap-1.5">
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" placeholder="e.g. Sarah Chen, Head of Procurement" value={recipient} onChange={(e) => setRecipient(e.target.value)} maxLength={200} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="purpose">Purpose</Label>
              <Input id="purpose" placeholder="e.g. Follow up on Q3 vendor proposal" value={purpose} onChange={(e) => setPurpose(e.target.value)} maxLength={500} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="details">Key details</Label>
              <Textarea id="details" rows={6} placeholder="Dates, numbers, decisions, asks…" value={details} onChange={(e) => setDetails(e.target.value)} maxLength={4000} />
            </div>
            <div className="grid gap-1.5">
              <Label id="tone-label">Tone</Label>
              <ToggleGroup type="single" value={tone} onValueChange={(v) => v && setTone(v as Tone)} aria-labelledby="tone-label" className="justify-start" variant="outline">
                {(["Formal", "Friendly", "Persuasive"] as const).map((t) => (
                  <ToggleGroupItem key={t} value={t} className="px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{t}</ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <Button type="submit" disabled={loading} className="mt-1">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Generate email
            </Button>
            <Disclaimer />
          </form>
        </Panel>
        <Panel title="Generated email">
          {loading && !output ? (
            <LoadingState label="Drafting your email…" />
          ) : output ? (
            <EditableOutput label="Generated email" value={output} onChange={setOutput} onRegenerate={run} loading={loading} />
          ) : (
            <EmptyState icon={Mail} title="No email yet" text="Fill in the details and click Generate to see your draft here." />
          )}
        </Panel>
      </div>
    </div>
  );
}
