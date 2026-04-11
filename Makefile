# ============================================================
#  EconSim Pro — Makefile
#  Usage: make <target>
# ============================================================

NODE    := node
NPM     := npm
RUNNER  := $(NODE) run_tests.js
REPORT  := QA-REPORT.md

.DEFAULT_GOAL := help

# ── Help ─────────────────────────────────────────────────────────────────────

.PHONY: help
help:
	@echo ""
	@echo "  EconSim Pro QA — available make targets"
	@echo "  ──────────────────────────────────────────"
	@echo "  make install     Install Node.js dependencies (node-html-parser)"
	@echo "  make test        Run full test suite (verbose)"
	@echo "  make qa          Run full suite + write QA-REPORT.md"
	@echo "  make fast        Run tests fast"
	@echo "  make report      Cat the last QA-REPORT.md (no re-run)"
	@echo "  make clean       Remove generated test artifacts"
	@echo ""
	@echo "  Per-module shortcuts:"
	@echo "  make t-html       make t-modules   make t-components"
	@echo ""

# ── Setup ────────────────────────────────────────────────────────────────────

.PHONY: install
install:
	$(NPM) install

# ── Testing ──────────────────────────────────────────────────────────────────

.PHONY: test
test:
	$(RUNNER)

.PHONY: qa
qa:
	$(RUNNER) --out $(REPORT)
	@echo ""
	@echo "  ✅  QA complete. Report → $$(REPORT)"

.PHONY: fast
fast:
	$(RUNNER) --fast --out $(REPORT)
	@echo ""
	@echo "  ✅  Fast QA complete. Report → $$(REPORT)"

.PHONY: report
report:
	@cat $(REPORT) 2>/dev/null || echo "No QA-REPORT.md found — run 'make qa' first."

# ── Per-module targets ────────────────────────────────────────────────────────

.PHONY: t-html
t-html:
	$(RUNNER) --module html_structure

.PHONY: t-modules
t-modules:
	$(RUNNER) --module simulator_modules

.PHONY: t-components
t-components:
	$(RUNNER) --module interactive_components

# ── Cleanup ───────────────────────────────────────────────────────────────────

.PHONY: clean
clean:
	rm -f $(REPORT)
	@echo "  🧹  Cleaned QA artifacts."
