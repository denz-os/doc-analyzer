# DocuZen

AI-powered document analysis for South African legal and financial firms. Upload a PDF or Word document, ask questions in plain English, and get answers grounded in the actual document — with page references.

---

## What it does

- Upload PDF or DOCX files (up to 50MB)
- Automatically parses, chunks, and embeds the document content
- Ask natural language questions: *"What are the termination clauses?"*, *"Does this comply with the BCEA?"*
- Answers cite specific page numbers and show similarity scores
- Delete documents when no longer needed

---

## Tech stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — async Python web framework
- [PostgreSQL](https://www.postgresql.org/) + [SQLAlchemy](https://www.sqlalchemy.org/) — stores document metadata and chunks
- [Qdrant](https://qdrant.tech/) — vector database for semantic similarity search
- [OpenAI](https://platform.openai.com/) — `text-embedding-3-small` for embeddings, `gpt-4o-mini` for answers
- [PyMuPDF](https://pymupdf.readthedocs.io/) — PDF text extraction with page numbers
- [python-docx](https://python-docx.readthedocs.io/) — Word document parsing
- [tiktoken](https://github.com/openai/tiktoken) — token-aware chunking with overlap

**Frontend**
- [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- Playfair Display + Inter — custom typography
- Military green design system

**Infrastructure**
- [Docker Compose](https://docs.docker.com/compose/) — local Postgres + Qdrant
- Railway (deployment — coming soon)

---

## Project structure

```
doc-analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, lifespan, CORS
│   │   ├── config.py        # Typed env var loading (pydantic-settings)
│   │   ├── database.py      # Async SQLAlchemy engine + session
│   │   ├── vector_store.py  # Qdrant client + collection setup
│   │   ├── models/
│   │   │   └── document.py  # Document + Chunk ORM tables
│   │   ├── schemas/
│   │   │   └── document.py  # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── documents.py # Upload, list, get, delete endpoints
│   │   │   └── chat.py      # Q&A endpoint
│   │   └── services/
│   │       ├── parser.py    # PDF + DOCX text extraction
│   │       ├── chunker.py   # Token-aware chunking with overlap
│   │       ├── embeddings.py# OpenAI embedding calls
│   │       └── rag.py       # Full RAG pipeline
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── layout.tsx       # Fonts + metadata
│   │   └── page.tsx         # Main three-panel layout
│   ├── components/
│   │   ├── Sidebar.tsx      # Upload zone + document list
│   │   ├── ViewerPanel.tsx  # Document preview panel
│   │   └── ChatPanel.tsx    # Chat interface with source tags
│   ├── lib/
│   │   └── api.ts           # API client (upload, list, delete, chat)
│   └── types/
│       └── index.ts         # Shared TypeScript types
└── docker-compose.yml       # Postgres + Qdrant services
```

---

## RAG pipeline

```
Upload → Parse (PyMuPDF / python-docx)
       → Chunk (500 tokens, 100 overlap)
       → Embed (OpenAI text-embedding-3-small)
       → Store vectors (Qdrant) + metadata (Postgres)

Query  → Embed question
       → Search Qdrant (top 5, filtered by document)
       → Build context from retrieved chunks
       → Answer with gpt-4o-mini (temperature 0.1)
       → Return answer + source citations
```

---

## Local setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- Docker Desktop
- An OpenAI API key

### 1. Start the databases

```bash
docker-compose up -d
```

This starts Postgres on port 5432 and Qdrant on port 6333.

### 2. Set up the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`.

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/documents/upload` | Upload a PDF or DOCX |
| `GET` | `/documents/` | List all documents |
| `GET` | `/documents/{id}` | Get document with chunks |
| `DELETE` | `/documents/{id}` | Delete a document |
| `POST` | `/chat/` | Ask a question about a document |
| `GET` | `/health` | Health check |

---

## Environment variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```
OPENAI_API_KEY=sk-...        # Required — no default
DATABASE_URL=...             # Postgres connection string
QDRANT_HOST=localhost        # Qdrant host
QDRANT_PORT=6333             # Qdrant port
```

See `.env.example` for the full list with defaults.

---

## Roadmap

- [ ] Real PDF viewer (react-pdf)
- [ ] Document processing status polling
- [ ] Multi-document Q&A
- [ ] Authentication
- [ ] Deploy to Railway (backend) + Vercel (frontend)
