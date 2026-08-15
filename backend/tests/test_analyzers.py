from app.services.email_parser import parse_raw_email
from app.analyzers.header_analyzer import analyze_headers
from app.analyzers.authentication_analyzer import analyze_authentication
from app.analyzers.url_analyzer import analyze_urls
from app.analyzers.content_analyzer import analyze_content
from app.detection.risk_engine import calculate_risk_assessment

def test_header_analyzer():
    raw = """From: Security <alerts@legit.com>
Reply-To: evil@attacker.com
Return-Path: <bounce@otherdomain.com>
Subject: Header Test
"""
    meta = parse_raw_email(raw)
    indicators = analyze_headers(meta)
    rule_ids = [ind.rule_id for ind in indicators]
    assert "HDR-001" in rule_ids
    assert "HDR-002" in rule_ids

def test_authentication_analyzer():
    raw = """From: test@example.com
Subject: Auth Test
Authentication-Results: mx.google.com; spf=fail; dkim=fail; dmarc=fail
"""
    meta = parse_raw_email(raw)
    auth_results, indicators = analyze_authentication(meta)
    assert auth_results.spf.status == "FAIL"
    assert auth_results.dkim.status == "FAIL"
    assert auth_results.dmarc.status == "FAIL"
    rule_ids = [ind.rule_id for ind in indicators]
    assert "SPF-001" in rule_ids
    assert "DKIM-001" in rule_ids
    assert "DMARC-001" in rule_ids

def test_url_analyzer_three_rules():
    raw = """From: test@example.com
Subject: Link Test

Visit raw IP: http://192.168.1.1/login or shortener: http://bit.ly/12345
"""
    meta = parse_raw_email(raw)
    meta.html_body = '<a href="http://evil-phish.com">https://paypal.com/login</a>'
    urls, indicators = analyze_urls(meta)
    rule_ids = [ind.rule_id for ind in indicators]
    assert "URL-001" in rule_ids # IP Host
    assert "URL-002" in rule_ids # Deceptive Link
    assert "URL-003" in rule_ids # Shortener

def test_content_analyzer_two_rules():
    raw = """From: test@example.com
Subject: URGENT: Password Verification Required

Please enter your password and OTP code immediately.
"""
    meta = parse_raw_email(raw)
    indicators = analyze_content(meta)
    rule_ids = [ind.rule_id for ind in indicators]
    assert "CNT-001" in rule_ids # Credential request
    assert "CNT-002" in rule_ids # Urgency language

def test_risk_engine_scoring():
    raw = """From: Security <alerts@legit.com>
Reply-To: evil@attacker.com
Subject: URGENT: Verification Required
Authentication-Results: mx.google.com; spf=fail; dmarc=fail

Please enter your password at http://192.168.1.50/login
"""
    meta = parse_raw_email(raw)
    h_ind = analyze_headers(meta)
    _, a_ind = analyze_authentication(meta)
    _, u_ind = analyze_urls(meta)
    c_ind = analyze_content(meta)

    score, level, classification, recs, explanation = calculate_risk_assessment(h_ind + a_ind + u_ind + c_ind)
    assert score > 60
    assert level in ["HIGH", "CRITICAL"]
    assert classification in ["LIKELY_PHISHING", "HIGHLY_SUSPICIOUS"]
    assert len(recs) > 0
    assert len(explanation) > 0
