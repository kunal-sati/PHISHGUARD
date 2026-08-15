# PhishGuard REST API Specification

Base URL: `http://localhost:8000/api`

---

## Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System health check and version status |
| `POST` | `/analyze/email` | Analyze raw pasted RFC 822 email text |
| `POST` | `/analyze/file` | Analyze uploaded `.eml` or `.msg` file |
| `GET` | `/analyses` | Search and list past email analysis records |
| `GET` | `/analyses/{id}` | Retrieve complete analysis detail report |
| `DELETE`| `/analyses/{id}` | Delete analysis record permanently |
| `GET` | `/dashboard/stats` | Aggregated SOC dashboard statistics |
| `GET` | `/incidents` | List SOC incident triage tickets |
| `POST` | `/incidents` | Create a new SOC incident ticket |
| `GET` | `/incidents/{id}` | Get single incident details |
| `PUT` | `/incidents/{id}` | Update incident status/analyst notes |
| `GET` | `/reports/{id}` | Export printable HTML security report |

---

## Endpoint Details

### 1. Analyze Pasted Email
`POST /api/analyze/email`

**Request Body**:
```json
{
  "raw_email": "From: \"Microsoft\" <no-reply@micros0ft.com>\nSubject: URGENT...\n\nClick http://192.168.1.1/login",
  "store_email": false
}
```

**Response (200 OK)**:
```json
{
  "analysis_id": "5675b462-f74f-4890-abd4-43ca0bf27aae",
  "created_at": "2026-08-11T12:00:00Z",
  "risk_score": 85,
  "risk_level": "CRITICAL",
  "classification": "HIGHLY_SUSPICIOUS",
  "email": {
    "sender": "\"Microsoft\" <no-reply@micros0ft.com>",
    "recipient": "victim@company.com",
    "subject": "URGENT: Verify Your Password",
    "source_domain": "micros0ft.com"
  },
  "authentication": {
    "spf": { "status": "FAIL", "details": "SPF reported FAIL" },
    "dkim": { "status": "FAIL", "details": "DKIM verification error" },
    "dmarc": { "status": "FAIL", "details": "DMARC check failed" }
  },
  "urls": [
    {
      "url": "http://192.168.1.1/login",
      "hostname": "192.168.1.1",
      "is_ip_host": true,
      "risk_score_contribution": 20
    }
  ],
  "indicators": [
    {
      "rule_id": "IMP-001",
      "category": "SENDER",
      "description": "Brand impersonation detected",
      "severity": "CRITICAL",
      "score_impact": 25,
      "mitre_technique_id": "T1566.002"
    }
  ],
  "recommendations": [
    "Do NOT click links or reply to this email.",
    "Report to SOC team."
  ]
}
```
