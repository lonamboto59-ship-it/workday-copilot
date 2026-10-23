import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Info, Loader2, SearchCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Disclaimer, EditableOutput, EmptyState, LoadingState, PageHeader, Panel } from "@/components/workspace";
import { generateAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkPilot AI" },
      { name: "description", content: "Structured summaries, key findings, insights and recommendations from a topic, article or URL." },
      { property: "og:title", content: "AI Research Assistant — WorkPilot AI" },
      { property: "og:description", content: "Turn research material into an actionable briefing." },
    ],
  }),
  component: ResearchPage,
});

type Mode = "topic" | "article" | "url";

function ResearchPage() {
  const [mode, setMode] = useState<Mode>("topic");
  const [values, setValues] = useState<Record<Mode, string>>({ topic: "", article: "", url: "" });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const value = values[mode];
  const set = (v: string) => setValues((s) => ({ ...s, [mode]: v }));

  const run = async () => {
    if (!value.trim()) { toast.error("Please provide some input first."); return; }
    if (mode === "url" && !/^https?:\/\/\S+\.\S+/.test(value.trim())) { toast.error("Enter a valid URL starting with http(s)://"); return; }
    setLoading(true);
    try {
      const r = await generateAI({ data: { kind: "research", mode, input: value.trim() } });
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
      <PageHeader icon={SearchCheck} title="AI Research Assistant" description="Get a structured briefing with findings, insights and next steps." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Source">
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); run(); }}>
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="topic">Topic</TabsTrigger>
                <TabsTrigger value="article">Article</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
              </TabsList>
            </Tabs>
            {mode === "topic" && (
              <div className="grid gap-1.5">
                <Label htmlFor="topic">Research topic</Label>
                <Input id="topic" placeholder="e.g. Impact of 4-day work weeks on productivity" value={value} onChange={(e) => set(e.target.value)} />
              </div>
            )}
            {mode === "article" && (
              <div className="grid gap-1.5">
                <Label htmlFor="article">Paste article text</Label>
                <Textarea id="article" rows={10} placeholder="Paste the full article or report here…" value={value} onChange={(e) => set(e.target.value)} maxLength={30000} />
                <p className="text-xs text-muted-foreground">{value.length.toLocaleString()} / 30,000 characters</p>
              </div>
            )}
            {mode === "url" && (
              <div className="grid gap-1.5">
                <Label htmlFor="url">Web address</Label>
                <Input id="url" type="url" placeholder="https://example.com/article" value={value} onChange={(e) => set(e.target.value)} />
                <p className="flex gap-2 rounded-lg border border-border bg-secondary p-3 text-xs text-secondary-foreground">
                  <Info className="size-4 shrink-0 text-primary" aria-hidden />
                  This prototype can't fetch live web pages — that needs an external integration. The analysis will be based on the URL and general knowledge only. For accurate results, paste the article text instead.
                </p>
              </div>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <SearchCheck className="size-4" />} Analyse
            </Button>
            <Disclaimer />
          </form>
        </Panel>
        <Panel title="Research briefing">
          {loading && !output ? (
            <LoadingState label="Analysing and structuring findings…" />
          ) : output ? (
            <EditableOutput label="Research briefing" value={output} onChange={setOutput} onRegenerate={run} loading={loading} />
          ) : (
            <EmptyState icon={SearchCheck} title="No briefing yet" text="Choose a source type, add your input and click Analyse." />
          )}
        </Panel>
      </div>
    </div>
  );
}
