# Klotski – current AI handoff

Updated 13 November 2026. This is the single current technical handoff. Follow [ROADMAP.md](ROADMAP.md).

## Active scope and current state

**Klotski only.** Finish its preparation and acceptance before Ascension, then Paradigm Shift. Neither queued repository was modified. Do not broaden this work into new levels, redesigns, ads, analytics, or monetization.

- Live-source synchronization and initial audit are complete on main.
- Focused readiness fixes and Android preparation are included in this snapshot; PR #2 tracks the implementation.
- The web runtime passed the full Chromium suite, including actual touch input and all ten levels by mouse. Android hardware acceptance is still pending.
- Android preparation build and lint passed at commit `83bc4d93149c7d60816cefdbe9ee89eefbb9dc4f`: https://github.com/Joenasriani/klotski-game/actions/runs/43412776822 . A debug test APK and unsigned AAB were produced. Production signing, physical-device acceptance, Play submission, and itch.io update remain pending.

## Source provenance

- Original GitHub baseline: `fd25d4c493bf2c472af426573658b63308778f8f`.
- Published page: https://joenasr.itch.io/klotski
- Observed upload: https://html-classic.itch.zone/html/17576696/index.html?v=1782729178
- Live response retrieved and rechecked 13 November: 42,325 bytes, SHA-256 `272e7bf48cf18e2f526cbd618ab535d0b704ff78e04a4e0805fced1de0b846fc`.
- Reconciliation commit: `960dcf646f7cd4d9bba1e51b5af991797acd6276`. Only itch.io's injected hosting script and one line's trailing whitespace were excluded from that baseline.
- Locked roadmap/documentation commit: `656ff3775fa818a2e2eb4e17cab602df5a103e06`.
- Readiness-fix `index.html` SHA-256: `1b3ac7f52dbe9c6820fecfd1275eee259ba027d877be6f381d2649c72067aeb2` (git blob `e7b1ec257e70a42f25a8771ce6e3f809058fa90a`). The live upload does not yet contain these fixes.
- All ten LEVELS definitions are unchanged from the synchronized baseline.

Do not roll back to an older upload or equate the current development build with the current itch.io upload. No unobserved private/local build is covered by this provenance.

## Game and protected behavior

4 × 5 tray, ten layouts, red 2 × 2 target block, bottom-center exit. Drag a block along an available horizontal or vertical axis, release to snap, clear to unlock the next layout. Background drag orbits the camera; scroll/pinch zooms. Final completion offers Play Again while retaining unlocked levels.

Preserve grid collision checks, facet-based initial grab point, canonical raycast coordinates, axis-constrained drag mathematics, snap behavior, hidden-overlay input protection, unlock flow, procedural audio, responsive live styles, repaired tray corners, and quiet slide volume. Do not redesign the core interaction while preparing Android.

## Implemented readiness changes

- Local Three.js r128, OrbitControls r128, and Poppins files, with upstream MIT/OFL notices and a dependency hash manifest.
- Versioned local save: current layout, unlocked level, block coordinates, completed-screen state, and mute preference. Loading validates bounds, IDs, occupancy, and schema; denied/corrupt storage falls back gracefully.
- Drag ownership by pointer ID; secondary pointers do not move/end the active drag. Cancel/capture loss/blur/pagehide/visibility changes restore the canonical committed position, release capture, restore camera controls, silence sliding audio, and save.
- Geometry disposal when rebuilding a layout; shared materials stay reusable.
- Mute control, descriptive arrow labels, minimum 44 CSS px button height, narrow-header wrapping, and aspect-dependent camera zoom on resize.
- Visible graphics-failure screen with reload/retry after initialization failure or context loss. This is a reload recovery path, not in-place GPU context reconstruction.

## Files and execution

| Path | Purpose |
| --- | --- |
| `index.html` | Complete game CSS, markup, level data, rendering, input, audio, state, and loop |
| `vendor/` | Pinned runtime scripts, local fonts, and upstream notices |
| `docs/VENDORED_DEPENDENCIES.json` | Sources, versions, sizes, and SHA-256 hashes |
| `tests/state.cjs` | State/input tests using real Three.js math with DOM/renderer adapters |
| `tests/solve.py` | Legal path generator for browser replay |
| `tests/browser.cjs` | Actual Chromium touch/drag/progression and responsive/fallback checks |
| `.github/workflows/verify.yml` | Browser gate followed by Android preparation build |
| `android/` | Local-asset Android WebView preparation project |
| `docs/ANDROID_PREPARATION.md` | Native build identity/toolchain, artifact limits, device acceptance |
| `docs/PLAYSTORE_READINESS.md` | Original audit plus current resolution/evidence notes |
| `docs/ROADMAP.md` | Authoritative locked title/phase sequence |

