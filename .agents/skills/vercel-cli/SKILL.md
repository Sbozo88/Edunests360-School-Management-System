---
name: vercel-cli
description: The open agent skills tool for Vercel. Install, manage, and create agent skills for AI coding assistants. Deploy and manage projects with Vercel CLI.
source: https://github.com/vercel-labs/skills
---

# Vercel CLI Agent Skills

The open agent skills tool — `npx skills`. Install, manage, and create agent skills for any AI coding agent.

## Install a Skill

```bash
npx skills add vercel-labs/agent-skills
```

### Source Formats

```bash
# GitHub shorthand (owner/repo)
npx skills add vercel-labs/agent-skills

# Full GitHub URL
npx skills add https://github.com/vercel-labs/agent-skills

# Direct path to a skill in a repo
npx skills add https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines

# GitLab URL
npx skills add https://gitlab.com/org/repo

# Any git URL
npx skills add git@github.com:vercel-labs/agent-skills.git

# Local path
npx skills add ./my-local-skills
```

### Options

| Flag | Description |
|------|-------------|
| `-g, --global` | Install globally |
| `-a, --agent <agents...>` | Target specific agents (e.g., `claude-code`, `codex`) |
| `-s, --skill <skills...>` | Select specific skills |
| `-l, --list` | List available skills |
| `-y, --yes` | Non-interactive mode |
| `--all` | Install all skills |

### Examples

```bash
# List skills in a repository
npx skills add vercel-labs/agent-skills --list

# Install specific skills
npx skills add vercel-labs/agent-skills --skill frontend-design --skill skill-creator

# Install to specific agents
npx skills add vercel-labs/agent-skills -a claude-code -a opencode

# Non-interactive installation (CI/CD friendly)
npx skills add vercel-labs/agent-skills --skill frontend-design -g -a claude-code -y

# Install all skills from a repo to all agents
npx skills add vercel-labs/agent-skills --all

# Install all skills to specific agents
npx skills add vercel-labs/agent-skills --skill '*' -a claude-code

# Install specific skills to all agents
npx skills add vercel-labs/agent-skills --agent '*' --skill frontend-design
```

## Other Commands

```bash
# List installed skills
skills list

# Find available skills
skills find

# Check for updates
skills check

# Update skills
skills update

# Initialize skills directory
skills init

# Remove a skill
skills remove
```

## Vercel CLI Reference

### Project Setup

```bash
# Link to existing project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Pull environment variables
vercel env pull
```

### Deployment

```bash
# Deploy preview
vercel deploy

# Deploy production
vercel deploy --prod

# List deployments
vercel ls

# Inspect deployment
vercel inspect <url>

# Remove deployment
vercel rm <deployment-url>
```

### Environment Variables

```bash
# Add environment variable
vercel env add <name>

# Pull env vars to .env.local
vercel env pull

# Remove environment variable
vercel env rm <name>

# List environment variables
vercel env ls
```

### Domains

```bash
# Add domain
vercel domains add <domain>

# List domains
vercel domains ls

# Remove domain
vercel domains rm <domain>

# Inspect domain
vercel domains inspect <domain>
```

### Projects

```bash
# List projects
vercel project ls

# Add project
vercel project add <name>

# Remove project
vercel project rm <name>
```

### Development

```bash
# Start local dev server
vercel dev

# Pull latest env and project settings
vercel pull
```

## Tips
- Use `vercel` (no args) for a quick preview deployment
- Use `vercel --prod` for production deployment
- Use `vercel env pull` to sync environment variables locally
- Use `vercel dev` for local development with Vercel Functions
- Add `vercel.json` for project configuration
