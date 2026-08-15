import dns.resolver
from app.config import settings

# Memory cache for DNS query results (domain -> dict)
_DNS_CACHE: dict[str, dict] = {}

def get_txt_records(domain: str) -> tuple[list[str], str | None]:
    """
    Performs DNS TXT lookup for domain.
    Returns (list_of_txt_strings, error_message_if_any)
    """
    if not domain or "." not in domain:
        return [], "Invalid domain"

    cache_key = f"TXT:{domain.lower()}"
    if cache_key in _DNS_CACHE:
        return _DNS_CACHE[cache_key]["records"], _DNS_CACHE[cache_key]["error"]

    try:
        resolver = dns.resolver.Resolver()
        resolver.lifetime = settings.DNS_TIMEOUT_SECONDS
        resolver.timeout = settings.DNS_TIMEOUT_SECONDS
        
        answers = resolver.resolve(domain, "TXT")
        records = []
        for rdata in answers:
            # Join multiple TXT string chunks
            txt_content = "".join([b.decode("utf-8", errors="ignore") for b in rdata.strings])
            records.append(txt_content)

        _DNS_CACHE[cache_key] = {"records": records, "error": None}
        return records, None

    except dns.resolver.NXDOMAIN:
        err = "Domain does not exist (NXDOMAIN)"
        _DNS_CACHE[cache_key] = {"records": [], "error": err}
        return [], err
    except dns.resolver.NoAnswer:
        err = "No TXT record found for domain"
        _DNS_CACHE[cache_key] = {"records": [], "error": err}
        return [], err
    except dns.resolver.Timeout:
        err = "DNS query timed out"
        _DNS_CACHE[cache_key] = {"records": [], "error": err}
        return [], err
    except Exception as e:
        err = f"DNS lookup failed: {str(e)}"
        _DNS_CACHE[cache_key] = {"records": [], "error": err}
        return [], err


def fetch_spf_record(domain: str) -> tuple[str | None, str | None]:
    """
    Retrieves the SPF TXT record for a domain.
    Returns (spf_record, error_message)
    """
    records, error = get_txt_records(domain)
    if error and not records:
        return None, error

    for r in records:
        if r.startswith("v=spf1") or "v=spf1" in r:
            return r, None

    return None, "No SPF record (v=spf1) found in DNS TXT records"


def fetch_dmarc_record(domain: str) -> tuple[str | None, str | None]:
    """
    Retrieves DMARC TXT record from _dmarc.domain.
    Returns (dmarc_record, error_message)
    """
    dmarc_domain = f"_dmarc.{domain}"
    records, error = get_txt_records(dmarc_domain)
    if error and not records:
        return None, error

    for r in records:
        if r.startswith("v=DMARC1") or "v=DMARC1" in r:
            return r, None

    return None, "No DMARC record (v=DMARC1) found at _dmarc." + domain
