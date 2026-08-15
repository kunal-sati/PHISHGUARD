# PhishGuard Detection Rules Manual & MITRE ATT&CK Mapping

This reference manual documents all rule definitions, severity categories, score impacts, and corresponding official **MITRE ATT&CK Enterprise Matrix** tactics and techniques implemented in PhishGuard.

---

## Detection Rule Matrix

| Rule ID | Category | Rule Name | Description | Severity | Impact Pts | MITRE Technique ID | MITRE Technique Name |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **HDR-001** | Header | Reply-To Domain Mismatch | Reply-To address domain differs from From sender domain. | HIGH | +15 | `T1566.002` | Spearphishing Link / Deceptive Routing |
| **HDR-002** | Header | Return-Path Mismatch | Return-Path domain differs significantly from From domain. | MEDIUM | +10 | `T1036` | Masquerading |
| **HDR-003** | Header | Suspicious Received Hops | Excessive or suspicious mail relay hops (>6 Received headers). | LOW | +5 | `T1036` | Subverting Relay Inspection |
| **IMP-001** | Sender | Brand Impersonation | Display name claims recognized brand, but sender domain is look-alike/unauthorized. | CRITICAL | +25 | `T1566.002` | Spearphishing / Brand Spoofing |
| **SPF-001** | Auth | SPF Validation Failed | SPF check returned FAIL or SOFTFAIL. | HIGH | +20 | `T1566` | Phishing / Spoofed Sender |
| **SPF-002** | Auth | SPF Record Missing | No SPF TXT record (v=spf1) found for sender domain. | LOW | +5 | `T1586` | Compromised Infrastructure |
| **DKIM-001**| Auth | DKIM Validation Failed | DKIM signature header reported validation error or FAIL. | HIGH | +15 | `T1036` | Email Authentication Spoofing |
| **DMARC-001**| Auth | DMARC Validation Failed| DMARC check failed due to SPF/DKIM domain misalignment. | CRITICAL | +20 | `T1566` | Phishing / Domain Misalignment |
| **URL-001** | URL | IP Hostname in Link | URL uses raw IPv4 address instead of domain name. | HIGH | +20 | `T1071.001` | Web Protocols / Raw IP C2 |
| **URL-002** | URL | Suspicious URL Encoding| URL contains obfuscated percent-encoding characters. | MEDIUM | +10 | `T1027` | Obfuscated Files or Information |
| **URL-003** | URL | Excessive Subdomains | Hostname contains >3 subdomains. | MEDIUM | +10 | `T1036` | Deceptive Subdomain Structure |
| **URL-004** | URL | Suspicious '@' Symbol | Link contains '@' userinfo character to hide real host. | HIGH | +15 | `T1036` | URI Userinfo Obfuscation |
| **URL-005** | URL | URL Shortener Service | Link points to URL shortening service (bit.ly, t.co, etc.). | MEDIUM | +10 | `T1027` | URL Redirection / Obfuscation |
| **URL-006** | URL | Display Text Mismatch | Anchor display text domain differs from actual href domain. | CRITICAL | +25 | `T1566.002` | Spearphishing Link / Deceptive Hyperlink |
| **URL-007** | URL | Non-Standard Port | URL specifies custom port (not 80/443). | MEDIUM | +10 | `T1571` | Non-Standard Port |
| **URL-008** | URL | Abnormally Long URL | URL string length exceeds 150 characters. | LOW | +5 | `T1027` | Obfuscation |
| **CNT-001** | Content| Credential Request | Explicitly requests passwords, OTPs, or verification codes. | HIGH | +15 | `T1566.002` | Spearphishing / Credential Harvesting |
| **CNT-002** | Content| Urgency Language | Uses pressure tactics ('account suspension', 'immediate action'). | MEDIUM | +10 | `T1566` | Social Engineering / Coercion |
| **CNT-003** | Content| Financial Demand | Requests bank wire transfer, invoice payment, or credit card info.| HIGH | +15 | `T1566.001` | Business Email Compromise / Fraud |

---

## Scoring & Risk Level Mapping Formula

$$\text{Raw Score} = \sum_{r \in \text{Triggered Unique Rules}} \text{Impact}(r)$$

$$\text{Final Risk Score} = \min(\max(\text{Raw Score}, 0), 100)$$

| Final Score Range | Risk Level | Classification | Action Standard |
| :---: | :---: | :---: | :--- |
| **0 – 30** | `LOW` | LEGITIMATE | Standard email hygiene. Message passed security checks. |
| **31 – 60** | `MEDIUM` | SUSPICIOUS | Caution advised. Inspect links before opening. |
| **61 – 80** | `HIGH` | LIKELY_PHISHING | Do not click links or reply. Escalated to SOC. |
| **81 – 100**| `CRITICAL` | HIGHLY_SUSPICIOUS | Critical threat alert. Block domain on email gateway. |
