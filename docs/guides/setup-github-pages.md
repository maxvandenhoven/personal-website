# Setting up GitHub Pages with a custom domain

This guide covers the one-time setup of GitHub Pages for this repository, with `maxvandenhoven.com` as the apex domain and Cloudflare as the DNS provider. Follow it when you move the site to a new repository or domain, or when something about the existing setup breaks. For the everyday release flow, see [`deployment.md`](deployment.md).

## How the pieces connect

The workflow in `.github/workflows/deploy.yml` builds the site and publishes the `dist/` folder to GitHub Pages. GitHub serves it at `<user>.github.io/<repository>` by default. To serve it at your own domain, three things must agree.

- The **Pages source** in the repository settings is **GitHub Actions**.
- The **custom domain** in the same settings is set to the domain.
- The **DNS records** at the domain provider point that domain at GitHub.

The repository also contains `public/CNAME` with the domain name. GitHub ignores a `CNAME` file when Pages is published from a custom workflow, and the domain comes from the repository settings instead. The file is kept so that the setup also works if the site is ever published from a branch.

## Step 1. Set the publishing source

1. Open the repository on GitHub and go to **Settings > Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

## Step 2. Create the DNS records

In the Cloudflare dashboard, open **DNS > Records** and add the records below. Set every one of them to **DNS only** (grey cloud). GitHub needs to reach the real addresses to verify the domain and issue a certificate, and it cannot do that through Cloudflare's proxy.

The apex domain needs four A records for IPv4.

| Type | Name | Content           | Proxy status |
| ---- | ---- | ----------------- | ------------ |
| A    | `@`  | `185.199.108.153` | DNS only     |
| A    | `@`  | `185.199.109.153` | DNS only     |
| A    | `@`  | `185.199.110.153` | DNS only     |
| A    | `@`  | `185.199.111.153` | DNS only     |

It also needs four AAAA records for IPv6.

| Type | Name | Content               | Proxy status |
| ---- | ---- | --------------------- | ------------ |
| AAAA | `@`  | `2606:50c0:8000::153` | DNS only     |
| AAAA | `@`  | `2606:50c0:8001::153` | DNS only     |
| AAAA | `@`  | `2606:50c0:8002::153` | DNS only     |
| AAAA | `@`  | `2606:50c0:8003::153` | DNS only     |

These addresses come from GitHub's documentation and can change, so compare them with the current list in [GitHub's guide to custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) when you set up a new domain.

To make `www.maxvandenhoven.com` work as well, add a CNAME record that points at the user's GitHub Pages domain, without the repository name.

| Type  | Name  | Content            | Proxy status |
| ----- | ----- | ------------------ | ------------ |
| CNAME | `www` | `<user>.github.io` | DNS only     |

### Keep the apex clean

The apex domain must only carry the eight GitHub records. Any other A or AAAA record on `@`, such as a leftover from a previous host, can stop GitHub from issuing the certificate. Move anything else that used the apex to a subdomain before adding the GitHub records.

### Subdomains

Subdomains that point to other servers, such as homelab services, are independent DNS entries and do not conflict with Pages. Do not create a wildcard record (`*.maxvandenhoven.com`). GitHub warns against them because they make domain takeover easier.

## Step 3. Set the custom domain

1. Go to **Settings > Pages**.
2. Under **Custom domain**, enter `maxvandenhoven.com` and save. GitHub runs a DNS check, which can fail until the records from step 2 have propagated.

## Step 4. Deploy

Merge a change into `main` or start the **Deploy to GitHub Pages** workflow manually from the **Actions** tab. The run should turn green within a few minutes. If the checks or the build fail, the workflow stops before publishing.

## Step 5. Enforce HTTPS

After the DNS check passes and the first deployment completes, GitHub requests a free certificate from Let's Encrypt. This takes anywhere from a few minutes to a day. When it is ready, go to **Settings > Pages** and select **Enforce HTTPS**. While the checkbox is grayed out, the certificate has not been issued yet, so wait and refresh.

## Verifying the setup

- **DNS.** Run `dig maxvandenhoven.com` and confirm that the answer lists the four GitHub addresses. Run `dig AAAA maxvandenhoven.com` for the IPv6 records.
- **HTTPS.** Open `https://maxvandenhoven.com`, check the lock icon and confirm that the certificate was issued by Let's Encrypt.
- **404 page.** Visit a path that does not exist. GitHub Pages serves the site's own 404 page.
- **Build output.** `make build` writes `dist/`, which should contain `sitemap-index.xml`, `rss.xml` and the `CNAME` file.

## Troubleshooting

| Symptom                                              | Likely cause and fix                                                                                                                    |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| The domain does not resolve                          | Records usually propagate within minutes but can take up to a day. Check that every record is **DNS only**                              |
| The DNS check in **Settings > Pages** fails          | A record is missing or an extra A or AAAA record exists on the apex. Compare the zone with the tables above                             |
| **Enforce HTTPS** stays grayed out                   | The certificate is not issued yet. This also happens when the Cloudflare proxy (orange cloud) is on. Switch the records to **DNS only** |
| The site loads at the default URL but not the domain | The custom domain is missing in **Settings > Pages**. A `CNAME` file alone does not set it                                              |
| The workflow fails on `make ci`                      | Lint, formatting or type checks found problems. Run `make check` locally and commit the result                                          |
