# PhishGuard Privacy & Security Principles

## Security Architecture Principles

1. **Defensive Analysis Tooling**: PhishGuard is strictly an analysis tool. It **never** sends emails, executes email attachments, or clicks/crawls suspicious links automatically.
2. **Privacy First (Body Storage Disabled by Default)**: Raw email body content is not stored in SQLite unless the user explicitly toggles "Store Email Body". Metadata and rule results are recorded for triage.
3. **No API Keys in Frontend**: Optional threat intelligence API keys (VirusTotal, AbuseIPDB) are maintained securely in backend `.env` variables and never exposed to client-side code.
4. **Input Boundaries & Safe Parsing**: File upload size is capped at 10MB. Email parsing uses standard library MIME decoders and BeautifulSoup text extractors without running scripts or rendering remote media.
5. **Clear Cybersecurity Disclaimers**:
   - SPF/DKIM/DMARC alignment does not guarantee email content legitimacy.
   - HTTPS encryption does not prove a website is safe.
   - A `LOW RISK` classification does not replace SOC analyst review or secure mail gateways.
