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
    """Read from env first, then Streamlit secrets."""
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


def inject_keys(html: str) -> str:
    """
    Keep compatibility with repo deploy workflow:
    - __AV_API_KEY__ <- AV_API_KEY
    - __FRED_API_KEY__ <- FRED_API
    """
    av_key = get_secret("AV_API_KEY")
    fred_key = get_secret("FRED_API")

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
    .block-container { padding-top: 0.4rem; padding-bottom: 0.4rem; max-width: 100%; }
    header[data-testid="stHeader"] { background: transparent; }
</style>
""",
    unsafe_allow_html=True,
)


html = load_index_html()

# Large height to allow full-page scrolling inside Streamlit.
components.html(html, height=1600, scrolling=True)
