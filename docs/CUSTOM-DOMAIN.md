# Custom domain: autogive.app

Canonical production origin for the AGI public workbench is **https://autogive.app**.

GitHub Pages hosts the static export. Namecheap currently holds the domain registration (and was pointing at Namecheap parking / hosting nameservers).

## Target end state

| Host | Role |
| --- | --- |
| `https://autogive.app/` | Production AGI workbench (this repo) |
| `https://www.autogive.app/` | Optional → apex (via CNAME + Pages) |
| `https://scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated/` | Fallback; Pages redirects to custom domain once DNS verifies |

Suite path URLs (`/fund-intel/`, `/impact-relay/`) remain **product links** in copy. Those products still ship as separate GitHub Pages project sites unless a reverse-proxy or monorepo export is added later.

## GitHub Pages settings

Repo → **Settings → Pages → Custom domain**: `autogive.app`  
Enforce HTTPS after DNS verifies.

The deploy artifact includes `public/CNAME` → `out/CNAME` with:

```text
autogive.app
```

## DNS at Namecheap

Nameservers are currently Namecheap **hosting** DNS (`dns1.namecheaphosting.com` / `dns2.namecheaphosting.com`). Either edit DNS in that hosting panel, **or** switch the domain to Namecheap **BasicDNS** / PremiumDNS and manage records there.

### Apex (`autogive.app`)

Create **A** records (remove parking / hosting A records that point at LiteSpeed):

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | Automatic |
| A | `@` | `185.199.109.153` | Automatic |
| A | `@` | `185.199.110.153` | Automatic |
| A | `@` | `185.199.111.153` | Automatic |

Optional IPv6 (**AAAA**):

| Type | Host | Value |
| --- | --- | --- |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

### www

| Type | Host | Value |
| --- | --- | --- |
| CNAME | `www` | `scrimshawlife-ctrl.github.io.` |

### Email (if you use Namecheap email / cPanel mail)

Keep existing **MX** / **TXT** (SPF) records. Do not delete mail-related records when replacing the apex A records.

## Build path

Production builds use **empty** `basePath` so assets resolve at `https://autogive.app/_next/...`.

Legacy project-site path (only if needed):

```bash
GITHUB_PAGES_BASE_PATH=1 npm run build
```

## Verification checklist

1. DNS: `dig +short autogive.app A` returns the four GitHub Pages IPs (or a subset after propagation).
2. Repo Pages settings show custom domain **Verified** / HTTPS **Enabled**.
3. `curl -sI https://autogive.app/` → `200` from `GitHub.com` (not LiteSpeed parking).
4. HTML source references `/_next/` assets, not `/Autonomous-Giving-Incorporated/_next/`.
5. Open Graph / canonical in page source use `https://autogive.app`.

Propagation often takes minutes; can take up to 24–48 hours.
