import uuid
from datetime import datetime, timezone
from app.services.email_parser import parse_raw_email
from app.analyzers.header_analyzer import analyze_headers
from app.analyzers.authentication_analyzer import analyze_authentication
from app.analyzers.url_analyzer import analyze_urls
from app.analyzers.content_analyzer import analyze_content
from app.detection.risk_engine import calculate_risk_assessment
from app.schemas.analysis import AnalysisResponse, EmailSummary, RiskIndicatorItem

def run_email_analysis(raw_email_str: str) -> AnalysisResponse:
    # 1. Parse Email Content & Metadata
    email_meta = parse_raw_email(raw_email_str)

    # 2. Run Security Analyzers
    header_indicators = analyze_headers(email_meta)
    auth_results, auth_indicators = analyze_authentication(email_meta)
    urls, url_indicators = analyze_urls(email_meta)
    content_indicators = analyze_content(email_meta)

    # Combine all triggered indicators
    all_indicators = (
        header_indicators +
        auth_indicators +
        url_indicators +
        content_indicators
    )

    # 3. Calculate Normalized Risk Score, Classification & Recommendations
    risk_score, risk_level, classification, recommendations, explanation = calculate_risk_assessment(all_indicators)

    # 4. Return In-Memory Structured Response
    return AnalysisResponse(
        analysis_id=str(uuid.uuid4()),
        created_at=datetime.now(timezone.utc),
        risk_score=risk_score,
        risk_level=risk_level,
        classification=classification,
        explanation=explanation,
        email=EmailSummary(
            sender=email_meta.sender,
            recipient=email_meta.recipient,
            subject=email_meta.subject,
            date=email_meta.date,
            reply_to=email_meta.reply_to,
            return_path=email_meta.return_path,
            source_domain=email_meta.source_domain
        ),
        authentication=auth_results,
        urls=urls,
        indicators=[RiskIndicatorItem(**ind.model_dump()) for ind in all_indicators],
        recommendations=recommendations
    )
