---
name: IDE Agent Skills
description: Secure, validated skill registry for AI coding agents. Extend Antigravity, Claude Code, Cursor, GitHub Copilot, and more with reusable, packaged instructions.
source: https://github.com/tech-leads-club/agent-skills
---

# 🧠 IDE Agent Skills

The secure, validated skill registry for professional AI coding agents. Extend Antigravity, Claude Code, Cursor, and more with absolute confidence.

**Registry**: [https://tech-leads-club.github.io/agent-skills/](https://tech-leads-club.github.io/agent-skills/)

## Quick Start

### Install Skills in Your Project

```bash
npx @tech-leads-club/agent-skills
```

This launches an interactive wizard:
1. **Choose Action** — "Install skills" or "Update installed skills"
2. **Browse & Select** — Filter by category or search
3. **Choose agents** — Pick target agents (Cursor, Claude Code, etc.)
4. **Installation method** — Copy (recommended) or Symlink
5. **Scope** — Global (user home) or Local (project only)

### CLI Options

```bash
# Interactive mode (default)
npx @tech-leads-club/agent-skills

# List available skills
agent-skills list
agent-skills ls  # Alias

# Install one skill
agent-skills install -s tlc-spec-driven

# Install multiple skills at once
agent-skills install -s aws-advisor coding-guidelines docs-writer

# Install to specific agents
agent-skills install -s my-skill -a cursor claude-code

# Install multiple skills to multiple agents
agent-skills install -s aws-advisor nx-workspace -a cursor windsurf cline

# Install globally (to ~/.gemini, ~/.claude, etc.)
agent-skills install -s my-skill -g

# Use symlink instead of copy
agent-skills install -s my-skill --symlink

# Force re-download (bypass cache)
agent-skills install -s my-skill --force

# Update a specific skill
agent-skills update -s my-skill

# Update all installed skills
agent-skills update

# Remove one skill
agent-skills remove -s my-skill

# Remove multiple skills at once
agent-skills remove -s skill1 skill2 skill3
agent-skills rm -s my-skill  # Alias

# Remove from specific agents
agent-skills remove -s my-skill -a cursor windsurf

# Force removal (bypass lockfile check)
agent-skills remove -s my-skill --force

# Manage cache
agent-skills cache --clear           # Clear all cache
agent-skills cache --clear-registry  # Clear only registry
agent-skills cache --path            # Show cache location

# View audit log
agent-skills audit          # Show recent operations
agent-skills audit -n 20    # Show last 20 entries
agent-skills audit --path   # Show audit log location

# Show contributors and credits
agent-skills credits

# Show help
agent-skills --help
```

### Global Installation (Optional)

```bash
npm install -g @tech-leads-club/agent-skills
agent-skills  # Use 'agent-skills' instead of 'npx @tech-leads-club/agent-skills'
```

## Supported Agents
- Antigravity (Gemini)
- Claude Code
- Cursor
- GitHub Copilot
- Windsurf
- Cline
- And more...

## Security & Trust
- All skills are validated and security-scanned before inclusion
- Over 13% of marketplace skills elsewhere contain critical vulnerabilities — this registry provides hardened, verified capabilities
