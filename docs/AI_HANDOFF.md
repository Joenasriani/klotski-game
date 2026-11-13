# Klotski – current AI handoff

Updated: 13 November 2026. Read alongside PLAYSTORE_READINESS.md.

## Roadmap and gate

User order: Klotski → Ascension → Paradigm Shift. Finish Klotski source reconciliation and readiness audit before Android packaging. Do not claim Play Store readiness from a syntax check or solver result. Do not create store submissions or sign with invented credentials.

Located next repositories: `Joenasriani/ascension-opt` and `Joenasriani/paradigm-shift-game`. These have been located only; they have not been audited in this stage.

## Baseline and provenance

- Original GitHub baseline: `fd25d4c493bf2c472af426573658b63308778f8f` on main.
- Published page: https://joenasr.itch.io/klotski
- Observed iframe: https://html-classic.itch.zone/html/17576696/index.html?v=1782729178
- Retrieved live response: 42,325 bytes; SHA-256 `272e7bf48cf18e2f526cbd618ab535d0b704ff78e04a4e0805fced1de0b846fc`.
- Previous repo index.html: 35,747 bytes; SHA-256 `cb3c6159003bcb276932f0d55324780f074c01e10a216f1d67bc36dec895165a`.
- Current index.html is the live response with only itch.io's trailing injected `https://static.itch.io/htmlgame.js` script removed. This script belongs to itch.io hosting and is not game source. One changed line also has trailing whitespace normalized.
- No later unobserved local or private upload is asserted to be covered.

## File map

`index.html` contains all CSS, markup, level definitions, rendering, input, audio, state, and animation. No package manager, build scripts, Android project, automated tests, license file, or bundled dependencies exist in the original repository.

## Preserve

Keep the ten layouts, grid collision checks, axis-constrained drag math using the grabbed facet, unified raycast coordinates, snap behavior, hidden-overlay pointer-event protection, unlock navigation, orbit camera, and procedural audio. Preserve live responsive styles, startup camera distance, repaired tray corners, and reduced slide volume. Do not redesign the game while preparing Android.

## Validation performed

Node syntax check passed for the inline JavaScript in both original and live sources. A breadth-first search with interchangeable same-size blocks confirmed all ten layouts can bring the main block to x=1, y=3, from where the source allows it to exit. This is a logic/data check, not UI replay. Minimum move claims are not verified.

The published itch.io game was launched in cloud Chrome. UI appeared, but Three.js threw `Error creating WebGL context`; no board rendered. No drag, win, progression, mobile layout, Android WebView, or physical-device acceptance test passed in that browser. Extension metadata errors were also present and are unrelated to game code. Do not report the game itself broken on all devices from this browser result.

## Next work

Address the ranked findings in PLAYSTORE_READINESS.md. First preserve this baseline, then implement focused fixes on a separate branch and validate in a WebGL-capable browser. Bundle licensed dependencies, persist and validate progress, handle WebGL failure/context loss, fix pointer ownership/lifecycle cleanup, verify responsive framing and controls, then create the Android wrapper and test on real Android hardware. Build a test APK and a signed release AAB only after these gates. Keep signing keys out of git.
