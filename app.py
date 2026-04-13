import os
from pathlib import Path
from contextlib import redirect_stderr, redirect_stdout
from io import StringIO
import numpy as np

import pandas as pd
import plotly.graph_objects as go
import requests
import streamlit as st
import yfinance as yf


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


def get_any_secret(names: list[str]) -> str:
    for n in names:
        v = get_secret(n)
        if v:
            return v
    return ""


def inject_keys(html: str) -> str:
    """
    Keep compatibility with repo deploy workflow:
    - __AV_API_KEY__ <- AV_API_KEY
    - __FRED_API_KEY__ <- FRED_API
    """
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


@st.cache_data(ttl=600)
def fetch_yahoo_series(symbol: str, period: str = "1mo", interval: str = "1d") -> pd.DataFrame:
    # Silence yfinance stderr/stdout noise (e.g., rate-limit traces) and return empty on failure.
    sink = StringIO()
    try:
        with redirect_stdout(sink), redirect_stderr(sink):
            data = yf.download(
                symbol,
                period=period,
                interval=interval,
                progress=False,
                auto_adjust=False,
                threads=False,
            )
    except Exception:
        return pd.DataFrame()
    if data is None or data.empty:
        return pd.DataFrame()
    return data


@st.cache_data(ttl=1800)
def fetch_fred_observations(series_id: str, api_key: str, limit: int = 80, units: str = "lin") -> pd.DataFrame:
    if not api_key:
        return pd.DataFrame()
    url = "https://api.stlouisfed.org/fred/series/observations"
    params = {
        "series_id": series_id,
        "api_key": api_key,
        "file_type": "json",
        "sort_order": "asc",
        "limit": limit,
        "units": units,
    }
    resp = requests.get(url, params=params, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    rows = []
    for o in data.get("observations", []):
        val = o.get("value")
        if val in (None, "."):
            continue
        try:
            rows.append({"date": pd.to_datetime(o["date"]), "value": float(val)})
        except Exception:
            continue
    return pd.DataFrame(rows)


def line_chart(df: pd.DataFrame, title: str, y_title: str, color: str = "#0891b2"):
    if df is None or df.empty:
        st.info("No data returned.")
        return
    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=df["date"],
            y=df["value"],
            mode="lines",
            line=dict(color=color, width=2),
            fill="tozeroy",
        )
    )
    fig.update_layout(
        title=title,
        xaxis_title="Date",
        yaxis_title=y_title,
        margin=dict(l=20, r=20, t=45, b=20),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
    )
    st.plotly_chart(fig, width="stretch")


def fetch_fx_series(pair_label: str, yahoo_symbol: str, fred_key: str) -> tuple[pd.DataFrame, str]:
    # Primary: Yahoo via yfinance
    ydf = fetch_yahoo_series(yahoo_symbol, "1mo", "1d")
    if not ydf.empty and "Close" in ydf:
        close_obj = ydf["Close"]
        # yfinance may return Close as DataFrame (MultiIndex columns) or Series.
        if isinstance(close_obj, pd.DataFrame):
            if close_obj.shape[1] >= 1:
                close = close_obj.iloc[:, 0]
            else:
                close = pd.Series(dtype="float64")
        else:
            close = close_obj
        # Extra defensive normalization: ensure a 1D Series even if upstream returns ndarray-like shapes.
        if not isinstance(close, pd.Series):
            arr = np.asarray(close).squeeze()
            if arr.ndim == 0:
                close = pd.Series([arr])
            elif arr.ndim == 1:
                close = pd.Series(arr)
            else:
                close = pd.Series(arr.reshape(-1))
        close = pd.to_numeric(close, errors="coerce").dropna()
        if len(close) >= 2:
            return (
                pd.DataFrame(
                    {
                        "date": pd.to_datetime(close.index, errors="coerce").to_list(),
                        "value": close.astype(float).to_list(),
                    }
                ),
                "Yahoo",
            )

    # Fallback: FRED daily FX series (if key exists)
    fred_fx_map = {
        "GBP/USD": "DEXUSUK",  # USD per GBP
        "EUR/USD": "DEXUSEU",  # USD per EUR
        "USD/JPY": "DEXJPUS",  # JPY per USD
        "USD/CAD": "DEXCAUS",  # CAD per USD
        "USD/CHF": "DEXSZUS",  # CHF per USD
        "AUD/USD": "DEXUSAL",  # USD per AUD
        "NZD/USD": "DEXUSNZ",  # USD per NZD
    }
    if fred_key and pair_label in fred_fx_map:
        fdf = fetch_fred_observations(fred_fx_map[pair_label], fred_key, limit=60, units="lin")
        if not fdf.empty:
            return fdf, "FRED"

    return pd.DataFrame(), "Unavailable"


st.markdown(
    """
<style>
    .block-container { padding-top: 0.4rem; padding-bottom: 0.4rem; max-width: 100%; }
    header[data-testid="stHeader"] { background: transparent; }
</style>
""",
    unsafe_allow_html=True,
)

def render_html_mirror(section_id: str | None = None, height: int = 1800):
    mirror_url = get_any_secret(["ECONSIM_HTML_MIRROR_URL"]) or "https://ranjithvijik.github.io/econsim/"
    url = mirror_url.rstrip("/") + "/"
    if section_id:
        url += f"#{section_id}"
    # Keep args minimal for broad Streamlit-version compatibility.
    try:
        st.iframe(url, height=height)
    except TypeError:
        # Older/newer API mismatch fallback.
        try:
            st.iframe(url)
        except Exception:
            st.warning("Could not embed HTML mirror in this Streamlit runtime.")
            st.markdown(f"[Open mirror in browser]({url})")


st.title("Economics Simulator")
st.caption("Python-native modules by default (yfinance/FRED); automatic fallback to HTML mirror.")

