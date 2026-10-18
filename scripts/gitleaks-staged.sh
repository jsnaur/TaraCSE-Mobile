#!/bin/sh
# Scan staged changes for secrets. CI runs a full-history scan regardless.
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks git --staged --redact --no-banner || exit 1
else
  echo "gitleaks not installed; skipping local secret scan (CI still scans)."
  echo "Install: winget install Gitleaks.Gitleaks"
fi
