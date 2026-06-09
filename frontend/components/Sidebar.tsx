"use client";

import { useRef, useState } from "react";
import { Document } from "@/types";
import { uploadDocument, deleteDocument } from "@/lib/api";

interface Props {
  documents: Document[];
  selectedId: string | null;
  onSelect: (doc: Document) => void;
  onUploaded: (doc: Document) => void;
  onDeleted: (id: string) => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function Sidebar({ documents, selectedId, onSelect, onUploaded, onDeleted }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const doc = await uploadDocument(file);
      onUploaded(doc);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    await deleteDocument(id);
    onDeleted(id);
  }

  return (
    <aside style={{ borderRight: "0.5px solid var(--m-border)", background: "#F9F9F7" }}
      className="flex flex-col gap-5 p-4 h-full overflow-y-auto">

      {/* Logo */}
      <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "22px", color: "var(--m-dark)", letterSpacing: "-0.3px", paddingBottom: "4px" }}>
        Docu<span style={{ color: "var(--m-primary)" }}>Zen</span>
      </div>

      {/* Upload */}
      <div>
        <p style={{ fontSize: "10px", fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Upload</p>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          style={{
            border: `1.5px dashed ${dragOver ? "var(--m-primary)" : "var(--m-mid)"}`,
            borderRadius: "8px",
            padding: "18px 12px",
            textAlign: "center",
            cursor: uploading ? "wait" : "pointer",
            background: dragOver ? "var(--m-hover)" : "var(--m-light)",
            transition: "all 0.15s",
          }}
        >
          <svg width="24" height="24" fill="none" stroke="var(--m-primary)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 8px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V8m0 0-3 3m3-3 3 3M6.5 19a4.5 4.5 0 0 1 0-9h.5a5 5 0 0 1 9.8-1A4.5 4.5 0 0 1 17.5 19h-11Z" />
          </svg>
          <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.5 }}>
            {uploading ? "Processing..." : "Drop PDF or DOCX here"}
          </p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>or click to browse · Max 50MB</p>
        </div>
        <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {error && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "6px" }}>{error}</p>}
      </div>

      {/* Document list */}
      {documents.length > 0 && (
        <div>
          <p style={{ fontSize: "10px", fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Documents</p>
          <div className="flex flex-col gap-1">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => doc.status === "ready" && onSelect(doc)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 10px", borderRadius: "8px",
                  background: selectedId === doc.id ? "var(--m-light)" : "transparent",
                  cursor: doc.status === "ready" ? "pointer" : "default",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { if (selectedId !== doc.id) (e.currentTarget as HTMLElement).style.background = "var(--m-hover)"; }}
                onMouseLeave={(e) => { if (selectedId !== doc.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--m-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" stroke="var(--m-primary)" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.filename}</p>
                  <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>{formatSize(doc.file_size)}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  <span style={{
                    fontSize: "10px", padding: "2px 7px", borderRadius: "20px",
                    background: doc.status === "ready" ? "var(--m-light)" : doc.status === "failed" ? "#FEE2E2" : "#FEF9C3",
                    color: doc.status === "ready" ? "var(--m-text, #2E3A1C)" : doc.status === "failed" ? "#991B1B" : "#92400E",
                    border: `0.5px solid ${doc.status === "ready" ? "var(--m-mid)" : doc.status === "failed" ? "#FECACA" : "#FDE68A"}`,
                  }}>
                    {doc.status === "processing" ? "busy" : doc.status}
                  </span>
                  <button onClick={(e) => handleDelete(e, doc.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", padding: "2px", lineHeight: 1 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#D1D5DB")}
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
