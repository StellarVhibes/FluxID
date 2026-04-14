"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { chatWithAI } from "@/lib/ai";
import { Bot, X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithAI(
        userMsg.content,
        address,
        messages.map((m) => ({ role: m.role, content: m.content }))
      );
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that request. Please make sure the AI backend is running." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isOpen ? "var(--card)" : "var(--primary)",
          border: "1px solid var(--border)",
          boxShadow: isOpen ? "none" : "0 0 24px rgba(143,168,40,0.35)",
        }}
        className="fixed bottom-6 right-6 z-[80] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
      >
        {isOpen
          ? <X size={20} style={{ color: "var(--foreground-muted)" }} />
          : <Bot size={22} style={{ color: "#fff" }} />
        }
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[80] w-96 h-[500px] rounded-3xl bg-background border border-white/10 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-secondary/10">
            <h3 className="font-black text-lg">ForgeX AI Assistant</h3>
            <p className="text-xs text-gray-400">Ask about your vaults, strategies, or DeFi concepts</p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                <p className="font-bold mb-2">Hey! I&apos;m your ForgeX AI.</p>
                <p>Ask me anything about your vaults, yield strategies, or how VultHook works.</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {["How does VultHook work?", "What's my vault performance?", "Best yield strategy?"].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); }}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary/30 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-primary/20 text-white"
                    : "mr-auto bg-white/5 text-gray-200"
                }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-1 space-y-0.5">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-1 space-y-0.5">{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                    strong: ({ children }) => <strong className="font-bold" style={{ color: "var(--foreground)" }}>{children}</strong>,
                    code: ({ children }) => <code className="px-1 py-0.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.08)", fontFamily: "monospace" }}>{children}</code>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto bg-white/5 p-3 rounded-2xl text-sm text-gray-400">
                <span className="animate-pulse">Thinking...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask ForgeX AI..."
                className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                style={{ background: "var(--primary)" }}
                className="px-4 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 transition-all hover:opacity-90"
              >
                <Send size={16} style={{ color: "#fff" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
