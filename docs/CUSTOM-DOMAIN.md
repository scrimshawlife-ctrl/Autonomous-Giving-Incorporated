# Custom domain: autogive.app

Canonical production origin for the AGI public workbench is **https://autogive.app**.

**Primary host: Vercel** (see [VERCEL.md](VERCEL.md)).  
**Fallback host: GitHub Pages** at the github.io project URL.

Namecheap holds registration; DNS currently points at Namecheap parking / hosting.

## Target end state

| Host | Role |
| --- | --- |
| `https://autogive.app/` | Production on **Vercel** |
| `https://www.autogive.app/` | Redirect to apex (Vercel) |
| `https://scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated/` | Fallback mirror |

Suite path URLs (`/fund-intel/`, `/impact-relay/`) remain **product links** in copy. Those products still ship as separate sites unless a reverse-proxy or monorepo export is added later.

Point the apex at **one** platform only (Vercel **or** GitHub Pages), not both.

---

## Recommended: Vercel DNS

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Add the domain in the Vercel project **Settings → Domains**. Full runbook: [VERCEL.md](VERCEL.md).

---

## Optional: GitHub Pages DNS

Only if production is Pages instead of Vercel.

Repo → **Settings → Pages → Custom domain**: `autogive.app`  
Enforce HTTPS after DNS verifies. Artifact includes `public/CNAME` → `out/CNAME`.

### Apex A records

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

### www

| Type | Host | Value |
| --- | --- | --- |
| CNAME | `www` | `scrimshawlife-ctrl.github.io.` |

---

## Namecheap notes

Nameservers may be hosting DNS (`dns1.namecheaphosting.com` / `dns2.namecheaphosting.com`). Edit records there, or switch to BasicDNS / PremiumDNS first.

Keep **MX** / **TXT** (SPF) if you use email. Remove LiteSpeed / parking A records when switching production.

## Build path

Production builds use **empty** `basePath` so assets resolve at `https://autogive.app/_next/...`.

Legacy project-site path (github.io only):

```bash
GITHUB_PAGES_BASE_PATH=1 npm run build
```

## Verification checklist

1. `dig +short autogive.app A` returns Vercel (`76.76.21.21`) or the four Pages IPs — matching the chosen host.
2. Domain shows **Verified** in Vercel (or Pages) and HTTPS works.
3. `curl -sI https://autogive.app/` → `200` from Vercel/GitHub (not LiteSpeed parking).
4. HTML references `/_next/` assets at the site root.
5. Canonical / Open Graph use `https://autogive.app`.

Propagation often takes minutes; can take up to 24–48 hours.
