import email
from email.header import decode_header
import re
from bs4 import BeautifulSoup
from app.schemas.email import ParsedEmailMetadata

def decode_mime_header(header_value: str | None) -> str:
    if not header_value:
        return ""
    decoded_fragments = []
    try:
        for fragment, encoding in decode_header(header_value):
            if isinstance(fragment, bytes):
                if encoding:
                    try:
                        decoded_fragments.append(fragment.decode(encoding, errors="replace"))
                    except (LookupError, UnicodeDecodeError):
                        decoded_fragments.append(fragment.decode("utf-8", errors="replace"))
                else:
                    decoded_fragments.append(fragment.decode("utf-8", errors="replace"))
            else:
                decoded_fragments.append(str(fragment))
        return "".join(decoded_fragments)
    except Exception:
        return str(header_value)

def extract_email_domain(email_str: str) -> str:
    if not email_str:
        return ""
    # Look for email pattern like <user@domain.com> or user@domain.com
    match = re.search(r'[\w\.-]+@([\w\.-]+\.\w+)', email_str)
    if match:
        return match.group(1).lower().strip()
    return ""

def parse_raw_email(raw_email_str: str) -> ParsedEmailMetadata:
    """
    Parses a raw email string (RFC 822 / MIME) gracefully into a structured object.
    Never raises an exception on malformed input.
    """
    if isinstance(raw_email_str, bytes):
        try:
            raw_email_str = raw_email_str.decode("utf-8", errors="replace")
        except Exception:
            raw_email_str = str(raw_email_str)

    msg = email.message_from_string(raw_email_str)

    # Header extraction with MIME decoding
    sender = decode_mime_header(msg.get("From", ""))
    recipient = decode_mime_header(msg.get("To", ""))
    subject = decode_mime_header(msg.get("Subject", "(No Subject)"))
    date = decode_mime_header(msg.get("Date", ""))
    reply_to = decode_mime_header(msg.get("Reply-To", ""))
    return_path = decode_mime_header(msg.get("Return-Path", ""))
    message_id = decode_mime_header(msg.get("Message-ID", ""))
    
    received_headers = [decode_mime_header(h) for h in msg.get_all("Received") or []]
    auth_results_header = decode_mime_header(msg.get("Authentication-Results", ""))

    source_domain = extract_email_domain(sender)

    # Extract Body (Plain Text & HTML)
    plain_body = ""
    html_body = ""

    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))

            if "attachment" in content_disposition:
                continue

            payload = part.get_payload(decode=True)
            if payload:
                charset = part.get_content_charset() or "utf-8"
                try:
                    text = payload.decode(charset, errors="replace")
                except (LookupError, UnicodeDecodeError):
                    text = payload.decode("utf-8", errors="replace")

                if content_type == "text/plain":
                    plain_body += text + "\n"
                elif content_type == "text/html":
                    html_body += text + "\n"
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            charset = msg.get_content_charset() or "utf-8"
            try:
                text = payload.decode(charset, errors="replace")
            except (LookupError, UnicodeDecodeError):
                text = payload.decode("utf-8", errors="replace")
            
            if msg.get_content_type() == "text/html":
                html_body = text
            else:
                plain_body = text
        else:
            # Fallback for non-decoded singlepart
            text = str(msg.get_payload())
            plain_body = text

    raw_headers_str = "\n".join(f"{k}: {v}" for k, v in msg.items())

    return ParsedEmailMetadata(
        sender=sender or "Unknown Sender",
        recipient=recipient or "Unknown Recipient",
        subject=subject or "(No Subject)",
        date=date,
        reply_to=reply_to,
        return_path=return_path,
        message_id=message_id,
        source_domain=source_domain,
        received_count=len(received_headers),
        received_headers=received_headers,
        auth_results_header=auth_results_header,
        plain_body=plain_body,
        html_body=html_body,
        raw_headers=raw_headers_str
    )
