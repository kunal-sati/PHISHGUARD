# PHISHGUARD
## Lightweight Phishing Email Detection and Security Analysis System

> **Subtitle**: An Automated, Explainable Framework for Email Header Inspection, SPF/DKIM/DMARC Verification, URL Security Checks, and Risk Assessment

---

## 1. Project Overview

**PhishGuard** is a lightweight, explainable cybersecurity web application designed to analyze raw email content (RFC 822), verify SPF/DKIM/DMARC email authentication alignment, inspect URL threat mechanics, detect social engineering language, and calculate a transparent risk score (0–100).

Rather than outputting an arbitrary binary "safe/unsafe" label, PhishGuard provides a transparent breakdown of every triggered rule, explaining **WHY** an email received its risk classification alongside recommended defensive actions.

---

## 2. Problem Statement

Phishing remains the leading vector for initial network intrusion, credential theft, and business email compromise (BEC). Many end users and junior SOC analysts lack immediate tools to unpack complex email headers, verify authentication results, inspect deceptive hyperlinks, and understand threat indicators. PhishGuard bridges this gap by providing instant, explainable email security analysis.

---

## 3. Core Objectives

- **Automated Parsing**: Extract structured metadata from raw RFC 822 headers and body text.
- **Protocol Verification**: Check SPF, DKIM, and DMARC alignment status and query DNS TXT records.
- **URL & Content Scans**: Detect raw IP hosts, deceptive hyperlink mismatches, shorteners, credential harvesting prompts, and urgency coercion.
- **Explainable Risk Engine**: Calculate a normalized 0–100 risk score with explicit indicator rule attribution.

---

## 4. Architecture & Pipeline

```
            USER
              │
              ▼
      Paste / Upload .eml
              │
              ▼
        Email Parser
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
 Headers    SPF/DKIM   Content
 Analysis    /DMARC    Analysis
    │         │         │
    └─────────┼─────────┘
              ▼
         URL Analysis
              │
              ▼
         Risk Engine
              │
              ▼
      Risk Score 0–100
              │
              ▼
     Explainable Result
              │
              ▼
      Recommendations
```

---

## 5. Technology Stack

### Backend
- **Python 3.11+**
- **FastAPI**: Lightweight asynchronous API framework
- **Pydantic v2**: Data validation and response schemas
- **dnspython**: Live DNS TXT record lookups for SPF (`v=spf1`) and DMARC (`_dmarc.<domain>`)
- **BeautifulSoup4**: HTML body link extraction
- **Pytest**: Automated test suite

### Frontend
- **React 18 & TypeScript**
- **Vite**: Rapid frontend build tool
- **Tailwind CSS**: Modern UI styling
- **Recharts**: Session risk distribution charts
- **Lucide React**: Modern icon set

---

## 6. Active Detection Rules & Risk Scoring

PhishGuard evaluates emails against 10 core detection rules:

| Rule ID | Category | Name | Description | Severity | Score Impact |
| :---: | :---: | :--- | :--- | :---: | :---: |
| **`HDR-001`** | HEADER | Reply-To Domain Mismatch | Reply-To domain differs from sender domain. | HIGH | +15 |
| **`HDR-002`** | HEADER | Return-Path Mismatch | Return-Path domain differs from sender domain. | MEDIUM | +10 |
| **`SPF-001`** | AUTH | SPF Validation Failed | SPF check returned FAIL or SOFTFAIL. | HIGH | +20 |
| **`DKIM-001`** | AUTH | DKIM Validation Failed | DKIM check failed according to authentication results. | HIGH | +15 |
| **`DMARC-001`** | AUTH | DMARC Validation Failed | DMARC check failed for sender domain. | HIGH | +20 |
| **`URL-001`** | URL | IP Address URL | URL uses an IP address host instead of a domain. | HIGH | +20 |
| **`URL-002`** | URL | Deceptive Link | Displayed anchor link text and href URL do not match. | HIGH | +20 |
| **`URL-003`** | URL | URL Shortener | URL uses a shortening service (e.g. `bit.ly`, `t.co`). | MEDIUM | +10 |
| **`CNT-001`** | CONTENT | Credential Request | Email explicitly requests passwords, OTPs, or verification codes. | MEDIUM | +10 |
| **`CNT-002`** | CONTENT | Urgency / Pressure | Urgent pressure language or coercion tactics detected. | LOW | +5 |

### Risk Matrix

| Risk Level | Score Range | Classification | Actionable Remediation |
| :---: | :---: | :---: | :--- |
| **`LOW`** | 0 – 30 | `LEGITIMATE` | Standard email security hygiene applies. |
| **`MEDIUM`** | 31 – 60 | `SUSPICIOUS` | Caution advised. Inspect links before navigating. |
| **`HIGH`** | 61 – 80 | `LIKELY_PHISHING` | Do not click links or provide credentials. Verify sender. |
| **`CRITICAL`** | 81 – 100 | `HIGHLY_SUSPICIOUS` | Critical threat. Report message to IT/Security team. |

---

## 7. Email Authentication (SPF / DKIM / DMARC)

- **SPF**: Evaluates header authentication status (`PASS`, `FAIL`, `UNKNOWN`) and queries DNS for sender domain SPF records (`v=spf1`).
- **DKIM**: Reads DKIM validation results reported by receiving mail servers (`PASS`, `FAIL`, `UNKNOWN`).
- **DMARC**: Evaluates DMARC status and queries DNS TXT records (`_dmarc.<domain>`) to identify domain policy (`p=none`, `p=quarantine`, `p=reject`).

---

## 8. Installation & Setup Guide

### 1. Prerequisites
- **Python 3.11+**
- **Node.js 18+**

### 2. Backend Setup
```bash
# Navigate to project directory
cd "/Users/siddharthsati/Desktop/Email Security"

# Activate virtual environment
source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run pytest test suite
PYTHONPATH=backend backend/venv/bin/pytest backend/tests -v

# Start FastAPI Uvicorn server (Port 8000)
PYTHONPATH=backend backend/venv/bin/uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
# In a new terminal tab, navigate to frontend directory
cd "/Users/siddharthsati/Desktop/Email Security/frontend"

# Install npm dependencies
npm install

# Run production build check
npm run build

# Start Vite development server (Port 3000)
npm run dev
```

Open browser at `http://localhost:3000`.

---

## 9. Technical Limitations & Disclaimers

1. **SPF PASS** confirms sending server authorization, not message benevolence.
2. **DKIM PASS** status is parsed from receiving mail server headers; PhishGuard does not perform independent raw RSA cryptographic key verification.
3. **HTTPS** protocol indicates transport encryption, not destination website legitimacy.
4. Header mismatches are heuristic risk indicators and do not guarantee malice on their own.

---

## 10. Future Scope

The following enterprise SOC features are planned for future scope:
- MITRE ATT&CK framework technique mapping (`T1566`, `T1036`, `T1071`)
- SOC Incident Ticket management and analyst workflow dashboard
- Persistent database storage and searchable historical analysis logs
- Attachment malware sandbox scanning & QR code threat detection
- Transformer / Machine Learning NLP phishing detection models
- Exportable Executive HTML & PDF security reports
