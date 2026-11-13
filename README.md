# Klotski – 3D Sliding-Block Puzzle

A ten-level sliding-block puzzle by Joe Nasr. Move pieces around a 4 × 5 tray to guide the large red block through the bottom-center exit.

[Published browser game](https://joenasr.itch.io/klotski) · [Privacy policy](https://klotski-privacy-questrequest.joenasr.chatgpt.site)

## Current Android candidate: 0.1.2 / versionCode 3

- Application ID: `com.joenasr.klotski`; min API 26; compile/target API 36.
- Developer account/contact: `questrequestvr@gmail.com`. GitHub repository ownership does not determine the Play developer account.
- Final launcher artwork is integrated for legacy and adaptive icons.
- Privacy text is available offline inside the app; Android Back closes that dialog before backgrounding.
- Local assets, local saves, mute, no INTERNET permission, no login, ads or purchases in this build.
- Audio preserves the original slide multiplier/cap 0.8/0.05 and original snap. Joe accepted the restored sound on Android in 0.1.1. Do not reduce or redesign it without a new requirement.

A dedicated RSA-3072 upload key was generated and backed up privately in the specified Drive account, outside GitHub and CI. The 0.1.2 release AAB was signed locally, verified against its certificate, and validated with Google bundletool 1.18.3. An installation APK was generated from that bundle. These are submission materials, not proof of Play acceptance. Never commit private signing credentials.

## Verification and release limits

Readiness workflow [43442951226](https://github.com/Joenasriani/klotski-game/actions/runs/43442951226) passed the full ten-level rendered browser replay, touch, save/mute/restoration, responsive bounds, offline-policy open/close, graphics fallback, Android build and lint. App source: `6e09da68ab71126a0d2a3635bb2585605d6d88bf`.

Android emulator instrumentation passed 1/1 in capture run 43442951243, but its screenshot pull failed after test-runner teardown. Workflow-only commit `31d6785cf35504e22d8c13f3cc331ae3baecb1f8` runs instrumentation directly to preserve output; capture run [43444307410](https://github.com/Joenasriani/klotski-game/actions/runs/43444307410) passed and exported all 12 actual Android app screenshots. Three 7-class captures reflect an 18-pixel system-inset reflow; actual dimensions are recorded without stretching. This does not change the app binary or audio.

**Play Console setup remains open:** browser access was blocked in this session. Account verification/testing, signing enrollment, listing, declarations, issued content rating, intended audience, pricing/countries, selected video acceptance, pre-launch reports and Google review are not completed or inferred from these tests. Full physical-device regression for 0.1.2 is pending; Joe's specific 0.1.1 sound acceptance is recorded separately.

## Play locally and verify

Serve the repository with `python3 -m http.server 8000`. Runtime dependencies/fonts are bundled. Browser hosting has no PWA cache, so do not promise an uncached offline itch.io launch.

Development checks:

```sh
npm ci --ignore-scripts
npx playwright install --with-deps chromium
npm run test:state
node tests/audio.cjs
npm run test:browser
```

Drag blocks to slide; drag background to orbit; pinch/scroll to zoom. Restart resets the current puzzle. Clear a level to unlock the next; arrows revisit unlocked levels. Progress, positions and sound preference save locally; clearing app data removes them.

## Continuation

[Current AI handoff](docs/AI_HANDOFF.md), [0.1.2 release record](docs/RELEASE_0.1.2.md), [audit history](docs/PLAYSTORE_READINESS.md), and [locked roadmap](docs/ROADMAP.md).

Current focus remains Klotski. Complete its release stage and verified itch.io update before advancing to Ascension, then Paradigm Shift. itch.io has not been updated by this work.
