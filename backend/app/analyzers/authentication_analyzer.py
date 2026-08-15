import re
from app.schemas.email import ParsedEmailMetadata
from app.schemas.analysis import AuthenticationDetails, SPFResult, DKIMResult, DMARCResult
from app.services.dns_service import fetch_spf_record, fetch_dmarc_record
from app.detection.indicators import RiskIndicator, create_indicator

def analyze_authentication(email_meta: ParsedEmailMetadata) -> tuple[AuthenticationDetails, list[RiskIndicator]]:
    indicators: list[RiskIndicator] = []
    auth_header = email_meta.auth_results_header.lower()
    domain = email_meta.source_domain.lower()

    # --- 1. SPF ANALYSIS ---
    spf_status = "UNKNOWN"
    spf_record = None
    spf_details = ""

    if "spf=pass" in auth_header or "received-spf: pass" in auth_header:
        spf_status = "PASS"
        spf_details = "SPF reported PASS by receiving mail server header."
    elif "spf=fail" in auth_header or "spf=softfail" in auth_header:
        spf_status = "FAIL"
        spf_details = "SPF reported FAIL or SOFTFAIL by receiving mail server header."

    # DNS Query for SPF TXT Record to provide context
    if domain:
        rec, err = fetch_spf_record(domain)
        if rec:
            spf_record = rec
            if spf_status == "UNKNOWN":
                spf_details = f"SPF TXT record found on DNS ('{rec}'), but header verification status is not present."
        elif err and spf_status == "UNKNOWN":
            spf_details = f"SPF DNS status: {err}."
    else:
        if spf_status == "UNKNOWN":
            spf_details = "Sender domain could not be extracted for SPF lookup."

    if spf_status == "FAIL":
        ind = create_indicator("SPF-001", f"SPF authentication failed for sender domain ({domain or 'unknown'}).")
        if ind:
            indicators.append(ind)

    # --- 2. DKIM ANALYSIS ---
    dkim_status = "UNKNOWN"
    dkim_details = ""

    if "dkim=pass" in auth_header:
        dkim_status = "PASS"
        dkim_details = "DKIM reported PASS by receiving mail server header."
    elif "dkim=fail" in auth_header:
        dkim_status = "FAIL"
        dkim_details = "DKIM signature validation failed according to receiving mail server header."
    else:
        dkim_status = "UNKNOWN"
        dkim_details = "No reliable DKIM authentication result header reported by receiving server."

    if dkim_status == "FAIL":
        ind = create_indicator("DKIM-001", "DKIM validation failed according to receiving mail server header.")
        if ind:
            indicators.append(ind)

    # --- 3. DMARC ANALYSIS ---
    dmarc_status = "UNKNOWN"
    dmarc_policy = None
    dmarc_record = None
    dmarc_details = ""

    if "dmarc=pass" in auth_header:
        dmarc_status = "PASS"
        dmarc_details = "DMARC reported PASS in email Authentication-Results header."
    elif "dmarc=fail" in auth_header:
        dmarc_status = "FAIL"
        dmarc_details = "DMARC reported FAIL in email Authentication-Results header."
    else:
        dmarc_status = "UNKNOWN"
        dmarc_details = "No DMARC evaluation header present."

    if domain:
        dmarc_rec, dmarc_err = fetch_dmarc_record(domain)
        if dmarc_rec:
            dmarc_record = dmarc_rec
            p_match = re.search(r'p=(none|quarantine|reject)', dmarc_rec, re.IGNORECASE)
            if p_match:
                dmarc_policy = p_match.group(1).lower()
            dmarc_details += f" DMARC DNS record found: '{dmarc_rec}'."
        elif dmarc_err:
            dmarc_details += f" {dmarc_err}."

    if dmarc_status == "FAIL":
        ind = create_indicator("DMARC-001", f"DMARC validation failed for domain '{domain}'. Policy: {dmarc_policy or 'unspecified'}.")
        if ind:
            indicators.append(ind)

    auth_response = AuthenticationDetails(
        spf=SPFResult(status=spf_status, domain=domain, record=spf_record, details=spf_details),
        dkim=DKIMResult(status=dkim_status, selector=None, details=dkim_details, verified_by_phishguard=False),
        dmarc=DMARCResult(status=dmarc_status, policy=dmarc_policy, record=dmarc_record, details=dmarc_details)
    )

    return auth_response, indicators
