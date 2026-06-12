const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function uploadDocument(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/documents/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

export async function listDocuments() {
  const res = await fetch(`${BASE_URL}/documents/`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function deleteDocument(id: string) {
  const res = await fetch(`${BASE_URL}/documents/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete document");
  return res.json();
}

export async function askQuestion(document_id: string, question: string) {
  const res = await fetch(`${BASE_URL}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id, question }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Chat request failed");
  }
  return res.json();
}
