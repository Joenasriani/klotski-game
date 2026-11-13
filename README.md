# Klotski – 3D Klotski Puzzle

A 3D sliding-block puzzle by Joe Nasr. Move pieces through a 4 × 5 tray to free the large red 2 × 2 block through the bottom-center exit. Ten layouts progress from a short introduction to classic Hua Rong Dao.

[Play the published browser game](https://joenasr.itch.io/klotski)

## Current state

The repository was synchronized with the observed itch.io source on 13 November 2026. This development build includes local runtime assets/fonts, saved progress, safer touch/drag cleanup, mute, larger controls, responsive framing, and a graphics-error recovery screen. These changes are not yet uploaded to itch.io.

**Browser verification passed. Android / Play Store release acceptance remains open.** The preparation project is not a production-signed store release. See [the locked roadmap](docs/ROADMAP.md), [current AI handoff](docs/AI_HANDOFF.md), [readiness audit](docs/PLAYSTORE_READINESS.md), and [Android build notes](docs/ANDROID_PREPARATION.md).

**Current focus: Klotski only.** Ascension and Paradigm Shift remain queued.

## Controls

- Drag a block along an available row or column; release to snap to the grid.
- Drag the background/tray to orbit; scroll or pinch to zoom.
- Restart resets the current layout. Arrows revisit unlocked levels.
- Clear a layout to unlock the next; final completion offers Play Again.
- Sound toggles synthesized audio. Progress, current block positions, and sound preference save locally when browser storage is available. Clearing browser/app data removes them.

## Run locally

No build or package installation is needed to play:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 in a WebGL-capable browser. Three.js r128, OrbitControls r128, and Poppins are bundled in `vendor/` with upstream notices. The browser build has no PWA offline cache; local dependencies do not guarantee an uncached offline first visit to itch.io.

## Verification

Development-only QA:

```sh
npm ci --ignore-scripts
npx playwright install --with-deps chromium
npm run test:state
npm run test:browser
```

| Check | Evidence |
| --- | --- |
| Syntax and original ten layouts | Passed; level definitions unchanged |
| State, raycast, storage, pointer cleanup, graphics fallback | 27 assertions passed using real Three.js math and adapted DOM/renderer |
| Rendered gameplay | All ten levels completed through Chromium mouse dragging |
| Touch, restoration, restart, saved win/mute | Passed in Chromium |
| Responsive samples | Screenshots/bounds inspected at desktop, phone portrait/landscape, narrow phone, tablet |
| External-host blocking and graphics-error screen | Passed |
| Android hardware, performance, and store acceptance | Pending |

[Green browser workflow](https://github.com/Joenasriani/klotski-game/actions/runs/43409193383). Browser/software-rendering evidence is not physical Android testing.

## Repository map

| Path | Purpose |
| --- | --- |
| `index.html` | Game code, ten layouts, UI, rendering, input, sound, saves |
| `vendor/` | Pinned runtime/font assets and upstream notices |
| `android/` | Offline local-asset WebView preparation project |
| `tests/` | State tests, solution generation, rendered browser replay |
| `docs/AI_HANDOFF.md` | Single current technical handoff |
| `docs/ROADMAP.md` | Locked scope and sequence |
| `docs/PLAYSTORE_READINESS.md` | Audit, findings, and resolution evidence |
| `docs/ANDROID_PREPARATION.md` | Build instructions and Android acceptance limits |

The Android workflow passed and generated a debug test APK and an unsigned release AAB. [Android build evidence](https://github.com/Joenasriani/klotski-game/actions/runs/43412776822) and [artifact checksums](docs/ANDROID_BUILD_MANIFEST.json) identify the tested build. Lint completed with zero errors and four non-blocking warnings, recorded in the handoff. Production signing, actual Play identity, final store assets/declarations, and device acceptance remain open. The proposed launcher graphic is provisional.


## Android audio correction – 13 November 2026

Joe reported low sliding audio on the physical Android test. History comparison identified the live-source sync (960dcf6) reduced the original slide multiplier/cap from 0.8/0.05 to 0.25/0.015. Version 0.1.1 (versionCode 2) restores 0.8/0.05 while preserving mute/background guards and the original 400 Hz filter and snap effect. The earlier local proposal to redesign/amplify the snap was rejected in favor of this minimal restoration and was never pushed. `node tests/audio.cjs` uses real OfflineAudioContext renders to compare against the quieter APK baseline: stronger slide, bit-identical snap, combined headroom, mute/rest silence. Check current CI before delivering the rebuilt APK. Final listening acceptance remains with Joe on Android. Previous store screenshots remain visually representative; old runtime/build checksums describe 0.1.0 only.
