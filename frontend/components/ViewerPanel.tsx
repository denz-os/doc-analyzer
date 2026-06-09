"use client";

import { Document } from "@/types";

interface Props {
  document: Document | null;
}

export default function ViewerPanel({ document }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F5F5F2", borderRight: "0.5px solid var(--m-border)" }}>
      {/* Header */}
      <div style={{ padding: "10px 16px", borderBottom: "0.5px solid var(--m-border)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: "12px", color: "#6B7280", display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="14" height="14" fill="none" stroke="var(--m-primary)" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          {document ? document.filename : "No document selected"}
        </span>
        {document && (
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{document.file_type.toUpperCase()}</span>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", overflowY: "auto" }}>
        {!document ? (
          <div style={{ textAlign: "center", color: "#9CA3AF" }}>
            <svg width="48" height="48" fill="none" stroke="var(--m-mid)" strokeWidth="1" viewBox="0 0 24 24" style={{ margin: "0 auto 12px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p style={{ fontSize: "13px" }}>Upload a document to preview it here</p>
          </div>
        ) : (
          <div style={{
            background: "#fff",
            border: "0.5px solid #E0E3D8",
            borderRadius: "3px",
            width: "100%",
            maxWidth: "480px",
            minHeight: "600px",
            padding: "40px 36px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}>
            {/* Simulated document content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ height: 14, width: "55%", borderRadius: 2, background: "#2E3A1C", opacity: 0.7 }} />
              <div style={{ height: 8, width: "80%", borderRadius: 2, background: "#E5E7EB" }} />
              <div style={{ height: 8, width: "90%", borderRadius: 2, background: "#E5E7EB" }} />
              <div style={{ height: 8, width: "65%", borderRadius: 2, background: "#E5E7EB" }} />
              <div style={{ height: 20 }} />
              <div style={{ height: 8, width: "100%", borderRadius: 2, background: "var(--m-mid)" }} />
              <div style={{ height: 8, width: "95%", borderRadius: 2, background: "var(--m-mid)" }} />
              <div style={{ height: 8, width: "85%", borderRadius: 2, background: "var(--m-mid)" }} />
              <div style={{ height: 20 }} />
              <div style={{ height: 8, width: "90%", borderRadius: 2, background: "#E5E7EB" }} />
              <div style={{ height: 8, width: "75%", borderRadius: 2, background: "#E5E7EB" }} />
              <div style={{ height: 8, width: "80%", borderRadius: 2, background: "#E5E7EB" }} />
              <div style={{ height: 8, width: "60%", borderRadius: 2, background: "#E5E7EB" }} />
              <div style={{ height: 20 }} />
              <div style={{ height: 8, width: "85%", borderRadius: 2, background: "#E5E7EB" }} />
              <div style={{ height: 8, width: "90%", borderRadius: 2, background: "#E5E7EB" }} />
              <div style={{ height: 8, width: "50%", borderRadius: 2, background: "#E5E7EB" }} />
            </div>
            <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "0.5px solid #E5E7EB", display: "flex", justifyContent: "center" }}>
              <p style={{ fontSize: "11px", color: "#9CA3AF" }}>Full PDF rendering coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
