PORT_CONSTRAINTS = {
    "Haldia": {"max_draft": 7.5, "max_loa": 190},
    "Paradip": {"max_draft": 14.5, "max_loa": 230},
    "Vizag": {"max_draft": 16.0, "max_loa": 280},
    "Dhamra": {"max_draft": 18.0, "max_loa": 290},
    "Gangavaram": {"max_draft": 19.5, "max_loa": 300}
}

VESSEL_SPECS = {
    "Handysize": {"max_dwt": 35000, "draft": 9.0},
    "Supramax": {"max_dwt": 60000, "draft": 11.5},
    "Panamax": {"max_dwt": 80000, "draft": 13.5},
    "Capesize": {"max_dwt": 180000, "draft": 17.5}
}

def get_vessel_class(cargo_volume):
    if cargo_volume <= 35000: return "Handysize"
    if cargo_volume <= 60000: return "Supramax"
    if cargo_volume <= 80000: return "Panamax"
    return "Capesize"

def optimize_charter(cargo_volume, destination_port, freight_rate, risk_score):
    vessel_type = get_vessel_class(cargo_volume)
    vessel_draft = VESSEL_SPECS[vessel_type]["draft"]
    port_draft = PORT_CONSTRAINTS.get(destination_port, {}).get("max_draft", 12.0)
    
    draft_violation = vessel_draft > port_draft
    lightering_cost = (cargo_volume * 4.80) if draft_violation else 0.0
    
    base_freight = cargo_volume * freight_rate
    demurrage_risk_cost = (risk_score / 100) * 20000
    total_cost = base_freight + lightering_cost + demurrage_risk_cost

    return {
        "vessel_class": vessel_type,
        "vessel_draft": vessel_draft,
        "port_max_draft": port_draft,
        "draft_violation": draft_violation,
        "lightering_required": draft_violation,
        "lightering_cost_usd": lightering_cost,
        "base_freight_usd": base_freight,
        "demurrage_risk_cost_usd": demurrage_risk_cost,
        "total_landed_cost_usd": total_cost,
        "recommendation": "Perform lightering at Sandheads anchorage." if draft_violation else "Direct discharge approved."
    }