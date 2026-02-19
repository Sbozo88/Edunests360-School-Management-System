---
name: stitch-skills
description: Agent Skills for the Stitch MCP server. Generate UI screens, build websites iteratively, convert screens to React components, and enhance prompts for better generation results.
source: https://github.com/google-labs-code/stitch-skills
allowed-tools:
  - "stitch*:*"
  - "chrome*:*"
  - "Read"
  - "Write"
  - "Bash"
---

# Stitch Agent Skills

A library of Agent Skills designed to work with the Stitch MCP server. Each skill follows the Agent Skills open standard, for compatibility with coding agents such as Antigravity, Gemini CLI, Claude Code, Cursor.

## Installation

```bash
npx skills add google-labs-code/stitch-skills
```

## Available Skills

### design-md
Analyzes Stitch projects and generates comprehensive DESIGN.md files documenting design systems in natural, semantic language optimized for Stitch screen generation.

```bash
npx skills add google-labs-code/stitch-skills --skill design-md --global
```

### react-components
Converts Stitch screens to React component systems with automated validation and design token consistency.

```bash
npx skills add google-labs-code/stitch-skills --skill react-components --global
```

### stitch-loop
Generates a complete multi-page website from a single prompt using Stitch, with automated file organization and validation.

```bash
npx skills add google-labs-code/stitch-skills --skill stitch-loop --global
```

### enhance-prompt
Transforms vague UI ideas into polished, Stitch-optimized prompts. Enhances specificity, adds UI/UX keywords, injects design system context, and structures output for better generation results.

```bash
npx skills add google-labs-code/stitch-skills --skill enhance-prompt --global
```

### remotion
Generates walkthrough videos from Stitch projects using Remotion with smooth transitions, zooming, and text overlays to showcase app screens professionally.

```bash
npx skills add google-labs-code/stitch-skills --skill remotion --global
```

### shadcn-ui
Expert guidance for integrating and building applications with shadcn/ui components. Helps discover, install, customize, and optimize shadcn/ui components with best practices for React applications.

```bash
npx skills add google-labs-code/stitch-skills --skill shadcn-ui --global
```

---

## Stitch Build Loop Pattern

The Build Loop enables continuous, autonomous website development through a "baton" system. Each iteration:

1. Reads the current task from a baton file (`next-prompt.md`)
2. Generates a page using Stitch MCP tools
3. Integrates the page into the site structure
4. Writes the next task to the baton file for the next iteration

### The Baton System

The `next-prompt.md` file acts as a relay baton between iterations:

```markdown
---
page: about
---
A page describing the feature.

**DESIGN SYSTEM (REQUIRED):**
[Copy from DESIGN.md Section 6]

**Page Structure:**
1. Header with navigation
2. Main content area
3. Footer with links
```

### Execution Protocol

1. **Read the Baton** — Parse `next-prompt.md` for page name and prompt
2. **Consult Context Files** — Read `SITE.md` and `DESIGN.md`
3. **Generate with Stitch** — Use Stitch MCP tools to generate the page
4. **Integrate into Site** — Move HTML to `site/public/`, fix paths, update navigation
5. **Visual Verification** (Optional) — If Chrome DevTools MCP is available, verify rendered page
6. **Update Site Documentation** — Update `SITE.md` sitemap
7. **Prepare the Next Baton** — Write the next task to `next-prompt.md`

### File Structure

```
project/
├── next-prompt.md      # The baton — current task
├── stitch.json         # Stitch project ID
├── DESIGN.md           # Visual design system
├── SITE.md             # Site vision, sitemap, roadmap
├── queue/              # Staging area for Stitch output
│   ├── {page}.html
│   └── {page}.png
└── site/public/        # Production pages
    ├── index.html
    └── {page}.html
```

### Common Pitfalls
- ❌ Forgetting to update `next-prompt.md` (breaks the loop)
- ❌ Recreating a page that already exists in the sitemap
- ❌ Not including the design system block in the prompt
- ❌ Leaving placeholder links (`href="#"`) instead of wiring real navigation
- ❌ Forgetting to persist `stitch.json` after creating a new project
