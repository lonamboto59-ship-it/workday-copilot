import { useState, type ReactNode } from "react";
import { Check, Copy, Loader2, RefreshCw, ShieldAlert, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function PageHeader({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="icon-tile size-12 shrink-0">
        <Icon className="size-6" aria-hidden />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">{description}</p>
      </div>
    </div>
  );
}

export function Panel({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="panel flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="flex flex-1 flex-col p-5">{children}</div>
    </section>
  );
}

export function Disclaimer() {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      AI outputs may contain errors. Review and verify all content before professional use.
    </p>
  );
}

export function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 grid size-14 place-items-center rounded-full bg-secondary text-primary">
        <Icon className="size-7" aria-hidden />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div role="status" className="flex flex-1 flex-col gap-3 py-4">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" aria-hidden /> {label}
      </p>
      {[90, 75, 95, 60, 80].map((w, i) => (
        <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

export function CopyButton({ text, size = "sm" }: { text: string; size?: "sm" | "icon" }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setDone(false), 1500);
    } catch {
      toast.error("Couldn't copy — please select and copy manually.");
    }
  };
  const Icon = done ? Check : Copy;
  return size === "icon" ? (
    <Button variant="ghost" size="icon" className="size-7" onClick={copy} aria-label="Copy message">
      <Icon className="size-3.5" />
    </Button>
  ) : (
    <Button variant="outline" size="sm" onClick={copy} disabled={!text}>
      <Icon className="size-4" /> {done ? "Copied" : "Copy"}
    </Button>
  );
}

export function EditableOutput({
  value,
  onChange,
  onRegenerate,
  loading,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  loading: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <Textarea
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[360px] flex-1 resize-y text-sm leading-relaxed"
      />
      <div className="flex flex-wrap gap-2">
        <CopyButton text={value} />
        <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Regenerate
        </Button>
      </div>
    </div>
  );
}
