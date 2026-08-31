"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, MessageSquareText, Sprout } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "How does the Red Sea crisis affect my avocado exports to Europe?",
  "Is this a good time to plant macadamia for the China market?",
  "Why is fertilizer expensive right now, and what can I do?",
  "What do I need to sell French beans in the EU?",
  "How will the new China trade deal help small farmers like me?",
];

export function AdvisorView() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = async (question?: string) => {
    const q = (question ?? input).trim();
    if (!q || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: q }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok || !data.answer) throw new Error(data.error ?? "Failed");

      setMessages([...nextMessages, { role: "assistant", content: data.answer }]);
    } catch {
      toast({
        title: "Advisor unavailable",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      setMessages(nextMessages);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold sm:text-3xl">AI Farm Advisor</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
          Ask anything about world events, exports, prices or paperwork — get a
          practical answer in farmer&apos;s language, like talking to a knowledgeable
          extension officer.
        </p>
      </div>

      {/* Chat area */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div
            ref={scrollRef}
            className="max-h-[24rem] min-h-[16rem] overflow-y-auto custom-scroll space-y-4 pr-1"
            role="log"
            aria-live="polite"
            aria-label="Chat conversation"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Sprout className="h-6 w-6 text-primary" aria-hidden="true" />
                </span>
                <p className="mt-3 font-medium">Mhabari! How can I help your farm today?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick a question below, or type your own.
                </p>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">Thinking…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
            className="mt-4 flex gap-2"
          >
            <input
              // Using raw input styled to match; kept simple for a11y
              className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Should I sell my coffee now or wait?"
              aria-label="Ask the advisor a question"
              disabled={loading}
            />
            <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={loading || !input.trim()} aria-label="Send question">
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Suggested questions */}
      {messages.length === 0 && (
        <div className="mt-5">
          <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
            Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground min-h-[36px]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        The advisor gives general guidance — for critical decisions, confirm
        with your county agriculture office, KEPHIS or your cooperative.
      </p>
    </div>
  );
}
