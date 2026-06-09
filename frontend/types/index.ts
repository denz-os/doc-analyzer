export interface Document {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  status: "processing" | "ready" | "failed";
  created_at: string;
}

export interface SourceChunk {
  content: string;
  page_number: number | null;
  chunk_index: number;
  score: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: SourceChunk[];
}
