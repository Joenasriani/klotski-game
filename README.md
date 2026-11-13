# Klotski – 3D Klotski Puzzle

A 3D sliding-block puzzle by Joe Nasr. Slide blocks along the 4 × 5 tray to free the red 2 × 2 block through the bottom-center exit. Includes 10 progressively arranged layouts, an orbit camera, and synthesized sliding/snap audio.

Play the published browser game: https://joenasr.itch.io/klotski

## Current state

The `main` branch is synchronized with the observed live game source retrieved and rechecked on 13 November 2026. Before this reconciliation, `main` at `fd25d4c493bf2c472af426573658b63308778f8f` lagged behind the itch.io upload. Responsive layout, startup camera framing, tray geometry fixes, and lower sliding volume were missing.

**Android / Play Store readiness: blocked.** No Android wrapper, APK, AAB, signing configuration, store asset suite, or device acceptance evidence is included. This is an audit baseline, not a release candidate.

## Run locally

Serve the repository over HTTP, for example:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 in a WebGL-capable browser. Three.js r128, OrbitControls r128, and the Poppins font are bundled under `vendor/` with their license notices. Running the game requires no package installation or build step. QA uses the separate development-only package.json.

## Controls and behavior

- Drag a block to slide along an available row or column; release to snap to the grid.
- Drag the background/tray to orbit; scroll or pinch to zoom.
- Sound toggles synthesized audio.
- Restart restores the current layout. Arrow controls revisit unlocked levels.
- Clear a level to unlock the next. Final completion offers Play Again.
- Progress and sound preference are saved locally when browser storage is available. Invalid saves fall back to a fresh game; private/embedded browsers may deny storage.

## Maintenance

Follow [the locked roadmap](docs/ROADMAP.md). **Current focus: Klotski only.** Ascension and Paradigm Shift are queued; do not begin their implementation or documentation updates during this stage.

Read [the AI handoff](docs/AI_HANDOFF.md) and [the readiness audit](docs/PLAYSTORE_READINESS.md) before editing. The documentation is for developers and is not rendered inside the game.

The earlier short identity README was deliberately removed in September. This newly requested documentation records actual source provenance and verification limits rather than restoring that obsolete text.

## Readiness fixes in progress

Branch `fix/klotski-android-readiness` adds local dependencies, validated progress restoration, pointer ownership and interruption cleanup, mute control, 44 px minimum button height, resize framing, geometry disposal, and a graphics-failure recovery screen. The original live-source baseline remains recoverable in git. These changes are not deployed to itch.io.

QA: `npm run test:state` checks state/input logic using real Three.js math with a renderer adapter. `npm run test:browser` generates legal solution paths and replays rendered drags in Chromium. CI saves screenshots as an artifact. Neither test replaces Android hardware acceptance.
