# AGENTS.md

## Project-specific context

Fabrizio Cafolla personal website

---

<!-- [harness-coding:START] managed by harness-coding template, do not edit manually -->

This repository was bootstrapped from the [harness-coding](https://github.com/FabrizioCafolla/harness-coding) template.

Template-managed files are kept in sync with upstream via `just harness-coding check` / `just harness-coding update` — `cli.sh` is never vendored locally, it's always fetched fresh from `main`.

Instructions and context for AI agents (Claude Code, GitHub Copilot, etc.) working in this repository.

## How to behave

Before anything else: you do not know everything, and you should not act like you do.

- **Search before you answer.** If a request touches something you are not certain about a tool, a convention, a file, a decision already made look it up first. Read the relevant files. Check the actual state of the project. Do not reconstruct from memory what you can verify directly.
- **Put yourself in doubt.** Before returning an answer, ask yourself: is this actually correct, or does it just sound correct? If you are not sure, say so explicitly and explain what you are uncertain about.
- **Do not agree by default.** If something Fabrizio says is wrong, incomplete, or heading in a bad direction, say so directly. Explain why. Propose something better. Agreement that is not earned is noise.
- **Behave like a professional in a discussion, not a tool executing commands.** Push back, ask follow-up questions, surface implications he may not have considered. The goal is to reach the best outcome, not to validate whatever was said.
- **Ask when the task is unclear.** Many requests will be generic or underspecified. Before producing output, assess whether you have enough context to do it well. If not, ask specifically, not generically. One focused question is better than a wrong answer.

## Tech stack

The development environment is DevContainer-based. The `.devcontainer/Dockerfile` uses a multi-stage build. The first stage (`base`) installs the core runtimes that are **always available**: Python 3.13 (managed by `uv`) and Node.js 24. These are copied from upstream images and always present in the final container. The same stage also installs OS-level tools like `just` (task runner) and system utilities. `pre-commit` is configured at the project level (`.pre-commit-config.yaml`) and always available. GitHub CLI (`gh`) is installed separately as a devcontainer feature defined in `devcontainer.json`.

The second stage (`tools`) is where all **optional tools** live. Each tool is gated behind a build arg (e.g. `AWS_CLI_ENABLE`, `CLAUDE_CLI_ENABLE`, `KIND_ENABLE`, `TERRAFORM_ENABLE`). Terraform is installed via `tfenv`, which allows switching versions inside the container with `tfenv install <version> && tfenv use <version>`. The Dockerfile defines defaults for these args, but **the actual values used in this project are determined by `.devcontainer/docker-compose.project.yml` (project defaults) and `.devcontainer/docker-compose.local.yml` (local overrides)**, which override at build time via Compose merge. To know which tools are actually installed, check these compose files — they are the source of truth, not the Dockerfile defaults.

## Development environment

All work happens inside the DevContainer. Do not assume tools are installed on the host machine. The container builds run `harnessai install` (`postCreateCommand`); every start runs `harnessai sync && just setup` (`postStartCommand`). AWS configuration lives in `.devcontainer/configs/.aws/`, and AI tool caches (Claude, Copilot, OpenCode, LLaMA) are persisted in `.devcontainer/cache/`.

### Three-layer file organization

This project follows a **three-layer model** for configuration:

1. **BASE** (template-managed, auto-updated): `docker-compose.yml`, `setup-devcontainer.sh`, `justfile`, `justfile.tooling` — updated when you run `just harness-coding update`
2. **PROJECT** (versionated, `.project` files): Shared defaults for all team members — `justfile.project`, `setup-devcontainer.project.sh`, `docker-compose.project.yml`, `.env.project`
3. **LOCAL** (dev-specific, `.local` files, gitignored): Personal customizations that are never committed — `justfile.local`, `setup-devcontainer.local.sh`, `docker-compose.local.yml`, `.env`

### Template files and `.project`/`.local` pattern

- **Base template files** (`justfile`, `docker-compose.yml`, etc.) are auto-updated and must not be edited manually
- **`.project` files** (versionated) contain project-wide defaults and are committed to git — all team members share these
- **`.local` files** (gitignored) contain personal/local customizations — never committed, each dev can customize freely

**Examples:**

- `justfile` (base, marker-managed) imports `justfile.project`, `justfile.local`, `justfile.tooling`, `justfile.private`
- `docker-compose.yml` (base) + `docker-compose.project.yml` (project) + `docker-compose.local.yml` (local) merge via Compose
- `.env.project` (versionated, project defaults) + `.env` (gitignored, local overrides) are both loaded at container startup

**Discover available commands with:**

```bash
just help
```

## What agents should avoid

- Do not modify `.devcontainer/` base files (Dockerfile, docker-compose.yml, setup-devcontainer.sh) unless asked — they are auto-updated by the template
- Do not modify `.project` files unless making changes that should be shared with the team — these are versionated
- Do edit `.local` files for personal/local customizations — these are gitignored and won't be committed
- Do not install packages globally inside the container without updating the Dockerfile or devcontainer features
<!-- [harness-coding:END] -->

<!-- [walle:START] -->
## Walle design system (managed block)

This project uses the [Walle](https://github.com/FabrizioCafolla/harness-walle)
design system. The `@walle/` namespaces are **read-only**: they are overwritten on every
`just walle-update`. Customize through the consumer zones only.

- **Consumer zones (never overwritten):** `src/configs/`, `src/styles/global.css`,
  `src/components/`, `src/pages/`, `src/content/`, `astro.config.mjs`, `package.json`,
  `.vscode/`.
- **Config:** edit `src/configs/*.json` (validated by `just validate-configs`). `app.json`
  drives metadata, the optional `astro.ssr` flag, and component variants; `theme.json` holds
  design tokens.
- **Astro config:** `astro.config.mjs` is a thin `defineWalleConfig({})` shell — pass native
  Astro overrides there (scalars override, `integrations` merge additively).
- **Updates:** run `just walle-update`. Only the declared modules' `@walle/` paths are synced;
  this managed block is rewritten in place between its markers.

Do not edit files inside `@walle/` directories, and do not edit the content between the
`[walle:START]` / `[walle:END]` markers by hand — both are regenerated on update.

### Active walle modules

- **website** — Astro site — @walle components, layouts, styles, config and CLI scripts
  - Managed: src/@walle, schemas, scripts/@walle, scripts/@walle/walle.yml
- **ci** — GitHub Actions workflows (test + deploy) under @walle
  - Managed: .github/workflows/actions/@walle
  - Seeded once: .github/workflows/test.yml, .github/workflows/deploy.yml
- **harness-coding** — Harness coding scaffold
  - Seeded once: justfile.project, .husky/pre-commit, .husky/pre-push, .devcontainer/docker-compose.project.yml
- **ai** — AI harness — generated AGENTS.md block and @walle skills
  - Managed: .claude/skills/@walle
- **harness-coding** — Harness coding scaffold
  - Seeded once: justfile.project, .husky/pre-commit, .husky/pre-push, .devcontainer/docker-compose.project.yml

### Working with walle

- Managed `@walle/` zones are regenerated by the CLI.
- Update: `just walle-update`.
- Add: `just walle add <module>`.
- Validate: `just walle-check`.
<!-- [walle:END] -->

<!-- [harness-ai:START] managed by harness-ai, do not edit manually -->

## harness-ai

[harness-ai](https://github.com/FabrizioCafolla/harness-ai) is a devcontainer feature that assembles AI skills, agents, and hooks into the workspace at container startup. It reads content from one or two repositories, injects per-tool frontmatter, and writes output to tool-specific paths.

**Generated files must never be edited directly.** On the next scaffold run (`harnessai sync` on container start, or `harnessai install`) they are fully regenerated — any manual change is lost. To change a skill or agent: edit the source in the content repo, not the output. Hooks are also harness-managed: customize them via the content repo override.

### Token-saving harness

harness-ai can provision three token-saving layers, each acting at a different point:

- **RTK** (`install.rtk`, default on) — a `PreToolUse` hook that transparently rewrites Bash commands (`git status` → `rtk git status`) to compress *tool output* before it enters context. Automatic, no action needed.
- **Caveman** (`caveman` skill, default-on behavior via `behavior.caveman`) — compresses *Claude's own output* into terse responses. When `behavior.caveman: true` and the skill is installed, harness-ai injects a default-mode instruction into AGENTS.md so caveman applies from the first message of every session — no `/caveman` invocation needed. Stop with "stop caveman"; disable the default entirely with `behavior.caveman: false`.
- **Headroom** (`install.headroom`, installed by default) — compresses the *request payload* at the API boundary. Installed but **not a hook and not auto-active**: it is the possible solution for very large contexts / RAG that RTK does not cover. Activate per-session with `headroom wrap <cli>` (e.g. `headroom wrap claude`, `headroom wrap opencode`; it starts a proxy and routes the session through it). While active it overlaps RTK on the input side — prefer one or the other rather than stacking both.

### Memory layer (wikictl)

[wikictl](https://github.com/FabrizioCafolla/harness-ai/tree/main/wikictl) is a file-based AI memory system, gated behind `install.wikictl` (off by default). When enabled, harness-ai installs the `wikictl` CLI, adds its MCP server to the workspace's MCP config (`http://127.0.0.1:9797/mcp/` by default) so agents can read/write entries directly, and scaffolds the `wikictl`, `wikictl-read`, `wikictl-create`, `wikictl-edit`, and `wikictl-mcp` skills that teach the metadata-first workflow (scan entry metadata before loading full bodies). Entries are plain Markdown with YAML frontmatter, stored under `wiki/` in the workspace — persistent knowledge (decisions, research, project context) that survives across sessions, browsable via `wikictl serve`'s web UI or queried straight from the CLI (`wikictl list`, `wikictl search`, `wikictl read <name>`).

### Setup

Structured config — `tools`, install toggles, the content repo — lives in the workspace's `.harness-ai/config.yaml`, the single source of truth. The devcontainer feature ships with no options at all.

**Devcontainer** (`devcontainer.json`):

```json
{
  "features": {
    "ghcr.io/fabriziocafolla/harness-ai/harness-ai:0": {}
  }
}
```

`.harness-ai/config.yaml`:

```yaml
tools: [claude]
install:
  openspec: true
behavior:
  caveman: true
contentRepo:
  url: https://github.com/your-org/your-private-skills-repo
  ref: main
```

**CLI** (`cli.sh`) — for use outside a devcontainer:

```bash
GITHUB_TOKEN=$(gh auth token) bash cli.sh install \
  --workspace /path/to/project \
  --tools claude \
  --content-repo https://github.com/your-org/your-private-skills-repo
```

### Assembly model

At runtime `harness.py` merges two sources — private repo wins on key conflicts:

1. **harness-ai** (public) — bundled `content/skills/`, `content/agents/`, `config/`
2. **Content repo** (private, optional) — skills, agents, and optional hooks/mcp overrides

**Two deployment modes:**

- **copy-once** — file created on first run, skipped if it already exists (preserves user edits): `settings.json`, `settings.local.json`, `opencode.json`, `.mcp.json`
- **always-managed** — file overwritten on every scaffold run: skills, agents, `AGENTS.md`, `.gitignore`, hooks (`config/claude/hooks.json` → `.claude/settings.json["hooks"]`, `config/opencode/rtk-plugin.ts` → `.opencode/plugins/rtk.ts`)

### What gets deployed

| Output path                      | Source                          | Mode           |
| -------------------------------- | -------------------------------- | -------------- |
| `.mcp.json`                      | `config/mcp.json`               | copy-once      |
| `.claude/settings.json["hooks"]` | `config/claude/hooks.json`      | always-managed |
| `.claude/settings.json`          | `config/claude/settings.json`   | copy-once      |
| `.opencode/plugins/rtk.ts`       | `config/opencode/rtk-plugin.ts` | always-managed |
| `opencode.json`                  | `config/opencode.json`          | copy-once      |

### Private content repositories

| Repository                                                                    | Purpose                                                                                                     |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [scaffold-ai-private](https://github.com/FabrizioCafolla/scaffold-ai-private) | Personal `advisor-*` skills and agents for Fabrizio Cafolla — voice, decision patterns, communication style |

The private repo can also override config templates by placing files at:

| Private repo path    | Overrides                       |
| --------------------- | -------------------------------- |
| `mcp.json`           | `config/mcp.json`               |
| `hooks/claude.json`  | `config/claude/hooks.json`      |
| `hooks/opencode.ts`  | `config/opencode/rtk-plugin.ts` |

### Skill taxonomy

Skills are organized by category and subcategory. Every entry in `metadata.yml` carries `category` and `subcategory` fields.

| Category        | Subcategory                    | Typical prefix                   |
| --------------- | ------------------------------ | -------------------------------- |
| `engineering`   | `architecture-and-platform`    | `developer-*`, `advisor-*`       |
| `engineering`   | `build-and-quality`            | `developer-*`                    |
| `engineering`   | `technical-documentation`      | `advisor-*`                      |
| `engineering`   | `operations-and-reliability`   | `advisor-*`                      |
| `communication` | `professional-communication`   | `advisor-*`                      |
| `communication` | `editorial-and-content`        | `advisor-*`                      |
| `communication` | `presence-and-ux-writing`      | `advisor-*`                      |
| `reasoning`     | `ideation-and-problem-framing` | `advisor-*`                      |
| `reasoning`     | `research-and-study`           | `advisor-*`                      |
| `reasoning`     | `teaching-and-speaking`        | `advisor-*`                      |
| `delivery`      | `review-and-improvement`       | `advisor-*`                      |
| `meta`          | `skills-and-agents`            | `skill-creator`, `agent-creator` |

### Installed skills

- `agent-creator`
- `skill-creator`
- `developer-diagnosing-bugs`
- `developer-docker`
- `developer-framework-astro`
- `developer-github-actions`
- `developer-go`
- `developer-javascript`
- `developer-kubernetes`
- `developer-microservices-and-api`
- `developer-python`
- `developer-shell`
- `developer-tdd`
- `developer-terraform`
- `developer-typescript`
- `caveman`
- `developer-github-cli`
- `wikictl`
- `wikictl-read`
- `wikictl-create`
- `wikictl-edit`
- `wikictl-mcp`

### Installed agents

- `developer`

<!-- [harness-ai:END] -->
