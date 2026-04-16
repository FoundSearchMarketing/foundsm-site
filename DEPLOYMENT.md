# Deployment Guide

This project uses a **branch-based deployment pipeline** with GitHub Actions and Vercel, backed by two Sanity datasets.

## Branching & Environments

| Branch    | Environment | Sanity dataset | Deploy trigger                  | Approval required? |
| --------- | ----------- | -------------- | ------------------------------- | ------------------ |
| `develop` | Staging     | `staging`      | Automatic on push               | No                 |
| `main`    | Production  | `production`   | Automatic on push, gated by env | Yes (manual)       |

```
 Local code
     │
     ├──▶ feature branch ──▶ PR to develop ──▶ Build Check ──▶ merge ──▶ Staging deploy
     │
     └───────────────────────▶ PR to main ──▶ Build Check ──▶ merge ──▶ Production deploy (awaits approval)
```

## Workflows

- **`build.yml`** — runs `npm run build` on every PR to `main` or `develop`. Protects both branches from broken builds.
- **`deploy-staging.yml`** — pushes to `develop` automatically build and deploy to the Vercel preview environment with `SANITY_DATASET=staging`.
- **`deploy-production.yml`** — pushes to `main` run the production build, but the deploy job waits on the `production` GitHub Environment approval before shipping.
- **`sanity-webhook.yml`** — `repository_dispatch` entrypoint for Sanity. Rebuilds staging or production based on the `dataset` field in the payload.

## How to Deploy

### Staging
1. Open a PR from your feature branch into `develop`.
2. Wait for the Build Check to go green.
3. Merge. The `deploy-staging.yml` workflow runs automatically and posts the preview URL to the job summary.

### Production
1. Open a PR from `develop` (or a hotfix branch) into `main`.
2. Wait for the Build Check to go green.
3. Merge.
4. Go to **Actions → Deploy to Production** — the run will be paused on "Waiting for review".
5. Click **Review deployments**, approve it. The deploy continues.

### Emergency rollback
Two options, in order of preference:

1. **Vercel rollback (fastest):** Open the Vercel dashboard → Deployments → pick the last known good deployment → **Promote to Production**. No code changes, no rebuild.
2. **Revert commit:** `git revert <bad-sha>` on `main`, push, approve the production deploy again.

## Required GitHub Configuration

### Secrets (Settings → Secrets and variables → Actions → Secrets)
| Name                 | Value                                                  |
| -------------------- | ------------------------------------------------------ |
| `VERCEL_TOKEN`       | Personal token from Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID`      | From `.vercel/project.json` after `vercel link`        |
| `VERCEL_PROJECT_ID`  | From `.vercel/project.json` after `vercel link`        |

### Variables (Settings → Secrets and variables → Actions → Variables)
| Name                | Value       |
| ------------------- | ----------- |
| `SANITY_PROJECT_ID` | `vzneqxsx`  |

Dataset names (`staging`, `production`) are hard-coded in the workflow files, not in variables, so they can't drift.

### Environments (Settings → Environments)
Create two environments:

- **`staging`** — no protection rules needed.
- **`production`** — add **Required reviewers** (yourself + anyone authorized to ship). This is what makes production deploys manual.

### Branch protection (Settings → Branches)
- **`main`**: require PR, require `build` check to pass, require 1 approval, dismiss stale approvals.
- **`develop`**: require `build` check to pass.

## Required Vercel Configuration

1. **Link the project**: from the repo root, run `vercel link` and follow the prompts. This creates `.vercel/project.json` locally — grab `orgId` and `projectId` from it for the GitHub secrets. Do not commit this file (it's already gitignored by Vercel CLI conventions; verify).
2. **Environment variables** (Vercel → Project → Settings → Environment Variables). Set per environment:

   | Variable            | Production         | Preview            |
   | ------------------- | ------------------ | ------------------ |
   | `SANITY_PROJECT_ID` | `vzneqxsx`         | `vzneqxsx`         |
   | `SANITY_DATASET`    | `production`       | `staging`          |

   Note: the GitHub workflows also set these at build time, so this is a belt-and-suspenders safety net for any deploys triggered directly from Vercel.

3. **Generate a token** for CI: Vercel → Account Settings → Tokens → Create. Scope it to the team/project. Save as `VERCEL_TOKEN` in GitHub.

## Required Sanity Configuration

### Datasets
You need two datasets in the Sanity project (`vzneqxsx`):

- `production` — live content. Already exists.
- `staging` — for content review. Create via Sanity Studio → Manage → Datasets → **Add dataset** → name it `staging`. Choose "public" or "private" per your preference (matches production).

### Webhook (one per dataset)
Sanity → Manage → API → Webhooks → **Create webhook** — do this **twice**, once per dataset:

| Field             | Staging webhook                                                                       | Production webhook                        |
| ----------------- | ------------------------------------------------------------------------------------- | ----------------------------------------- |
| Name              | `Rebuild staging site`                                                                | `Rebuild production site`                 |
| Dataset           | `staging`                                                                             | `production`                              |
| URL               | `https://api.github.com/repos/<OWNER>/<REPO>/dispatches`                              | same                                      |
| HTTP method       | POST                                                                                  | POST                                      |
| Trigger on        | Create, Update, Delete                                                                | Create, Update, Delete                    |
| HTTP Headers      | `Authorization: Bearer <GH_TOKEN>` and `Accept: application/vnd.github.v3+json`       | same                                      |
| Projection (body) | `{ "event_type": "sanity-content-update", "client_payload": { "dataset": "staging" } }` | same but `"dataset": "production"`      |

`<GH_TOKEN>` is a GitHub personal access token (classic) with `repo` scope, or a fine-grained token with Actions: Write on this repo. Store it **only** inside the Sanity webhook config; do not commit it.

## Local Development

Copy `.env.example` to `.env` and tweak as needed:

```bash
cp .env.example .env
# Edit .env to set SANITY_DATASET=staging if you want to preview staging content
npm run dev
```

Both `astro.config.mjs` and `src/lib/sanity.ts` fall back to `vzneqxsx` / `production` when env vars are unset, so the app runs without a `.env` file.

## Troubleshooting

- **Staging deploy succeeded but shows production content** — check that Vercel Preview env vars have `SANITY_DATASET=staging`, and that the staging workflow set it at build time (look at the job logs under the "Build (preview)" step).
- **Production deploy hangs** — it's waiting on approval in the `production` GitHub Environment. Go to Actions → the run → click **Review deployments**.
- **Webhook didn't fire a rebuild** — check Sanity → Webhooks → delivery log for a 2xx response. Non-2xx usually means the GitHub token expired or the `event_type` doesn't match `sanity-content-update`.
- **Vercel CLI in CI can't find the project** — `VERCEL_ORG_ID` or `VERCEL_PROJECT_ID` secrets are missing/wrong. Regenerate them by running `vercel link` locally and reading `.vercel/project.json`.