Serve the repository with `python3 -m http.server 8000`. Running the game needs no npm install/build. QA requires `npm ci --ignore-scripts` and Playwright Chromium; run `npm run test:state` and `npm run test:browser`. The browser web build has local dependencies but no PWA service worker; do not promise uncached offline itch.io first launch.

## Verified evidence

- Inline JavaScript syntax and unchanged level-data comparison passed.
- `node tests/state.cjs`: 27 assertions passed. Real Three.js math/raycasting is used, but rendering/DOM are adapted. Its deliberate graphics-failure test prints an expected error.
- Green Chromium run at commit `1275fb816b99913242923456ab4366d1763aab75`: https://github.com/Joenasriani/klotski-game/actions/runs/43409193383
- Actual Chromium touch drag, reload restoration, restart, all ten levels by rendered mouse dragging, win/progression, final replay, saved mute, external-host blocking, responsive bounds, and graphics fallback passed. Software graphics in CI is not Android hardware.
- Screenshots inspected at 900×800, 360×800, 800×360, 320×568, and 768×1024, plus expert Level 10 and graphics fallback. Board/controls fit; narrow header wraps. Responsive checks cover these sampled layouts/views, not every camera position or device.
- Earlier cloud Chrome could not create a WebGL context. That historical environment limitation is not a failure of all devices; CI subsequently rendered and played the game successfully.

Historical failed runs: the first runner lacked Playwright support for Ubuntu 26.04; pinning Ubuntu 24.04 resolved setup. A later test expected mixed-case mute text while CSS uppercased the displayed label; correcting the expectation resolved it. Neither was a level-design fix.

## Android preparation and remaining gate

Proposed application ID `com.joenasr.klotski`, version `0.1.0` / code `1`, min API 26, compile/target API 36. Actual Play identity must be confirmed before first publication. The local game loads through WebViewAssetLoader on the appassets HTTPS origin. There is no INTERNET permission, ad/analytics SDK, login, or JavaScript bridge. See ANDROID_PREPARATION.md for exact toolchain and lifecycle behavior.

CI produced a debug-signed installation APK and an **unsigned** release AAB after the browser gate passed. APK/AAB embedded HTML and all vendor files were byte-compared with the verified source; they match. The APK manifest has no INTERNET permission, its signing block is present, the AAB has no release signature, and native notices are packaged. Exact sizes/hashes are in ANDROID_BUILD_MANIFEST.json. Do not present the unsigned bundle as a Play-ready upload. The vector launcher icon is provisional, not a final store logo suite.

Build/lint and package-content inspection are complete. Lint has zero errors and four non-blocking warnings: target SDK 36 below the newest SDK, the API-33 Back manifest attribute ignored on older systems (the AndroidX dispatcher covers legacy input), and newer versions available for the two pinned AndroidX libraries. No lint error was suppressed to obtain the pass. Explicit backup/transfer exclusions and native text resources were added before the final build.

CI reuses green browser run 43409193383 only when index.html, vendor/, tests/, package.json, and package-lock.json exactly match verified commit 1275fb8; changed web/QA files trigger a new full replay. This is historical evidence reuse, not a claim that every native-only commit replayed the browser.

Next: obtain Joe’s physical-device test results for the debug APK. Test airplane-mode launch, touch/multi-touch, cutouts/rotation, Back, background/resume/audio, process death/restoration, graphics recovery, sustained performance, and completion. Final store assets, policy/declarations, release signing, and Play testing remain open. Update itch.io only with the verified web release at the roadmap's release stage. Do not start Ascension.


## Android audio correction – 13 November 2026

Joe reported low sliding audio on the physical Android test. History comparison identified the live-source sync (960dcf6) reduced the original slide multiplier/cap from 0.8/0.05 to 0.25/0.015. Version 0.1.1 (versionCode 2) restores 0.8/0.05 while preserving mute/background guards and the original 400 Hz filter and snap effect. The earlier local proposal to redesign/amplify the snap was rejected in favor of this minimal restoration and was never pushed. `node tests/audio.cjs` uses real OfflineAudioContext renders to compare against the quieter APK baseline: stronger slide, bit-identical snap, combined headroom, mute/rest silence. Check current CI before delivering the rebuilt APK. Final listening acceptance remains with Joe on Android. Previous store screenshots remain visually representative; old runtime/build checksums describe 0.1.0 only.


## Current submission candidate – 0.1.2

See [release record](RELEASE_0.1.2.md) for current signing, policy, branding and account gates. (From docs/, use RELEASE_0.1.2.md.) Version 0.1.1 audio was accepted by Joe on Android. Version 0.1.2 preserves that audio and adds final launcher artwork and offline privacy text. Older provisional-icon/unsigned-build notes above describe historical artifacts; current candidate build/signing results must be checked against this release record.
