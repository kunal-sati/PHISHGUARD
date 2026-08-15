import re
from app.schemas.email import ParsedEmailMetadata
from app.detection.indicators import RiskIndicator, create_indicator

CREDENTIAL_KEYWORDS = [
    r'\bpassword\b', r'\botp\b', r'\bpin\b', r'\bverification code\b',
    r'\blogin credentials\b', r'\bverify your account\b', r'\bconfirm your password\b',
    r'\bupdate your login\b', r'\bsecurity code\b'
]

URGENCY_KEYWORDS = [
    r'\burgent\b', r'\bimmediately\b', r'\bact now\b', r'\bfinal warning\b',
    r'\baccount (will be|has been) suspended\b', r'\bwithin 24 hours\b',
    r'\baction required\b', r'\baccount restricted\b'
]

def analyze_content(email_meta: ParsedEmailMetadata) -> list[RiskIndicator]:
    indicators: list[RiskIndicator] = []
    full_text = f"{email_meta.subject}\n{email_meta.plain_body}\n{email_meta.html_body}".lower()

    # 1. Credential Requests (CNT-001)
    found_cred = [kw for kw in CREDENTIAL_KEYWORDS if re.search(kw, full_text, re.IGNORECASE)]
    if found_cred:
        ind = create_indicator(
            "CNT-001",
            f"Email content explicitly requests credentials/verification."
        )
        if ind:
            indicators.append(ind)

    # 2. Urgency & Coercion (CNT-002)
    found_urgency = [kw for kw in URGENCY_KEYWORDS if re.search(kw, full_text, re.IGNORECASE)]
    if found_urgency:
        ind = create_indicator(
            "CNT-002",
            f"Urgent pressure language or coercion tactics detected."
        )
        if ind:
            indicators.append(ind)

    return indicators
