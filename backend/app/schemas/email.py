from pydantic import BaseModel, Field

class EmailInputPaste(BaseModel):
    raw_email: str = Field(..., description="Raw RFC822 email content including headers and body")
    store_email: bool = Field(False, description="Whether to store raw body in database")

class ParsedEmailMetadata(BaseModel):
    sender: str
    recipient: str
    subject: str
    date: str
    reply_to: str
    return_path: str
    message_id: str
    source_domain: str
    received_count: int
    received_headers: list[str]
    auth_results_header: str
    plain_body: str
    html_body: str
    raw_headers: str
