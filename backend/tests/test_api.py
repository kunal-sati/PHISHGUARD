from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_analyze_email_paste_endpoint():
    raw_email = """From: "Security Notice" <no-reply@example-phishing.test>
To: victim@company.com
Subject: URGENT: Verify Your Password Immediately
Authentication-Results: mx.google.com; spf=fail; dmarc=fail

Dear user, your password will expire. Click http://192.168.1.50/verify to update your credentials.
"""
    response = client.post("/api/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert "analysis_id" in data
    assert data["risk_score"] >= 60
    assert data["risk_level"] in ["HIGH", "CRITICAL"]
    assert data["authentication"]["spf"]["status"] == "FAIL"

def test_analyze_email_file_endpoint():
    raw_email_bytes = b"""From: "Newsletter" <newsletter@example.com>
To: victim@company.com
Subject: Weekly Tech Digest
Authentication-Results: mx.google.com; spf=pass; dkim=pass; dmarc=pass

Welcome to our weekly newsletter!
"""
    files = {"file": ("test_sample.eml", raw_email_bytes, "message/rfc822")}
    response = client.post("/api/analyze/file", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] <= 30
    assert data["risk_level"] == "LOW"
