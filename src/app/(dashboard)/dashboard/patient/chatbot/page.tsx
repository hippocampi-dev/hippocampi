"use client";

import { useChat } from "@ai-sdk/react";
import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
} from "react";
import { Send, User, Bot } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

interface CitationMeta {
  content: string;
  url?: string;
  title?: string;
}

/**
 * Full‑page chat interface for Hippocampi Coach
 * – Markdown + citations rendered as hover tooltips with real snippets
 * – Scroll helpers & rate‑limit handling
 */
export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    append,
    isLoading,
  } = useChat();

  const chatRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [citationMap, setCitationMap] = useState<Record<string, CitationMeta>>({});

  /* ---------------- scroll ---------------- */
  // Keep scrolling to bottom during streaming
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      return () => clearInterval(interval);
    } else {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoading, messages]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- listen for assistant messages to collect citations ---------------- */
  useEffect(() => {
    const last = messages[messages.length - 1] as any;
    if (last?.role === "assistant" && last?.citations) {
      setCitationMap((prev) => ({ ...prev, ...last.citations }));
    }
  }, [messages]);

  /* ---------------- submit wrapper ---------------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // cooldown guard
    if (cooldownUntil && Date.now() < cooldownUntil) {
      setError(
        `Slow down — wait ${Math.ceil((cooldownUntil - Date.now()) / 1000)} s.`
      );
      return;
    }

    setError(null);
    try {
      await append({ role: "user", content: input });
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      if (status === 429) {
        const retry = Number(err.response?.headers?.get("retry-after") ?? 30);
        setCooldownUntil(Date.now() + retry * 1000);
        setError(`Rate limit hit. Wait ${retry} s and try again.`);
      } else {
        setError("Network error. Please retry.");
      }
    }
  };

  /* ---------------- citation renderer ---------------- */
  const renderWithCitations = (text: string) => {
    const segments = text.split(/(\[\d+\])/g);
    return segments.map((seg, i) => {
      const m = seg.match(/\[(\d+)\]/);
      if (m) {
        const id = m[1];
        const meta = citationMap[id];
        return (
          <TooltipProvider key={i} delayDuration={0} skipDelayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <sup className="text-blue-600 cursor-pointer">[{id}]</sup>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs whitespace-pre-wrap">
                {meta ? (
                  <>
                    <p className="font-semibold mb-1">Source [{id}]: {meta.title || ''}</p>
                    <p>{meta.content}</p>
                    {meta.url && (
                      <a
                        href={meta.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-blue-500 mt-1 block"
                      >
                        Open article
                      </a>
                    )}
                  </>
                ) : (
                  "Loading source…"
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      return seg;
    });
  };

  /* ---------------- render ---------------- */
  return (
    <div className="flex flex-col h-screen w-full max-w-5xl mx-auto">
      {/* header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg p-4 border-b text-center">
        <h2 className="text-lg font-semibold text-gray-800">Hippocampi Coach</h2>
        <p className="text-sm text-gray-600">Ask anything about chemobrain care</p>
      </div>

      {/* messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-6 bg-white rounded-b-lg border border-t-0 shadow-inner"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((msg, msgIdx) => (
            <React.Fragment key={msgIdx}>
              {msg.parts
                .filter((m) => m.type !== "source")
                .map(
                  (m, i) =>
                    m.type === "text" && (
                      <MessageBubble
                        key={i}
                        role={msg.role as "user" | "assistant"}
                        markdown={m.text}
                        renderInline={renderWithCitations}
                      />
                    )
                )}
              {!isLoading && msgIdx === messages.length - 1 && msg.role === "assistant" && (
                <div className="ml-12 mt-2 flex flex-wrap gap-2">
                  {msg.parts
                    .filter((p) => p.type === "source")
                    .map((p) => (
                      <a
                        key={p.source.id}
                        href={p.source.url}
                        target="_blank"
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        Source [{p.source.id}]: {p.source.title || 'Reference'}
                      </a>
                    ))}
                </div>
              )}
            </React.Fragment>
          ))
        )}
        <div ref={endRef} className="h-4" />
      </div>

      {showScrollBtn && (
        <ScrollBtn onClick={() => endRef.current?.scrollIntoView({ behavior: "smooth" })} />
      )}

      {error && <div className="mt-2 text-sm text-red-600 text-center">{error}</div>}

      {/* input */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 mb-4 flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm"
      >
        <input
          className="flex-1 p-2 outline-none bg-transparent"
          value={input}
          placeholder="Type your question…"
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="rounded-full h-10 w-10"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}

/* ---------------- sub‑components ---------------- */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
      <Bot size={40} className="text-primary opacity-50" />
      <div>
        <p className="font-medium">Welcome to Hippocampi Coach!</p>
        <p className="text-sm">Ask a question to get started.</p>
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  markdown,
  renderInline,
}: {
  role: "user" | "assistant";
  markdown: string;
  renderInline: (text: string) => React.ReactNode;
}) {
  return (
    <div className={`mb-4 flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`prose prose-sm max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${
          role === "user"
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted text-muted-foreground rounded-tl-none"
        }`}
      >
        <div className="flex items-center mb-1 text-xs opacity-90">
          {role === "user" ? (
            <>
              <span>You</span>
              <User size={12} className="ml-1" />
            </>
          ) : (
            <>
              <Bot size={12} className="mr-1" />
              <span>Assistant</span>
            </>
          )}
        </div>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p({ children }) {
              return <p>{children}</p>;
            },
            text({ children }) {
              return <>{renderInline(String(children))}</>;
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function ScrollBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size="sm"
      variant="secondary"
      className="fixed bottom-28 right-8 rounded-full w-10 h-10 p-0 shadow-md"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7 7 7-7" />
      </svg>
    </Button>
  );
}
