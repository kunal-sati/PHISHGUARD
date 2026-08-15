from app.detection.indicators import RiskIndicator

def calculate_risk_assessment(indicators: list[RiskIndicator]) -> tuple[int, str, str, list[str], str]:
    """
    Calculates normalized risk score (0-100), risk level, classification, actionable recommendations, and explanation text.
    """
    seen_rule_ids = set()
    total_raw_score = 0
    unique_indicators: list[RiskIndicator] = []

    for ind in indicators:
        if ind.rule_id not in seen_rule_ids:
            seen_rule_ids.add(ind.rule_id)
            total_raw_score += ind.score_impact
            unique_indicators.append(ind)

    # Normalize score to 0 - 100
    final_score = min(max(total_raw_score, 0), 100)

    # Risk level classification
    if final_score <= 30:
        risk_level = "LOW"
        classification = "LEGITIMATE"
    elif final_score <= 60:
        risk_level = "MEDIUM"
        classification = "SUSPICIOUS"
    elif final_score <= 80:
        risk_level = "HIGH"
        classification = "LIKELY_PHISHING"
    else:
        risk_level = "CRITICAL"
        classification = "HIGHLY_SUSPICIOUS"

    # Rule-driven Actionable Recommendations Engine
    recommendations = []
    if any(ind.rule_id == "CNT-001" for ind in unique_indicators):
        recommendations.append("Do not provide passwords, OTPs, PINs, or verification codes.")

    if any(ind.rule_id == "URL-002" for ind in unique_indicators) or any(ind.category == "URL" for ind in unique_indicators):
        recommendations.append("Do not click suspicious links. Navigate to the organization's official website manually.")

    if any(ind.category == "AUTH" for ind in unique_indicators) or any(ind.rule_id in ["HDR-001", "HDR-002"] for ind in unique_indicators):
        recommendations.append("Verify the sender through an independent trusted communication channel.")

    if len(unique_indicators) >= 2:
        recommendations.append("Report the email to your organization's security or IT team.")

    if not recommendations:
        recommendations.append("Standard email security hygiene applies. Always verify sender identity when receiving unexpected requests.")

    # Explanation summary string
    if final_score <= 30:
        explanation = "The email passed standard security checks or triggered only minor low-severity indicators."
    elif final_score <= 60:
        explanation = "The email exhibits moderate security risks such as header mismatches or urgency tactics. Proceed with caution."
    else:
        reasons = [ind.description for ind in unique_indicators[:3]]
        explanation = f"The message contains multiple independent threat signals associated with phishing ({'; '.join(reasons)})."

    return final_score, risk_level, classification, recommendations, explanation
