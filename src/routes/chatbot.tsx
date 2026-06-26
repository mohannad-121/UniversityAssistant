import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Send, GraduationCap, User, Sparkles } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { askOllama } from "@/lib/api/ollama.functions";
import { getBotReply, suggestedQuestions } from "@/lib/chatbot";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";
import { fetchTable, getFallbackData } from "@/lib/university-data";
import { BrandLogo } from "@/components/brand-logo";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "Chatbot - مرشدي" },
      {
        name: "description",
        content:
          "Chat with مرشدي about courses, prerequisites, instructors, departments, offices, and IT support.",
      },
      { property: "og:title", content: "Chatbot - مرشدي" },
      {
        property: "og:description",
        content: "Ask the smart university assistant your academic questions.",
      },
    ],
  }),
  component: ChatbotPage,
});

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

function ChatbotPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "bot", text: t("chatbot.greeting") },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: courses = getFallbackData("courses") } = useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchTable("courses"),
  });
  const { data: instructors = getFallbackData("instructors") } = useQuery({
    queryKey: ["instructors"],
    queryFn: () => fetchTable("instructors"),
  });
  const { data: departments = getFallbackData("departments") } = useQuery({
    queryKey: ["departments"],
    queryFn: () => fetchTable("departments"),
  });
  const { data: faqs = getFallbackData("faqs") } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => fetchTable("faqs"),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setMessages((current) =>
      current.length === 1 && current[0]?.id === "greeting"
        ? [{ id: "greeting", role: "bot", text: t("chatbot.greeting") }]
        : current,
    );
  }, [t]);

  async function send(text: string) {
    const value = text.trim();
    if (!value || typing) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: value };
    const previousMessages = messages;
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const reply = getBotReply(value, { courses, instructors, departments, faqs });

      if (reply.kind !== "fallback") {
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        setMessages((m) => [...m, { id: `b-${Date.now()}`, role: "bot", text: reply.text }]);
        return;
      }

      const history = previousMessages
        .filter((message) => message.id !== "greeting")
        .slice(-8)
        .map((message) => ({
          role: message.role === "user" ? ("user" as const) : ("assistant" as const),
          content: message.text,
        }));

      const llmReply = await askOllama({ data: { message: value, history } });
      setMessages((m) => [
        ...m,
        {
          id: `b-${Date.now()}`,
          role: "bot",
          text: llmReply.text,
        },
      ]);
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  }

  return (
    <PageLayout className="bg-secondary/40">
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center gap-3 rounded-t-2xl border border-border bg-card px-5 py-4 shadow-card">
          <BrandLogo compact imageClassName="h-10 w-10" />
          <div className="min-w-0">
            <p className="font-display font-bold text-foreground">مرشدي</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> {t("chatbot.status")}
            </p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto border-x border-border bg-card/60 px-4 py-5 sm:px-6"
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role} text={m.text} />
          ))}
          {typing && (
            <div className="flex items-center gap-2.5">
              <Avatar role="bot" />
              <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-b-2xl border border-border bg-card px-4 py-4 shadow-card sm:px-6">
          {messages.length <= 2 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => void send(q)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Sparkles className="h-3 w-3" /> {q}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatbot.placeholder")}
              className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl"
              disabled={!input.trim() || typing}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}

function MessageBubble({ role, text }: { role: "user" | "bot"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex items-end gap-2.5", isUser && "flex-row-reverse")}>
      <Avatar role={role} />
      <div
        className={cn(
          "max-w-[78%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm border border-border bg-secondary text-secondary-foreground",
        )}
      >
        {text}
      </div>
    </div>
  );
}

function Avatar({ role }: { role: "user" | "bot" }) {
  const isUser = role === "user";
  return (
    <span
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-full",
        isUser ? "bg-accent text-accent-foreground" : "bg-gradient-hero text-primary-foreground",
      )}
    >
      {isUser ? <User className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
    </span>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
      style={{ animationDelay: delay }}
    />
  );
}