fred_key = get_any_secret(["FRED_API", "FRED_API_KEY"])

python_modules = [
    "Exchange Rates",
    "National Debt",
    "Trade Policy",
    "Comparative Advantage",
]

fallback_section_map = {
    "Exchange Rates": "exchange-rates",
    "National Debt": "national-debt",
    "Trade Policy": "trade-policy",
    "Comparative Advantage": "comp-advantage",
}

selected = st.sidebar.selectbox("Module", python_modules, index=0)
show_full = st.sidebar.toggle("Open full HTML mirror", value=True)

if show_full:
    render_html_mirror(fallback_section_map.get(selected))
    st.stop()

if selected == "Exchange Rates":
    st.subheader("Exchange Rates (Python-native)")
    fx_map = {
        "GBP/USD": ("GBPUSD=X", 4),
        "EUR/USD": ("EURUSD=X", 4),
        "USD/JPY": ("JPY=X", 2),
        "USD/CAD": ("CAD=X", 4),
        "USD/CHF": ("CHF=X", 4),
        "AUD/USD": ("AUDUSD=X", 4),
        "NZD/USD": ("NZDUSD=X", 4),
    }
    pair = st.selectbox("FX pair (Yahoo Finance)", list(fx_map.keys()), index=0)
    ticker, d = fx_map[pair]
    fx_df, fx_source = fetch_fx_series(pair, ticker, fred_key)
    if fx_df.empty:
        st.warning("FX fetch unavailable (Yahoo/FRED). Falling back to HTML mirror section.")
        render_html_mirror("exchange-rates", height=1400)
    else:
        chg = (fx_df["value"].iloc[-1] / fx_df["value"].iloc[-2] - 1) * 100
        c1, c2 = st.columns([1, 2])
        with c1:
            st.metric(pair, f"{fx_df['value'].iloc[-1]:.{d}f}", f"{chg:+.2f}%")
            st.caption(f"Source: {fx_source}")
        with c2:
            line_chart(fx_df, f"{pair} spot history ({fx_source})", "Spot")

elif selected == "National Debt":
    st.subheader("National Debt (Python-native, FRED)")
    if not fred_key:
        st.error(
            "Missing FRED secret. Set `FRED_API` (preferred) or `FRED_API_KEY` "
            "in Streamlit app secrets/environment."
        )
    else:
        debt = fetch_fred_observations("GFDEGDQ188S", fred_key, 80)
        total = fetch_fred_observations("GFDEBTN", fred_key, 20)
        if debt.empty:
            st.warning("FRED debt fetch failed. Falling back to HTML mirror section.")
            render_html_mirror("national-debt", height=1500)
        else:
            c1, c2 = st.columns(2)
            with c1:
                st.metric("Debt / GDP (latest)", f"{debt['value'].iloc[-1]:.1f}%")
            with c2:
                if not total.empty:
                    st.metric("Total public debt (latest, $M)", f"{total['value'].iloc[-1]:,.0f}")
            line_chart(debt, "Federal debt as % of GDP (GFDEGDQ188S)", "% of GDP", color="#0891b2")

elif selected == "Trade Policy":
    st.subheader("Trade Policy / Tariffs (Python-native, FRED)")
    if not fred_key:
        st.error(
            "Missing FRED secret. Set `FRED_API` (preferred) or `FRED_API_KEY` "
            "in Streamlit app secrets/environment."
        )
    else:
        tariff = fetch_fred_observations("B235RC1Q027SBEA", fred_key, 80)
        imports_goods = fetch_fred_observations("A255RC1Q027SBEA", fred_key, 80)
        if tariff.empty:
            st.warning("FRED tariff fetch failed. Falling back to HTML mirror section.")
            render_html_mirror("trade-policy", height=1500)
        else:
            c1, c2 = st.columns(2)
            with c1:
                st.metric("Customs duties (latest, $B SAAR)", f"{tariff['value'].iloc[-1]:.1f}")
            with c2:
                if not imports_goods.empty:
                    imp_last = imports_goods["value"].iloc[-1]
                    t_last = tariff["value"].iloc[-1]
                    if imp_last:
                        st.metric("Duties / Imports (rough)", f"{(t_last / imp_last) * 100:.2f}%")
            line_chart(tariff, "Federal customs duties (B235RC1Q027SBEA)", "Billions USD (SAAR)", color="#ca8a04")

elif selected == "Comparative Advantage":
    st.subheader("Comparative Advantage context (Python-native, FRED)")
    if not fred_key:
        st.error(
            "Missing FRED secret. Set `FRED_API` (preferred) or `FRED_API_KEY` "
            "in Streamlit app secrets/environment."
        )
    else:
        exp = fetch_fred_observations("EXPGS", fred_key, 80)
        imp = fetch_fred_observations("IMPGS", fred_key, 80)
        gdp = fetch_fred_observations("GDP", fred_key, 80)
        nx = fetch_fred_observations("NETEXP", fred_key, 80)
        if exp.empty or imp.empty or gdp.empty or nx.empty:
            st.warning("Trade series incomplete. Falling back to HTML mirror section.")
            render_html_mirror("comp-advantage", height=1500)
        else:
            open_pct = ((exp["value"].iloc[-1] + imp["value"].iloc[-1]) / gdp["value"].iloc[-1]) * 100
            c1, c2 = st.columns(2)
            with c1:
                st.metric("Trade openness (X+M)/GDP", f"{open_pct:.1f}%")
            with c2:
                st.metric("Net exports (latest, $B SAAR)", f"{nx['value'].iloc[-1]:,.0f}")
            line_chart(nx, "Net exports history (NETEXP)", "Billions USD (SAAR)", color="#0891b2")

