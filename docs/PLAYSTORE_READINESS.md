# Klotski – pre-Android readiness audit

Audit date: 13 November 2026. Verdict: **BLOCKED – do not package as release-ready yet.**

## Source parity

Historical GitHub main at fd25d4c did not match the published itch.io build. Current `main` was reconciled in commit `960dcf646f7cd4d9bba1e51b5af991797acd6276`; index.html matches the observed live response, excluding itch.io's injected host script (and normalizing one changed line’s trailing whitespace). Differences include responsive UI and safe-area CSS, startup camera distance, tray wall/corner geometry, reduced sliding volume, and simplified tween completion. No puzzle layout changes were found. README and AI handoff were absent from the historical baseline; both now exist on main. The live response was rechecked on the same date and its hash was unchanged.

## Findings

| Priority | Finding / evidence | Required action |
| --- | --- | --- |
| P0 | No Android project, package identity, signing setup, APK, or AAB. | Choose stable application ID, create an offline-capable wrapper, use current Android SDK requirements, and keep signing material outside git. |
| P0 | Runtime acceptance blocked: live launch in cloud Chrome throws `THREE.WebGLRenderer: Error creating WebGL context.` Header/instructions render but board does not. | Repeat in a WebGL-capable browser and Android WebView/device; test launch-to-completion. Add a visible graceful error path for unsupported WebGL. |
| P1 | Three.js, OrbitControls, and Poppins load from remote CDNs. No bundled fallback or offline startup. | Bundle exact licensed dependencies/font or use an appropriate local font fallback; verify first launch in airplane mode. |
| P1 | currentLevelIndex and highestUnlockedLevel are memory-only; no storage calls. | Persist validated progression and current state; verify reload, process death, updates, and corrupt storage. |
| P1 | Drag state has no active pointer ID filtering. A second pointer can move/end the first pointer's selection. | Track pointer ownership and test multi-touch, cancel, capture loss, and interruptions. |
| P1 | resetGame clears selection/tweens but does not explicitly restore controls.enabled, cursor, capture, or slide gain. No visibility/blur cleanup. | Centralize drag cancellation and audio cleanup; test restart/level changes and app background/resume mid-drag. |
| P1 | Renderer initialization is unguarded; no WebGL context-loss/recovery handling. | Provide useful fallback/retry behavior and verify context recovery on Android. |
| P1 | Resize updates aspect only; portrait startup framing is not reapplied after orientation change. | Test both rotation directions, navigation bars, cutouts, keyboard/system overlays, tablets, and narrow windows. Preserve user camera intent when reframing. |
| P2 | Rebuilding levels removes meshes without disposing their per-block BoxGeometry. | Dispose replaced geometry; verify repeated restart/level-switch memory stabilizes. |
| P2 | Buttons shrink to 32–38 CSS px high and arrow labels have no descriptive accessible names. Color alone identifies the target. No mute or keyboard block controls. | Verify touch target sizing, add accessible names and non-color target identification; assess keyboard/audio controls. |
| P2 | 2048² shadows and continuous full-rate rendering are used without target-device profiling or app lifecycle pause. | Profile sustained play and background behavior on representative phones; tune quality based on measurements. |
| P1 | No privacy policy, data safety inventory, store asset suite, content-rating record, or rights/attribution record in repository. | Inventory actual data/permissions and third-party requests, resolve rights, prepare accurate policy/listing, icons, feature graphic, and device screenshots. |

These are static findings unless explicitly described as observed at runtime. Multi-touch, memory growth, and lifecycle scenarios still require reproduction and verification after fixes.

## Puzzle data verification

All ten layouts have non-overlapping starting positions and were solvable in a breadth-first grid search with same-size pieces canonicalized. Search used legal horizontal/vertical slides without crossing occupied cells and checked that the red block can reach x=1, y=3 before its exit slide. This verifies a solution exists in the abstract model. It does not prove rendered dragging, snapping, win detection, or progression works. No shortest-move marketing claim is approved by this test.

## Verification ledger

| Check | Result |
| --- | --- |
| Repository/history inspected | Pass; original baseline recorded |
| Observed live source compared | Pass; differences identified and source reconciled on main |
| Original/live inline JavaScript syntax | Pass; node --check |
| Ten layouts abstract solvability | Pass; 10/10 |
| Published browser launch and UI | UI visible; board blocked by WebGL initialization error |
| Console health | Fail in this cloud browser; WebGL context errors |
| Drag → snap → win → next level | Untested; runtime blocked |
| Mobile portrait/landscape and tablets | Untested |
| Offline first launch | Not supported by current external dependency structure; device test pending |
| Android Back, resume, process death, audio focus | Untested; no Android project |
| APK/AAB installation and release checks | Not started |

## Packaging gate and release sequence

Follow [ROADMAP.md](ROADMAP.md). Current scope is Klotski only.

1. Reconcile source and maintain one current handoff (complete on main).
2. Fix readiness issues without changing level design; validate controls, state, audio, visuals, and all ten progression paths.
3. Build Android shell with local assets; implement Back behavior, lifecycle, safe-area/edge-to-edge behavior, and minimal permissions.
4. Verify on physical Android phones/tablets: offline launch, touch, rotation, background/resume, process restoration, performance, and completion.
5. Prepare test APK and signed release AAB, versioning, dependency notices, app identity, and store assets.
6. Complete Play Console declarations and applicable testing requirements using the actual developer account status. Do not infer account eligibility from this source audit.
7. Update itch.io with the verified release build, then advance to Ascension and Paradigm Shift in order after Klotski's stage is complete. Do not modify the queued titles during the active Klotski stage.

Google Play publishes new apps using Android App Bundles; APK is the installable testing format. Current official policy checked on the audit date requires phone/tablet submissions to target Android 16 / API 36 or higher. Recheck at packaging time:

- https://developer.android.com/guide/app-bundle
- https://support.google.com/googleplay/android-developer/answer/11926878

## Store-copy accuracy

The live listing says “custom physics engine,” “flawless 1:1 dragging,” and a minimum of 81 moves. The inspected implementation uses grid constraints and tweening rather than a general physics engine. Absolute drag claims and minimum move counts are not substantiated by this audit. Revise such claims when preparing the listing; no live listing was edited in this audit.

## Readiness-fix branch – 13 November 2026

The initial findings above describe the synchronized live baseline. The branch `fix/klotski-android-readiness` addresses remote dependencies, save-state validation/persistence, pointer ownership, drag/lifecycle cleanup, geometry disposal, minimum touch target heights/labels, mute preference, resize zoom, and graphics error fallback. These fixes are not yet an Android or itch.io release.

Current evidence: 27 automated state/input assertions pass with real Three.js math and a mock renderer/DOM. Original ten LEVELS data is preserved. Rendered Chromium replay and screenshot inspection remain pending; device checks remain pending. The sound control and narrower layout require rendered acceptance, and no keyboard block-movement feature is claimed. Full performance, accessibility, privacy/store declarations, rights review beyond bundled dependency notices, Android package identity/build/signing, and hardware acceptance remain unresolved.

Android preparation source now exists on the fix branch; see ANDROID_PREPARATION.md. It packages local web assets through WebViewAssetLoader with no INTERNET permission. CI is configured to produce a debug-signed APK and unsigned AAB after the browser gate. Build success and hardware acceptance are not yet claimed. The original P0 "no project" finding describes the historical baseline; signing and release/device readiness remain open.
