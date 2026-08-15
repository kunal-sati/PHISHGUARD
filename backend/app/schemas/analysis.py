from pydantic import BaseModel
from datetime import datetime, timezone
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class SPFResult(BaseModel):
    status: str # PASS, FAIL, UNKNOWN
    domain: str | None = None
    record: str | None = None
    details: str

class DKIMResult(BaseModel):
    status: str # PASS, FAIL, UNKNOWN
    selector: str | None = None
    details: str
    verified_by_phishguard: bool = False

class DMARCResult(BaseModel):
    status: str # PASS, FAIL, UNKNOWN
    policy: str | None = None # none, quarantine, reject
    record: str | None = None
    details: str

class AuthenticationDetails(BaseModel):
    spf: SPFResult
    dkim: DKIMResult
    dmarc: DMARCResult

class URLAnalysisItem(BaseModel):
    url: str
    scheme: str | None = None
    hostname: str | None = None
    domain: str | None = None
    port: int | None = None
    path: str | None = None
    query: str | None = None
    url_length: int = 0
    subdomain_count: int = 0
    is_https: bool = False
    is_ip_host: bool = False
    is_shortener: bool = False
    display_text: str | None = None
    display_mismatch: bool = False
    risk_score_contribution: int = 0
    flags: list[str] = []

class RiskIndicatorItem(BaseModel):
    rule_id: str
    category: str
    description: str
    severity: str # LOW, MEDIUM, HIGH, CRITICAL
    score_impact: int

class EmailSummary(BaseModel):
    sender: str
    recipient: str
    subject: str
    date: str | None = None
    reply_to: str | None = None
    return_path: str | None = None
    source_domain: str | None = None

class AnalysisResponse(BaseModel):
    analysis_id: str
    created_at: datetime
    risk_score: int
    risk_level: str # LOW, MEDIUM, HIGH, CRITICAL
    classification: str # LEGITIMATE, SUSPICIOUS, LIKELY_PHISHING, HIGHLY_SUSPICIOUS
    explanation: str
    email: EmailSummary
    authentication: AuthenticationDetails
    urls: list[URLAnalysisItem]
    indicators: list[RiskIndicatorItem]
    recommendations: list[str]
