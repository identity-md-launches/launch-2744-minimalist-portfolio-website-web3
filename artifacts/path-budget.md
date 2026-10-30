# Submission path budget

The submission limit is **8,388,608 bytes**. These are explicit upper budgets, not claimed file sizes.

| Retained paths | Budget |
| --- | ---: |
| `dist/**` (complete static export, including local font and artwork) | 2,097,152 bytes |
| `public/**` (source assets and font license) | 1,048,576 bytes |
| `src/**`, `scripts/**`, root manifests, lockfile, config and Markdown | 524,288 bytes |
| `artifacts/**` (documentation, selected screenshots, results, notices) | 3,145,728 bytes |
| Reserved headroom | 1,572,864 bytes |
| Total | 8,388,608 bytes |

Every generated path ignored in `.gitignore` has an explicit **0 submitted byte** budget: `**/node_modules/`, `**/.vite/`, `**/.cache/`, `**/.npm/`, `**/*.tsbuildinfo`, `/test/scratch/`, and `/.playwright-mcp/`. Dependency installation and package caches for this run live outside the repository. The production export is explicitly included. No dependencies are vendored and no submodules are added.

Actual final retained sizes are recorded in `validation.md` after cleanup. Pinned inputs and protected repository metadata are not work added by this task.

## Actual final retained bytes

Measured after cleanup on 2026-10-30. Logical file bytes, including source assets and their complete export copies; ignored/generated paths and pinned inputs are excluded.

| Group | Actual bytes |
| --- | ---: |
| `dist/**` | 861,117 |
| `public/**` | 634,867 |
| `artifacts/**` | 670,036 |
| Source, scripts, root configuration and documents | 136,242 |
| **Total (49 files)** | **2,302,262** |
| Limit | 8,388,608 |

Relative HTML and CSS asset references resolve, every public runtime asset has a byte-identical export copy, all four path groups fit their budgets, and no submodule declaration exists. No dependency directories, caches, registry mirrors, archives, or browser scratch output are included in these submitted paths.
