# Klotski – Current AI Handoff

Updated 13 November 2026. This is the single current handoff. Older version/build statements in audit records are historical.

## Accepted baseline

Joe accepted the restored 0.1.1 sound on his Android. Preserve slide `Math.min(velocity * 0.8, 0.05)` with mute/background guards, 400 Hz bandpass/Q 0.5, and original triangle snap (250→40 Hz, gain 0.15, 50 ms). The earlier 0.25/0.015 reduction came from live-source synchronization in 960dcf6; the broad local audio-redesign proposal was never published.

## Current app and artifacts

0.1.2/code 3, package com.joenasr.klotski; min API 26, compile/target 36. App source commit 6e09da68ab71126a0d2a3635bb2585605d6d88bf. Final raster/adaptive launcher integrated. Offline Privacy button/dialog and Android Back handling added. Privacy policy is public at https://joenasriani.github.io/klotski-game/privacy-policy.html and contact is questrequestvr@gmail.com.

Signed AAB and release-derived install-test APK are in the user's KLOTSKI Drive folder, subfolder 08 – Play Store Submission – v0.1.2. Private upload key/password backup is in subfolder 07 – Signing Key – PRIVATE – Do Not Share. No private key is in GitHub or Actions. Public upload certificate SHA256: A3:F3:9E:76:13:70:FC:91:EF:91:12:D0:D8:57:A8:A7:35:BA:54:3F:2F:C8:A1:4E:85:C4:AB:87:3E:44:6E:65. Generated for a new app; verify compatibility before use if Console already has a registered upload key. Google-managed Play App Signing enrollment remains pending.

## Evidence

- 27 state/input assertions passed.
- Real OfflineAudioContext comparison: restored slide, unchanged snap, headroom, silence for mute/rest.
- Browser/Android readiness run 43442951226 succeeded: full ten-level mouse replay, touch, saved progression/mute, responsive/fallback and offline privacy dialog; build/lint passed.
- AAB runtime bytes matched index.html exactly. JAR signature verified and PKCS7 signer certificate matched the backed-up upload certificate. Google bundletool 1.18.3 validate passed; manifest confirms API/version/package, no INTERNET permission and no debuggable=true. Release-derived APK runtime parity passed.
- Emulator capture run 43442951243 passed instrumentation 1/1, but export failed because Gradle UTP removed external app files. Workflow-only fix 31d6785cf35504e22d8c13f3cc331ae3baecb1f8 installs/runs instrumentation directly, verifies OK (1 test), then pulls screenshots. Retry run 43444307410 passed and exported all 12 screenshots. All PNGs were visually inspected and retain actual app pixels. Phone and 10-class captures are exact 9:16; three 7-class captures are 1440×2542 after inset reflow. Actual dimensions are recorded in the submission pack.
- Old PR #3 was closed as superseded; do not merge its older audio over current main.

## Actual remaining gates

Console access was blocked by automatic browser approval, which incorrectly identified a mismatched domain when play.google.com/console was requested. No workaround was used. Need user-authorized usable Console access to questrequestvr@gmail.com to complete identity/testing status, app entry, Play App Signing enrollment, upload, Data Safety/IARC/audience/distribution/pricing and review. Do not invent an issued rating or select a child-directed audience without intent. Source inventory supports no collected/shared app data, ads, accounts or purchases; final answers must cover every active artifact.

The selected video is https://www.youtube.com/watch?v=_qtY5zJ42C8. Joe approved it; footage/settings/Console acceptance are not independently verified. Full physical-device regression for 0.1.2 remains open; sound acceptance was specifically for 0.1.1.

The original store pack contains the OLD 0.1.0 APK; direct users to subfolder 08. Historical checksums are not current release checksums; use the 0.1.2 build manifest in the submission pack. Debug signing identities from CI may differ; do not advise uninstalling without explaining local progress loss.

## Scope and architecture

One HTML game, bundled Three.js r128/OrbitControls/Poppins and ten original layouts; local validated save state, pointer ownership/cleanup, mute, graphics fallback. Android WebViewAssetLoader serves local HTTPS assets with no JavaScript bridge or internet permission. No gameplay/level changes were made for 0.1.2.

See ROADMAP.md: Klotski first → verified itch.io update → Ascension → Paradigm Shift. itch.io remains unchanged. Run npm scripts described in README; store capture workflow is test-only and selects authored levels to capture app pixels, not physical-device acceptance.
