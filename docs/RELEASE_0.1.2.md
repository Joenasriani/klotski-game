# Klotski 0.1.2 – submission materials

Package: com.joenasr.klotski. VersionCode: 3. Target API: 36.

Preserves Joe’s accepted 0.1.1 audio restoration (slide 0.8/0.05, original snap). Adds final launcher PNG/adaptive artwork, an offline privacy dialog, and public policy:
https://joenasriani.github.io/klotski-game/privacy-policy.html

Contact and developer account: questrequestvr@gmail.com. GitHub ownership does not determine Play Console ownership.

Signing: build an unsigned release AAB in CI; sign locally with a dedicated RSA-3072 upload key. Private key/password never enter git or CI. Backup is private in the specified Drive account. Enroll in Play App Signing for distribution. This upload key is for a new app and must not replace any previously registered upload key without checking Console identity.

Required account steps remain: verify account/production access, upload bundle, enroll signing, complete Data Safety, IARC rating, target audience, distribution/pricing and account-specific testing. No issued rating or completed Console setup is claimed. Joe accepted 0.1.1 sound on his Android; full physical 0.1.2 acceptance is pending.

Selected preview video: https://www.youtube.com/watch?v=_qtY5zJ42C8 – selected by Joe, not yet accepted by Console.

## Completed artifact verification

Readiness run 43442951226 passed. Emulator capture/export run 43444307410 passed after a workflow-only teardown/export fix. Twelve actual Android screenshots were inspected; actual dimensions/provenance are in the submission pack. The signed AAB passes JAR signature/certificate checks and Google bundletool validation; the release-derived install APK passes Google's ApkVerifier with v2/v3 signatures. Manifest and runtime byte parity were checked. Upload certificate SHA256: A3:F3:9E:76:13:70:FC:91:EF:91:12:D0:D8:57:A8:A7:35:BA:54:3F:2F:C8:A1:4E:85:C4:AB:87:3E:44:6E:65.

Drive subfolder 08 contains the signed candidate and installation test; 07 contains the private signing backup and must not be shared. Play Console was not accessible, so account declarations, signing enrollment and submission are not complete.
