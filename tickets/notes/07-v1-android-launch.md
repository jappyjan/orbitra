# v1.0 — Android Launch

**Phase:** v1.0 Full Launch (Q3 2026)

## Native Android App

- [ ] Build native Android app in Kotlin with Jetpack Compose
- [ ] Full feature parity with iOS app
- [ ] Follow Material Design 3 guidelines
- [ ] Google Play Store listing and assets

### Core Views (Android)

- [ ] Graph Canvas with touch-optimized interactions
- [ ] People Feed (Home View) as card-based scrollable list
- [ ] Circle Groups (Browse View) with grid layout
- [ ] Person Detail View as full-screen modal
- [ ] Search with fuzzy matching

### Platform-Native Features

- [ ] Android Keystore / javax.crypto for encryption (AES-256-GCM)
- [ ] Android contact book import via ContactsContract
- [ ] Google Play Billing integration for subscriptions
- [ ] Material 3 theming and dark mode support

### Shared Core

- [ ] Shared cross-platform module (Rust or KMM) for:
  - [ ] Graph data model
  - [ ] Encryption/decryption logic
  - [ ] Sync protocol
  - [ ] Conflict resolution (CRDT)
- [ ] Compile shared core to Android library
- [ ] Compile shared core to iOS framework
