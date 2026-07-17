# Contributing

[简体中文](./CONTRIBUTING.zh-CN.md)

Contributions are welcome when they keep the studio bilingual, dependency-light, and honest about which pets are actually installable.

## Before starting

1. Read [ASSET_POLICY.md](./ASSET_POLICY.md).
2. Read the [atlas format guide](./docs/FORMAT.md).
3. Open an issue before a large UI redesign or format change.

## Adding a bundled pet

Create `pets/<pet-id>/` with:

```text
pet.json
preview.gif
spritesheet.webp
```

Public bundled pets must be validated v2 atlases: `1536×2288`, 8×11 cells, 57 standard animation frames, 16 look directions, transparent unused cells, and no visible chroma fringe. The ID in `pet.json` must match the directory name.

Also update the English and Simplified Chinese UI/README text, document provenance in the pull request, and include contact-sheet or animation QA evidence.

## Required checks

```powershell
npm test
npm run check
.\scripts\install-pet.ps1 -PetId <pet-id> -CodexHome ".\workbench\install-smoke" -Force
```

Review every animation loop visually. Automated shape validation does not prove identity consistency, correct motion, or direction semantics.

## Pull requests

Keep each pull request focused. Explain what changed, why it changed, user impact, validation evidence, and any remaining visual risk. Do not include generated workbench files, temporary prompts, or unlicensed references.
