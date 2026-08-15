"""
PhishGuard MVP Detection Rules Catalog
Lightweight, explainable phishing email detection rules.
"""

RULE_CATALOG = {
    # HEADER RULES
    "HDR-001": {
        "rule_id": "HDR-001",
        "category": "HEADER",
        "name": "Reply-To Domain Mismatch",
        "description": "Reply-To domain differs from sender domain.",
        "severity": "HIGH",
        "score_impact": 15
    },
    "HDR-002": {
        "rule_id": "HDR-002",
        "category": "HEADER",
        "name": "Return-Path Mismatch",
        "description": "Return-Path domain differs from sender domain.",
        "severity": "MEDIUM",
        "score_impact": 10
    },

    # AUTHENTICATION RULES
    "SPF-001": {
        "rule_id": "SPF-001",
        "category": "AUTH",
        "name": "SPF Validation Failed",
        "description": "SPF check returned FAIL or SOFTFAIL.",
        "severity": "HIGH",
        "score_impact": 20
    },
    "DKIM-001": {
        "rule_id": "DKIM-001",
        "category": "AUTH",
        "name": "DKIM Validation Failed",
        "description": "DKIM signature check failed according to email authentication results.",
        "severity": "HIGH",
        "score_impact": 15
    },
    "DMARC-001": {
        "rule_id": "DMARC-001",
        "category": "AUTH",
        "name": "DMARC Validation Failed",
        "description": "DMARC check failed for sender domain.",
        "severity": "HIGH",
        "score_impact": 20
    },

    # URL RULES
    "URL-001": {
        "rule_id": "URL-001",
        "category": "URL",
        "name": "IP Address URL",
        "description": "URL uses an IP address instead of a domain name.",
        "severity": "HIGH",
        "score_impact": 20
    },
    "URL-002": {
        "rule_id": "URL-002",
        "category": "URL",
        "name": "Deceptive Link",
        "description": "Displayed link text and destination URL do not match.",
        "severity": "HIGH",
        "score_impact": 20
    },
    "URL-003": {
        "rule_id": "URL-003",
        "category": "URL",
        "name": "URL Shortener Used",
        "description": "URL uses a shortening service and should be investigated.",
        "severity": "MEDIUM",
        "score_impact": 10
    },

    # CONTENT RULES
    "CNT-001": {
        "rule_id": "CNT-001",
        "category": "CONTENT",
        "name": "Credential Request",
        "description": "Email content explicitly requests credentials, OTPs, PINs, or verification.",
        "severity": "MEDIUM",
        "score_impact": 10
    },
    "CNT-002": {
        "rule_id": "CNT-002",
        "category": "CONTENT",
        "name": "Urgency / Pressure",
        "description": "Urgent pressure language or coercion tactics detected.",
        "severity": "LOW",
        "score_impact": 5
    }
}
