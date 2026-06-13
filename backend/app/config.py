from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    app_name: str = "DocuZen API"
    debug: bool = False

    # PostgreSQL
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/docuzen"

    # Qdrant
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    qdrant_url: str = ""       # Set for Qdrant Cloud — overrides host/port
    qdrant_api_key: str = ""   # Qdrant Cloud API key
    qdrant_collection: str = "documents"

    # OpenAI
    openai_api_key: str  # No default — crashes at startup if missing
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536
    llm_model: str = "gpt-4o-mini"

    # Chunking
    chunk_size: int = 500
    chunk_overlap: int = 100

    # Files
    max_file_size_mb: int = 50
    upload_dir: str = "uploads"

    # CORS
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "https://docuzen.netlify.app",
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()