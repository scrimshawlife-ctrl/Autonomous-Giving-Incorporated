#!/usr/bin/env bash
# Smoke the public AGI suite under autogive.app (or BASE_URL).
set -euo pipefail

BASE_URL="${BASE_URL:-https://autogive.app}"
FAIL=0

check() {
  local path="$1"
  local expect="${2:-200}"
  local url="${BASE_URL}${path}"
  local code
  code=$(curl -sS -o /tmp/agi-smoke-body -w "%{http_code}" -L -m 25 "$url" || echo "000")
  if [[ "$code" != "$expect" ]]; then
    echo "FAIL  $code (want $expect)  $url"
    FAIL=1
    return
  fi
  echo "OK    $code  $url"
}

echo "Smoke public suite @ ${BASE_URL}"
check "/"
check "/robots.txt"
# sitemap may be /sitemap.xml or /sitemap (cleanUrls)
code_sm=$(curl -sS -o /dev/null -w "%{http_code}" -L -m 25 "${BASE_URL}/sitemap.xml" || echo 000)
code_sm2=$(curl -sS -o /dev/null -w "%{http_code}" -L -m 25 "${BASE_URL}/sitemap" || echo 000)
if [[ "$code_sm" == "200" || "$code_sm2" == "200" ]]; then
  echo "OK    sitemap (${code_sm}/${code_sm2})"
else
  echo "FAIL  sitemap (${code_sm}/${code_sm2})"
  FAIL=1
fi
check "/fund-intel"
check "/impact-relay"
check "/fund-intel/data/public-campaign.json"
check "/impact-relay/data/public-impact.json"

# Authority contracts (privacy-safe public projections)
if ! grep -q 'advisory_only' /tmp/agi-smoke-body 2>/dev/null; then
  # re-fetch campaign for authority (last body may be impact)
  curl -sS -L -m 25 "${BASE_URL}/fund-intel/data/public-campaign.json" -o /tmp/agi-smoke-campaign
  if ! grep -q 'advisory_only' /tmp/agi-smoke-campaign; then
    echo "FAIL  public-campaign.json missing authority advisory_only"
    FAIL=1
  else
    echo "OK    public-campaign.json authority"
  fi
else
  echo "OK    public-campaign.json authority"
fi

curl -sS -L -m 25 "${BASE_URL}/impact-relay/data/public-impact.json" -o /tmp/agi-smoke-impact
if ! grep -q 'public_aggregate_only' /tmp/agi-smoke-impact; then
  echo "FAIL  public-impact.json missing authority public_aggregate_only"
  FAIL=1
else
  echo "OK    public-impact.json authority"
fi

# AGI title
curl -sS -L -m 25 "${BASE_URL}/" -o /tmp/agi-smoke-home
if ! grep -q 'Autonomously Giving' /tmp/agi-smoke-home; then
  echo "FAIL  AGI home missing expected title/copy"
  FAIL=1
else
  echo "OK    AGI home content"
fi

if [[ "$FAIL" -ne 0 ]]; then
  echo "SMOKE FAILED"
  exit 1
fi
echo "SMOKE PASSED"
