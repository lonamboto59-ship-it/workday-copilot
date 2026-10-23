import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessagesSquare, SearchCheck } from "lucide-react";
import { Disclaimer } from "@/components/workspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkPilot AI Productivity Assistant" },
      { name: "description", content: "Draft emails, research topics and chat with an AI workplace assistant." },
      { property: "og:title", content: "WorkPilot AI — Workplace Productivity Assistant" },
      { property: "og:description", content: "Smart emails, structured research briefs and an AI chat assistant in one dashboard." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", text: "Turn a purpose and a few details into a polished email in Formal, Friendly or Persuasive tone." },
  { to: "/research", icon: SearchCheck, title: "AI Research Assistant", text: "Get summaries, key findings, insights and recommendations from a topic, article or URL." },
  { to: "/chat", icon: MessagesSquare, title: "AI Chatbot", text: "Ask Atlas for help with planning, writing, meetings and prioritisation." },
] as const;

function Dashboard() {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="mx-auto max-w-6xl">
      <section className="hero-banner mb-8 rounded-2xl p-6 md:p-10">
        <p className="text-sm font-medium opacity-80">{greet} 👋</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Welcome to your AI workspace</h1>
        <p className="mt-3 max-w-xl opacity-90">Pick a tool below to write, research or think through your next task faster.</p>
      </section>
      <div className="grid gap-5 md:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="panel group flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-ring">
            <div className="icon-tile mb-4 size-11">
              <t.icon className="size-5" aria-hidden />
            </div>
            <h2 className="font-semibold">{t.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.text}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Open tool <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
