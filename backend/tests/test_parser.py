from app.services.email_parser import parse_raw_email

SAMPLE_RAW_EMAIL = """From: "Microsoft Security" <no-reply@micros0ft-update.com>
To: target@company.com
Subject: URGENT: Account Suspension Notice
Date: Mon, 11 Aug 2026 10:00:00 +0000
Reply-To: phisher@attacker-server.com
Return-Path: <bounce@attacker-server.com>
Message-ID: <12345@micros0ft-update.com>
Received: from relay1.attacker.com by mx.company.com; Mon, 11 Aug 2026 10:00:01 +0000
Authentication-Results: mx.company.com; spf=fail; dkim=fail; dmarc=fail

Dear Customer,

Your account will be suspended immediately unless you verify your password.
Please log in at: http://192.168.1.100/login or click <a href="http://evil.com/phish">https://paypal.com/verify</a>
"""

def test_email_parser_basic():
    parsed = parse_raw_email(SAMPLE_RAW_EMAIL)
    assert parsed.sender == '"Microsoft Security" <no-reply@micros0ft-update.com>'
    assert parsed.recipient == "target@company.com"
    assert parsed.subject == "URGENT: Account Suspension Notice"
    assert parsed.reply_to == "phisher@attacker-server.com"
    assert parsed.return_path == "<bounce@attacker-server.com>"
    assert parsed.source_domain == "micros0ft-update.com"
    assert parsed.received_count == 1
    assert "spf=fail" in parsed.auth_results_header

def test_malformed_email_handling():
    # Should not crash on invalid/empty inputs
    parsed = parse_raw_email("")
    assert parsed.sender == "Unknown Sender"
    assert parsed.subject == "(No Subject)"
