import os
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components


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
    if av_key:
        html = html.replace("__AV_API_KEY__", av_key)
    if fred_key:
        html = html.replace("__FRED_API_KEY__", fred_key)
    return html


def load_index_html() -> str:
    index_path = Path(__file__).with_name("index.html")
    if not index_path.exists():
        st.error("`index.html` not found next to `app.py`.")
        st.stop()
    raw = index_path.read_text(encoding="utf-8")
    return inject_keys(raw)


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

