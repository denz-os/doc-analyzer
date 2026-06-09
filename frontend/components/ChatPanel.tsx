"use client";

import { useEffect, useRef, useState } from "react";
import { ChatMessage, Document } from "@/types";
import { askQuestion } from "@/lib/api";

interface Props {
  document: Document | null;
}

export default function ChatPanel({ document }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
  }, [document?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || !document || loading) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);
    try {
      const res = await askQuestion(document.id, question);
      setMessages((prev) => [...prev, { role: "assistant", content: res.answer, sources: res.sources }]);
    } catch (e: unknown) {
      setMessages((prev) => [...prev, { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      {/* Header */}
      <div style={{ padding: "11px 16px", borderBottom: "0.5px solid var(--m-border)", fontSize: "12px", color: "#6B7280", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <svg width="15" height="15" fill="none" stroke="var(--m-primary)" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
        {document ? `Asking about: ${document.filename}` : "Select a document to begin"}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {!document && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9CA3AF", textAlign: "center", gap: "10px", paddingTop: "60px" }}>
            <svg width="36" height="36" fill="none" stroke="var(--m-mid)" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p style={{ fontSize: "13px" }}>Upload a document and select it<br />to start asking questions</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "88%" }}>
              <div style={{
                padding: "9px 13px",
                borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                fontSize: "13px",
                lineHeight: 1.65,
                background: msg.role === "user" ? "var(--m-primary)" : "#F9F9F7",
                color: msg.role === "user" ? "#fff" : "#111827",
                border: msg.role === "assistant" ? "0.5px solid #E5E7EB" : "none",
              }}>
                {msg.content}
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                  {msg.sources.slice(0, 3).map((s, si) => (
                    <span key={si} style={{
                      display: "inline-flex", alignItems: "center", gap: "4px",
                      fontSize: "10px", padding: "2px 8px", borderRadius: "20px",
                      background: "var(--m-light)", color: "var(--m-dark)",
                      border: "0.5px solid var(--m-mid)",
                    }}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      {s.page_number ? `Page ${s.page_number}` : `Chunk ${s.chunk_index}`}
                      <span style={{ opacity: 0.5 }}>· {(s.score * 100).toFixed(0)}%</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "10px 14px", borderRadius: "14px 14px 14px 4px", background: "#F9F9F7", border: "0.5px solid #E5E7EB", display: "flex", gap: "4px", alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--m-mid)", display: "inline-block", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 14px", borderTop: "0.5px solid var(--m-border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "8px 12px", background: "#fff" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={document ? "Ask a question about this document..." : "Select a document first..."}
            disabled={!document || loading}
            style={{ flex: 1, border: "none", outline: "none", fontSize: "13px", background: "transparent", color: "#111827", fontFamily: "inherit" }}
          />
          <button
            onClick={handleSend}
            disabled={!document || !input.trim() || loading}
            style={{
              background: !document || !input.trim() || loading ? "#E5E7EB" : "var(--m-primary)",
              border: "none", borderRadius: "7px", width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: !document || !input.trim() || loading ? "not-allowed" : "pointer",
              transition: "background 0.15s", flexShrink: 0,
            }}
          >
            <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }`}</style>
    </div>
  );
}
