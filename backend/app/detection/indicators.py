from pydantic import BaseModel
from app.detection.rules import RULE_CATALOG

class RiskIndicator(BaseModel):
    rule_id: str
    category: str
    description: str
    severity: str
    score_impact: int

def create_indicator(rule_id: str, custom_details: str | None = None) -> RiskIndicator | None:
    if rule_id not in RULE_CATALOG:
        return None
    r = RULE_CATALOG[rule_id]
    desc = custom_details if custom_details else r["description"]
    return RiskIndicator(
        rule_id=r["rule_id"],
        category=r["category"],
        description=desc,
        severity=r["severity"],
        score_impact=r["score_impact"]
    )
