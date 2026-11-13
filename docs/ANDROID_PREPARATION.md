# Klotski – Android preparation

Status: debug APK, unsigned AAB, and lint build passed on 13 November 2026. Physical-device and store-release acceptance remain pending.

Build source: `83bc4d93149c7d60816cefdbe9ee89eefbb9dc4f`; workflow https://github.com/Joenasriani/klotski-game/actions/runs/43412776822 . Exact artifact hashes are in ANDROID_BUILD_MANIFEST.json. Lint: zero errors, four non-blocking warnings (target SDK below newest, API-specific Back attribute, two newer AndroidX versions available).

- Proposed new application ID: `com.joenasr.klotski`. Not confirmed as an existing Play Console application; do not change after first publication without reviewing release identity consequences.
- Version: `0.1.0` / code `1`; minimum Android 8 / API 26; compile/target API 36.
- Toolchain: JDK 17, Gradle 8.13, Android Gradle Plugin 8.13.0, Android SDK platform 36, AndroidX WebKit 1.14.0 and Activity 1.10.1.
- Local assets load through WebViewAssetLoader on the reserved appassets HTTPS origin. There is no INTERNET permission, remote gameplay host, analytics SDK, ad SDK, JavaScript bridge, or login.
- Per-move save data lives in WebView local storage. Uninstall/clear-app-data removes it. Cloud backup and device transfer are explicitly excluded by version-appropriate rules. Storage denial falls back gracefully in browser builds.
- Rotation resizes the existing WebView; native system/cutout insets pad the game surface. Back uses the AndroidX back dispatcher and backgrounds the task. Pause/focus loss requests drag cancellation, saving, and silence. These behaviors need physical-device testing.
- Launcher graphic is a provisional vector derived from the existing board/colors; it is not the final Play Store logo suite.

## Build

Install the pinned Gradle/JDK/Android SDK, then from the repository root:

```sh
gradle -p android :app:assembleDebug :app:bundleRelease :app:lintDebug
```

`syncWebAssets` copies only index.html and vendor/ into generated Android assets. Do not copy the whole repository into an APK.

The CI Android job depends on browser verification. Outputs:

- `android/app/build/outputs/apk/debug/app-debug.apk`: debug-signed installation test build.
- `android/app/build/outputs/bundle/release/app-release.aab`: **unsigned** preparation bundle. Not a Play-ready upload.

No production signing configuration or credentials are included. Release signing must use Joe's actual upload identity; never reuse a temporary/debug key for production.

## Device acceptance still required

Verify airplane-mode cold start, all controls/touch/multi-touch, rotation/cutouts/navigation bars, background/resume and audio focus, process death/relaunch and saves, all-level completion, Back behavior, sustained performance, and WebView/graphics recovery on representative Android phones/tablets. CI mouse/touch emulation is not Android hardware acceptance.

Package inspection confirmed the APK/AAB contain the exact verified HTML/vendor files, the APK manifest has no INTERNET permission, the APK has its signing block, the AAB is unsigned, and native dependency notices are included.

Store identity, final icons/feature graphic/device screenshots, privacy policy/data declarations, content rating, release signing, and Play Console testing remain open. Do not publish to Play or update itch.io merely because the Android project builds.

## Primary implementation references

- https://developer.android.com/develop/ui/views/layout/webapps/load-local-content
- https://developer.android.com/build/releases/agp-8-13-0-release-notes
