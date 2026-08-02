# Deploying to GitHub Pages with a Custom Domain

This guide walks through deploying an Astro site to GitHub Pages using GitHub Actions, with a custom apex domain and HTTPS. The setup assumes you manage DNS through Cloudflare.

## How the deployment works

The workflow lives in `.github/workflows/deploy.yml`. Every push to `main` triggers it, and you can also run it manually from the Actions tab. The pipeline installs dependencies, runs linting and type checks, builds the static site, and deploys the output to GitHub Pages.

A `CNAME` file in `public/` tells GitHub Pages which custom domain to serve. Astro copies everything in `public/` to the build output as-is, so this file ends up in the root of the deployed site.

## Step 1: Configure GitHub Pages source

Before your first deploy, you need to tell GitHub to expect deployments from Actions rather than from a branch.

1. Go to your repository on GitHub
2. Open **Settings > Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**

That is all you need on the GitHub side. The workflow handles the rest.

## Step 2: Set up DNS records in Cloudflare

You need 8 DNS records total for the apex domain: 4 A records (IPv4) and 4 AAAA records (IPv6). These point your domain to GitHub's content delivery network.

In your Cloudflare dashboard, go to **DNS > Records** and add the following entries. Make sure the proxy toggle is set to **DNS only** (grey cloud) for all of them. GitHub needs to see the actual IPs to provision your SSL certificate.

### A records (IPv4)

| Type | Name | Content | Proxy status |
|------|------|---------|--------------|
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |

### AAAA records (IPv6)

| Type | Name | Content | Proxy status |
|------|------|---------|--------------|
| AAAA | `@` | `2606:50c0:8000::153` | DNS only |
| AAAA | `@` | `2606:50c0:8001::153` | DNS only |
| AAAA | `@` | `2606:50c0:8002::153` | DNS only |
| AAAA | `@` | `2606:50c0:8003::153` | DNS only |

### Optional: www subdomain

If you want `www.<domain>.com` to work as well, add a CNAME record:

| Type | Name | Content | Proxy status |
|------|------|---------|--------------|
| CNAME | `www` | `<domain>.github.io` | DNS only |

### A note on subdomains

If you have other subdomains pointing to different servers (like a homelab), those are independent A records. They will not conflict with the GitHub Pages setup as long as you do not use a wildcard DNS record. GitHub explicitly warns against wildcard records because they create vulnerability to domain takeover attacks.

## Step 3: Push and deploy

Commit your changes and push to `main`. The workflow will trigger automatically.

```bash
git push origin main
```

Watch the **Actions** tab in your repository. The workflow should go green within a couple of minutes. If the checks or build fail, the deployment step will not run.

## Step 4: Enable HTTPS

After DNS propagates and your first deployment completes, GitHub provisions a free SSL certificate through Let's Encrypt. This can take anywhere from a few minutes to 24 hours, depending on how fast your DNS changes spread.

Once the certificate is ready:

1. Go to **Settings > Pages**
2. Check **Enforce HTTPS**

If the checkbox is greyed out, the certificate has not been provisioned yet. Give it some time and refresh.

## Verifying the setup

There are a few things worth checking after everything is in place.

**DNS resolution.** Run `dig maxvandenhoven.com` and confirm the response includes the GitHub A record IPs. If you added AAAA records, `dig AAAA maxvandenhoven.com` should show those as well.

**HTTPS.** Visit `https://maxvandenhoven.com` in your browser and check the lock icon. The certificate should be issued by Let's Encrypt.

**Build output.** Run `make build` locally and inspect the `dist/` folder. The `CNAME` file should be in the root, `sitemap-index.xml` should list all published pages, and `rss.xml` should contain your published blog posts.

**404 page.** Visit a non-existent path like `/does-not-exist`. GitHub Pages will serve your custom `404.html`.

## Troubleshooting

**The Actions workflow fails on `make check`.** This means linting, formatting, or type checking found issues. Run `make check` locally to see the same errors and fix them before pushing.

**DNS is not resolving.** Cloudflare changes usually propagate within minutes, but it can take up to 24 hours globally. Double-check that the proxy toggle is set to DNS only (grey cloud, not orange).

**HTTPS certificate is not provisioning.** GitHub can only verify domain ownership if it can reach the DNS records directly. If Cloudflare's proxy is enabled (orange cloud), GitHub will not be able to provision the certificate. Switch all GitHub Pages records to DNS only.
