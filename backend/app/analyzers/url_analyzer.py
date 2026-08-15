import re
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from app.schemas.email import ParsedEmailMetadata
from app.schemas.analysis import URLAnalysisItem
from app.detection.indicators import RiskIndicator, create_indicator

URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "buff.ly",
    "ow.ly", "rb.gy", "cutt.ly", "shorturl.at", "tiny.cc"
}

IP_HOST_REGEX = re.compile(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')

def extract_domain_from_url(hostname: str) -> str:
    if not hostname:
        return ""
    parts = hostname.split(".")
    if len(parts) >= 2:
        return ".".join(parts[-2:]).lower()
    return hostname.lower()

def analyze_urls(email_meta: ParsedEmailMetadata) -> tuple[list[URLAnalysisItem], list[RiskIndicator]]:
    extracted_urls: list[URLAnalysisItem] = []
    indicators: list[RiskIndicator] = []
    raw_links: list[tuple[str, str | None]] = []

    # 1. Extract links from HTML body
    if email_meta.html_body:
        try:
            soup = BeautifulSoup(email_meta.html_body, "html.parser")
            for a in soup.find_all("a", href=True):
                href = a["href"].strip()
                text = a.get_text().strip()
                if href.startswith("http://") or href.startswith("https://") or href.startswith("//"):
                    raw_links.append((href, text if text else None))
        except Exception:
            pass

    # 2. Extract links from Plain Body using regex
    url_pattern = re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+', re.IGNORECASE)
    for m in url_pattern.finditer(email_meta.plain_body):
        found_url = m.group(0)
        if not any(r[0] == found_url for r in raw_links):
            raw_links.append((found_url, None))

    seen_urls = set()

    for href, display_text in raw_links:
        if href in seen_urls:
            continue
        seen_urls.add(href)

        full_url = "https:" + href if href.startswith("//") else href
        parsed = urlparse(full_url)
        
        hostname = parsed.hostname or ""
        scheme = parsed.scheme or ""
        port = parsed.port
        path = parsed.path or ""
        query = parsed.query or ""
        
        domain = extract_domain_from_url(hostname)
        is_https = (scheme.lower() == "https")
        is_ip_host = bool(IP_HOST_REGEX.match(hostname))
        is_shortener = (domain in URL_SHORTENERS or hostname in URL_SHORTENERS)
        
        url_length = len(full_url)

        # Check Display Mismatch (URL-002)
        display_mismatch = False
        if display_text:
            disp_match = re.search(r'(?:https?://)?([a-zA-Z0-9\.-]+\.[a-zA-Z]{2,})', display_text)
            if disp_match:
                disp_domain = extract_domain_from_url(disp_match.group(1))
                if disp_domain and domain and disp_domain != domain:
                    display_mismatch = True

        flags = []
        item_score_contrib = 0

        # --- RULE EVALUATIONS (ONLY 3 RULES) ---
        # Rule URL-001: IP Hostname in Link
        if is_ip_host:
            flags.append("IP_HOSTNAME")
            item_score_contrib += 20
            ind = create_indicator("URL-001", f"URL uses raw IP host address: '{full_url}'.")
            if ind:
                indicators.append(ind)

        # Rule URL-002: Deceptive Link / Display Text Mismatch
        if display_mismatch:
            flags.append("DISPLAY_MISMATCH")
            item_score_contrib += 20
            ind = create_indicator(
                "URL-002",
                f"Displayed link text ('{display_text}') and destination URL ('{hostname}') do not match."
            )
            if ind:
                indicators.append(ind)

        # Rule URL-003: URL Shortener Service Used
        if is_shortener:
            flags.append("URL_SHORTENER")
            item_score_contrib += 10
            ind = create_indicator("URL-003", f"URL relies on shortening service '{hostname}' and should be investigated.")
            if ind:
                indicators.append(ind)

        extracted_urls.append(URLAnalysisItem(
            url=full_url,
            scheme=scheme,
            hostname=hostname,
            domain=domain,
            port=port,
            path=path,
            query=query,
            url_length=url_length,
            subdomain_count=0,
            is_https=is_https,
            is_ip_host=is_ip_host,
            is_shortener=is_shortener,
            display_text=display_text,
            display_mismatch=display_mismatch,
            risk_score_contribution=item_score_contrib,
            flags=flags
        ))

    return extracted_urls, indicators
