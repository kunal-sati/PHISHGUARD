import os

class Settings:
    PROJECT_NAME: str = "PhishGuard Security Analysis System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./phishguard.db")
    
    # Privacy & Storage Settings
    STORE_EMAIL_BODY_DEFAULT: bool = os.getenv("STORE_EMAIL_BODY", "false").lower() == "true"
    
    # Analysis Configuration
    DNS_TIMEOUT_SECONDS: float = float(os.getenv("DNS_TIMEOUT_SECONDS", "2.5"))
    MAX_FILE_SIZE_MB: float = float(os.getenv("MAX_FILE_SIZE_MB", "10.0"))
    
    # Optional External Reputation APIs
    VIRUSTOTAL_API_KEY: str | None = os.getenv("VIRUSTOTAL_API_KEY")
    ABUSEIPDB_API_KEY: str | None = os.getenv("ABUSEIPDB_API_KEY")
    URLHAUS_ENABLED: bool = os.getenv("URLHAUS_ENABLED", "true").lower() == "true"

settings = Settings()
