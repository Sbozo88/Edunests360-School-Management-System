---
name: netlify
description: "Deploy web projects to Netlify and manage sites, DNS records, environment variables, and webhooks. Supports both CLI deployments and API management."
emoji: "🌊"
source:
  - https://github.com/openai/skills/blob/main/skills/.curated/netlify-deploy/SKILL.md
  - https://github.com/JoshuaRileyDev/netlify-skill
  - https://github.com/netlify
metadata:
  requires:
    bins: ["curl", "jq"]
  env: ["NETLIFY_AUTH_TOKEN"]
---

# Netlify Deployment & Management Skill

Deploy web projects to Netlify using the Netlify CLI with intelligent detection of project configuration and deployment context.

## Overview

This skill automates Netlify deployments by:
- Verifying Netlify CLI authentication
- Detecting project configuration and framework
- Linking to existing sites or creating new ones
- Deploying to production or preview environments

## Prerequisites

- **Netlify CLI**: Installed via npx (no global install required)
- **Authentication**: Netlify account with active login session
- **Project**: Valid web project in current directory
- **Personal Access Token** — Generate from https://app.netlify.com/user/applications/personal

## Authentication

### Browser-based OAuth (primary)

```bash
npx netlify login
```

### API Key (alternative)

```bash
export NETLIFY_AUTH_TOKEN="your-personal-access-token"
```

### Check Status

```bash
npx netlify status
```

## Deployment Workflow

### 1. Verify Authentication

```bash
npx netlify status
```

### 2. Link Site

```bash
# Try Git-based linking first
git remote show origin
npx netlify link --git-remote-url <REMOTE_URL>

# If no site exists, create one
npx netlify init
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Deploy Preview

```bash
npx netlify deploy
```

### 5. Deploy to Production

```bash
npx netlify deploy --prod
```

### Handling netlify.toml

If a `netlify.toml` file exists, the CLI uses it automatically. Common framework defaults:

| Framework | Build Command | Publish Directory |
|-----------|---------------|-------------------|
| Next.js | `npm run build` | `.next` |
| React (Vite) | `npm run build` | `dist` |
| Static HTML | (none) | current directory |

---

## Sites & Deployments

### List all sites

```bash
netlify site list
```

### Get site details

```bash
netlify site get <site-id>
```

### Deploy a site

```bash
netlify deploy create --dir <path> --site <site-id>
```

### List deployments

```bash
netlify deploy list --site <site-id>
```

### Rollback deployment

```bash
netlify deploy rollback --site <site-id> --deployment <id>
```

## DNS Records Management

### List DNS records

```bash
netlify dns list --site <site-id>
```

### Add a DNS record

```bash
netlify dns create \
  --site <site-id> \
  --hostname <subdomain> \
  --type A \
  --value <ip-address>
```

**Supported types:** `A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS`, `SRV`

### Update a DNS record

```bash
netlify dns update \
  --site <site-id> \
  --record <record-id> \
  --value <new-value>
```

### Delete a DNS record

```bash
netlify dns delete --site <site-id> --record <record-id>
```

## Environment Variables

### List

```bash
netlify env list --site <site-id>
```

### Set

```bash
netlify env set \
  --site <site-id> \
  --key <name> \
  --value <value> \
  [--scope builds|runtime|functions|post-processing]
```

### Delete

```bash
netlify env delete --site <site-id> --key <name>
```

**Scopes:** `builds`, `runtime`, `functions`, `post-processing`

## Configuration Files

```bash
# List files
netlify file list --site <site-id>

# Get file content
netlify file get --site <site-id> --path <file-path>

# Update file
netlify file update --site <site-id> --path <file-path> --content <content>

# Delete file
netlify file delete --site <site-id> --path <file-path>
```

## Forms & Submissions

```bash
# List forms
netlify form list --site <site-id>

# List form submissions
netlify form submissions --site <site-id> --form <form-id>
```

## Webhooks

```bash
# List webhooks
netlify hook list --site <site-id>

# Create a webhook
netlify hook create \
  --site <site-id> \
  --type deploy_success \
  --url https://your-webhook-url.com

# Delete a webhook
netlify hook delete --site <site-id> --hook <hook-id>
```

**Event types:** `deploy_created`, `deploy_failed`, `deploy_unlocked`, `split_test_failed`, `site_changed`, `ssl_updated`

## Utility Commands

```bash
# Check API connection
netlify status

# View current config
netlify config show

# Get account information
netlify account
```

## API Reference

Base URL: `https://api.netlify.com/api/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sites` | GET | List all sites |
| `/sites/{site_id}` | GET | Get site details |
| `/sites/{site_id}/deploys` | GET/POST | List/Create deployments |
| `/sites/{site_id}/dns` | GET | List DNS records |
| `/sites/{site_id}/env` | GET/POST/DELETE | Manage env vars |
| `/sites/{site_id}/files` | GET | List files |
| `/sites/{site_id}/forms` | GET | List forms |
| `/sites/{site_id}/hooks` | GET/POST | Manage webhooks |

## Error Handling

| Error | Solution |
|-------|----------|
| "Not logged in" | Run `npx netlify login` |
| "No site linked" | Run `npx netlify link` or `npx netlify init` |
| "Build failed" | Check build command and publish directory |
| "Publish directory not found" | Verify build ran successfully |

## Tips
- Use `netlify deploy` (no `--prod`) first to test before production
- Run `netlify open` to view site in Netlify dashboard
- Run `netlify logs` to view function logs
- Use `netlify dev` for local development with Netlify Functions
- All API requests require `Authorization: Bearer <token>` header

## Reference
- Netlify CLI Docs: https://docs.netlify.com/cli/get-started/
- netlify.toml Reference: https://docs.netlify.com/configure-builds/file-based-configuration/
