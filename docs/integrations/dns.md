# DNS / hosting

- `gadaglobalrun.com` on Cloudflare; **Vercel records must be grey-cloud
  (DNS only)** — proxying them breaks Vercel.
- Site canonical: `https://www.gadaglobalrun.com`. Email: apex only.
- `gadaglobal.com` belongs to a third party — never use it. The flyer's
  `gadaaglobal5k.org` (double "a") is not ours either (ADR-0006).
- **If deploys go stale:** check Vercel Settings → Git shows the connected
  repo and Production Branch is `master` (this repo has no `main`) — the
  2026-08-01 outage was the project silently having no Git connection at
  all; the tell is PRs with no Vercel check. Use "Promote to Production"
  on a current deployment, not "Redeploy" on a stale row (Redeploy
  rebuilds that row's own commit).
