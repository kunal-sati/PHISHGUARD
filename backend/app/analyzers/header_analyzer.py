import re
from app.schemas.email import ParsedEmailMetadata
from app.detection.indicators import RiskIndicator, create_indicator

def analyze_headers(email_meta: ParsedEmailMetadata) -> list[RiskIndicator]:
    indicators = []

    sender_domain = email_meta.source_domain.lower()
    reply_to_domain = ""
    if email_meta.reply_to:
        match = re.search(r'[\w\.-]+@([\w\.-]+\.\w+)', email_meta.reply_to)
        if match:
            reply_to_domain = match.group(1).lower()

    return_path_domain = ""
    if email_meta.return_path:
        match = re.search(r'[\w\.-]+@([\w\.-]+\.\w+)', email_meta.return_path)
        if match:
            return_path_domain = match.group(1).lower()

    # Rule HDR-001: Reply-To Domain Mismatch
    if sender_domain and reply_to_domain and sender_domain != reply_to_domain:
        ind = create_indicator(
            "HDR-001",
            f"Reply-To domain ({reply_to_domain}) differs from sender domain ({sender_domain})."
        )
        if ind:
            indicators.append(ind)

    # Rule HDR-002: Return-Path Mismatch
    if sender_domain and return_path_domain and sender_domain != return_path_domain:
        if not return_path_domain.endswith("." + sender_domain) and not sender_domain.endswith("." + return_path_domain):
            ind = create_indicator(
                "HDR-002",
                f"Return-Path domain ({return_path_domain}) differs from sender domain ({sender_domain})."
            )
            if ind:
                indicators.append(ind)

    return indicators
