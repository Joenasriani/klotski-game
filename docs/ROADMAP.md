# Locked release roadmap

Confirmed by Joe on 13 November 2026. This file is the authoritative scope and sequence; the AI handoff and README must agree with it.

## Title order and active scope

1. **Klotski – ACTIVE.**
2. Ascension – QUEUED.
3. Paradigm Shift – QUEUED.

Work on one title at a time. Remain on Klotski until its preparation stage is complete. Do not edit, redesign, package, or update documentation for the queued games during this stage. Preliminary read-only discovery is not completion of an audit and is not permission to broaden active work. Change this plan only when Joe explicitly changes the scope.

## Klotski sequence

| Phase | Required result | Current status |
| --- | --- | --- |
| 1. Establish and synchronize the baseline | Compare repository files with the observed live release; preserve current fixes and trace provenance. | Complete on main; rechecked 13 November 2026. |
| 2. Synchronize documentation | Accurate README, one current AI handoff, readiness evidence, and this locked roadmap. | Complete with this documentation update. |
| 3. Audit before packaging | Review mechanics, all levels, touch input, UI, camera, audio, state, performance, dependencies, lifecycle, and release requirements. Separate static, runtime, and device evidence. | Initial audit and full browser verification complete; Android hardware checks remain open. |
| 4. Fix and verify | Address identified blockers while preserving the game's identity, ten layouts, drag math, and existing working fixes. Verify syntax, rendered UI, gameplay, progression, and relevant regressions. | Complete for browser/source: state checks, actual touch, all ten levels, responsive samples, and graphics fallback passed. Device acceptance remains separate. |
| 5. Prepare Android | Bundle required assets, establish the actual application identity, implement Android behavior, and produce a test APK and release AAB. Keep credentials/signing keys out of git. | Complete as preparation: local-asset project, debug test APK, unsigned AAB, and lint build passed. Device/signing acceptance pending. |
| 6. Complete release preparation | Test on Android hardware; prepare accurate store text, icons, screenshots, declarations, and handoff matching the release. | Pending. |
| 7. Update itch.io | Upload the verified release web build and align its listing with demonstrated behavior. | Pending; no upload or listing edit has occurred. |
| 8. Advance in order | Proceed to Ascension, then Paradigm Shift, using the same evidence gates. | Queued until Klotski preparation is complete. |

Android build and hardware checks may iterate as needed; they do not justify skipping verification or moving to another title. itch.io should receive the verified web release; an APK/AAB is a separate Android artifact.

## Protected boundaries

- Audit before turning a game into an Android release.
- Preserve the latest observed live behavior and fixes; do not roll back to an older upload just because its host is itch.io.
- Keep historical baselines distinguishable from the current main branch.
- Make focused fixes. Do not add levels, mechanics, redesigns, ads, analytics, or monetization as part of synchronization.
- Do not claim “working,” “tested,” or “Play Store ready” beyond the evidence actually obtained.
- A logic solver or successful build is not a rendered gameplay/device test.
- Record each meaningful change, verification result, remaining blocker, and next step in the current handoff.
- Existing limitation: cloud Chrome failed WebGL initialization during the live launch. This limits testing here; it does not establish failure on Joe's phone.

## Current next step

Obtain physical Android test results for the built debug APK, then finish Klotski release preparation. Browser verification and Android build checks have passed. Use [PLAYSTORE_READINESS.md](PLAYSTORE_READINESS.md) for ranked findings and [AI_HANDOFF.md](AI_HANDOFF.md) for technical continuity. Do not start Ascension.
