import os
import json
from pathlib import Path
from datetime import datetime, timezone

import requests
import streamlit as st
import streamlit.components.v1 as components
import world_bank_data as wb


st.set_page_config(
    page_title="Economics Simulator",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed",
)


def get_secret(name: str) -> str:
    val = os.getenv(name, "").strip()
    if val:
        return val
    try:
        sval = st.secrets.get(name, "")
        if isinstance(sval, str):
            return sval.strip()
    except Exception:
        pass
    return ""


def get_any_secret(names: list[str]) -> str:
    for n in names:
        v = get_secret(n)
        if v:
            return v
    return ""


def inject_keys(html: str) -> str:
    """Use the same secret names as repo/deploy workflows."""
    av_key = get_any_secret(["AV_API_KEY", "ALPHA_VANTAGE_API_KEY"])
    fred_key = get_any_secret(["FRED_API", "FRED_API_KEY"])
    bea_key = get_any_secret(["BEA_API", "BEA_API_KEY"])
    if av_key:
        html = html.replace("__AV_API_KEY__", av_key)
    if fred_key:
        html = html.replace("__FRED_API_KEY__", fred_key)
    if bea_key:
        html = html.replace("__BEA_API_KEY__", bea_key)
    return html


def load_index_html() -> str:
    index_path = Path(__file__).with_name("index.html")
    if not index_path.exists():
        st.error("`index.html` not found next to `app.py`.")
        st.stop()
    raw = inject_keys(index_path.read_text(encoding="utf-8"))
    fred_key = get_any_secret(["FRED_API", "FRED_API_KEY"])
    data360_bootstrap = get_data360_trade_bootstrap()
    wb_bootstrap = get_world_bank_trade_bootstrap()

    # Remove manual key prompt UI and auto-seed localStorage when secret is available.
    bootstrap = """
<style>
  #fred-api-setup { display: none !important; }
</style>
"""
    if fred_key:
        bootstrap += (
            "<script>"
            "try { localStorage.setItem('econsim_fred_api_key', "
            + json.dumps(fred_key)
            + "); } catch(e) {}"
            "</script>"
        )
    if data360_bootstrap:
        bootstrap += (
            "<script>"
            "try { const _d360 = "
            + json.dumps(data360_bootstrap)
            + "; localStorage.setItem('econsim_data360_trade_bootstrap', JSON.stringify(_d360)); } catch(e) {}"
            "</script>"
        )
    if wb_bootstrap:
        bootstrap += (
            "<script>"
            "try { const _wb = "
            + json.dumps(wb_bootstrap)
            + "; localStorage.setItem('econsim_world_bank_trade_bootstrap', JSON.stringify(_wb)); } catch(e) {}"
            "</script>"
        )
    return bootstrap + raw


@st.cache_data(ttl=60 * 60 * 12, show_spinner=False)
def get_data360_trade_bootstrap() -> dict:
    """
    Pull annual U.S. trade % of GDP indicators from World Bank Data360 API.
    """
    base = "https://data360api.worldbank.org/data360/data"
    indicators = {
        "NE.TRD.GNFS.ZS": "WB_WDI_NE_TRD_GNFS_ZS",
        "NE.EXP.GNFS.ZS": "WB_WDI_NE_EXP_GNFS_ZS",
        "NE.IMP.GNFS.ZS": "WB_WDI_NE_IMP_GNFS_ZS",
    }
    out: dict[str, object] = {
        "country": "USA",
        "source": "Data360",
        "database_id": "WB_WDI",
        "series": {},
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }
    timeout = (4, 15)
    headers = {"Accept": "application/json"}

    try:
        for plain_code, data360_code in indicators.items():
            params = {
                "DATABASE_ID": "WB_WDI",
                "INDICATOR": data360_code,
                "REF_AREA": "USA",
                "FREQ": "A",
                "isLatestData": "false",
            }
            resp = requests.get(base, params=params, headers=headers, timeout=timeout)
            resp.raise_for_status()
            payload = resp.json()
            rows = payload.get("value") if isinstance(payload, dict) else None
            if not isinstance(rows, list):
                continue
            cleaned = []
            for r in rows:
                try:
                    year = int(str(r.get("TIME_PERIOD", "")).strip())
                    value = float(str(r.get("OBS_VALUE", "")).replace(",", "").strip())
                except Exception:
                    continue
                cleaned.append({"date": f"{year}-01-01", "value": value})
            cleaned.sort(key=lambda x: x["date"])
            if cleaned:
                out["series"][plain_code] = cleaned
    except Exception:
        return {}

    return out if out["series"] else {}


@st.cache_data(ttl=60 * 60 * 12, show_spinner=False)
def get_world_bank_trade_bootstrap() -> dict:
    """
    Pull a small set of U.S. trade indicators from World Bank Data API.
    Cached for 12h to avoid rate-limit / repeated startup calls.
    """
    indicators = [
        "NE.TRD.GNFS.ZS",  # Trade (% of GDP)
        "NE.EXP.GNFS.ZS",  # Exports (% of GDP)
        "NE.IMP.GNFS.ZS",  # Imports (% of GDP)
    ]
    result: dict[str, object] = {"country": "USA", "source": "World Bank", "series": {}, "fetched_at": ""}
    try:
        data = wb.get_series(indicators, country="USA")
        # Normalize into {indicator: [{date, value}, ...]} ascending by date.
        for indicator in indicators:
            try:
                s = data.xs(indicator, level=0).dropna()
            except Exception:
                continue
            rows = []
            for year, val in s.items():
                try:
                    y = int(year)
                    v = float(val)
                except Exception:
                    continue
                rows.append({"date": f"{y}-01-01", "value": v})
            rows.sort(key=lambda x: x["date"])
            result["series"][indicator] = rows
        result["fetched_at"] = datetime.now(timezone.utc).isoformat()
        return result
    except Exception:
        return {}


st.markdown(
    """
<style>
  .block-container { padding-top: 0; padding-bottom: 0; max-width: 100%; }
  header[data-testid="stHeader"] { background: transparent; }
  div[data-testid="stToolbar"] { visibility: hidden; height: 0; }
</style>
""",
    unsafe_allow_html=True,
)

html = load_index_html()

# Full mirror of index.html (all 78 modules, same order/layout/styles/scripts).
components.html(html, height=9000, scrolling=True)

