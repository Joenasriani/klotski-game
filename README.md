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

Open http://localhost:8000 in a WebGL-capable browser. Internet is currently required for Three.js r128, OrbitControls r128, and the Poppins font. There is no install/build step.

## Controls and behavior

- Drag a block to slide along an available row or column; release to snap to the grid.
- Drag the background/tray to orbit; scroll or pinch to zoom.
- Restart restores the current layout. Arrow controls revisit unlocked levels.
- Clear a level to unlock the next. Final completion offers Play Again.
- Progress exists only in memory and is lost on page reload.

## Maintenance

Follow [the locked roadmap](docs/ROADMAP.md). **Current focus: Klotski only.** Ascension and Paradigm Shift are queued; do not begin their implementation or documentation updates during this stage.

Read [the AI handoff](docs/AI_HANDOFF.md) and [the readiness audit](docs/PLAYSTORE_READINESS.md) before editing. The documentation is for developers and is not rendered inside the game.

The earlier short identity README was deliberately removed in September. This newly requested documentation records actual source provenance and verification limits rather than restoring that obsolete text.
