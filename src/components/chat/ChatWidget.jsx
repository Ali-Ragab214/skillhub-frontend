import { useState, useRef, useEffect, useCallback } from "react";
import { sendMessage } from "../../services/chatService.js";

function BotIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="8" width="14" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
      <circle cx="15" cy="13" r="1.5" fill="currentColor" />
      <path d="M12 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 5l3 2 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 17c.5-.5 1.5-1 4-1s3.5.5 4 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="2" y="10" width="3" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="19" y="10" width="3" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

function ChatMessage({ role, content }) {
  const isBot = role === "bot";
  return (
    <div className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"} animate-fade-in-up`}>
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${
          isBot
            ? "bg-gradient-to-br from-accent to-accent-blue text-white"
            : "bg-neutral-700 dark:bg-neutral-600 text-white"
        }`}
      >
        {isBot ? <BotIcon className="w-5 h-5" /> : <span className="text-sm font-bold">U</span>}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isBot
            ? "bg-white dark:bg-surface text-neutral-800 dark:text-neutral-200 rounded-tl-sm"
            : "bg-gradient-to-br from-accent to-accent-blue text-white rounded-tr-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

const WELCOME_MESSAGE = {
  role: "bot",
  content: "Hi! I'm your AI learning assistant. Ask me anything about your courses, concepts, or assignments!",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, scrollToBottom]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: res.message },
      ]);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "AI chat service is currently unavailable. Please try again later.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: msg, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed bottom-8 right-8 z-50 flex flex-col transition-all duration-300 ease-out ${
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ maxHeight: open ? "40rem" : "0", width: "26rem" }}
      >
        {open && (
          <div className="bg-white dark:bg-surface rounded-2xl shadow-2xl border border-neutral-200 dark:border-border overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-accent via-accent-blue to-accent relative px-5 py-4 flex items-center justify-between overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner ring-2 ring-white/20">
                  <BotIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Learning Assistant</p>
                  <p className="text-white/60 text-xs">Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <span className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" />
                <span className="text-[10px] text-white/60 font-medium">Online</span>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-bg-primary min-h-[30rem] max-h-[30rem] scroll-smooth">
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {loading && (
                <div className="flex gap-3 animate-fade-in-up">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-blue flex items-center justify-center text-white shadow-sm">
                    <BotIcon className="w-5 h-5" />
                  </div>
                  <div className="bg-white dark:bg-surface rounded-2xl rounded-tl-sm shadow-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-neutral-200 dark:border-border p-4 bg-white dark:bg-surface">
              {error && (
                <div className="mb-2 text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">Dismiss</button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question..."
                    maxLength={2000}
                    rows={2}
                    className="w-full resize-none bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  />
                  <span className="absolute right-3 bottom-3 text-[10px] text-muted">
                    {input.length}/2000
                  </span>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    input.trim() && !loading
                      ? "bg-gradient-to-r from-accent to-accent-blue text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-muted cursor-not-allowed"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-2xl ${
          open
            ? "bg-neutral-700 dark:bg-neutral-600 rotate-90 shadow-lg"
            : "bg-gradient-to-br from-accent to-accent-blue shadow-[0_8px_32px_rgba(139,92,246,0.35)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.5)]"
        }`}
      >
        {open ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <BotIcon className="w-7 h-7 text-white" />
        )}
      </button>
    </>
  );
}
