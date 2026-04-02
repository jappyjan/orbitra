# MVP — Contact Import, Search & Encryption

**Phase:** MVP (Q2 2026)
**Platform:** iOS (iPhone) only

> **Implementation Status:** Basic search is implemented (name + tag matching). Encryption is now implemented: AES-256-GCM with PBKDF2 key derivation, passphrase setup/unlock with biometric support, encrypted Zustand persistence. No contact import, no fuzzy search.

## Contact Book Import

- [ ] Integrate native iOS contact picker (CNContactPickerViewController)
- [ ] Allow user to select multiple contacts at once
- [ ] Pre-fill name, photo, phone, email from contact data
- [ ] Prompt user to assign imported contacts to circles
- [ ] Handle permission request for Contacts access gracefully
- [ ] Show helpful message if permission denied

## Search

- [x] Search by tags
- [x] Show results as a filtered list with avatar + name
- [x] Tap result to navigate to person on canvas or open detail view — *opens detail view only, no canvas navigation*
- [ ] Implement fuzzy search by name — *current search is substring match, not fuzzy*
- [ ] Search should be fast and responsive (<100ms for up to 500 people)

## End-to-End Encryption

- [x] Encrypt all PII using AES-256-GCM — *via react-native-quick-crypto (native) + Web Crypto API (web)*
- [x] Generate encryption key from user-defined passphrase (PBKDF2) — *600k iterations, SHA-256*
- [x] Encrypt data before writing to local storage — *custom Zustand StateStorage adapter*
- [x] Decrypt data on read, in-memory only — *Zustand store holds decrypted state*
- [x] Ensure no plaintext PII is ever written to disk — *entire person store encrypted as blob*
- [x] Handle passphrase entry on app launch (with biometric shortcut) — *unlock screen with setup/unlock modes*

## Local Storage

- [x] Store person records and metadata — *using encrypted AsyncStorage with Zustand persist*
- [x] No server, no account, no sync — all data stays on-device
- [x] Zero infrastructure cost for MVP
- [x] Design encrypted local data schema — *encrypted blob per Zustand store in AsyncStorage*
- [x] Store encrypted person records, edges, and metadata
- [ ] Implement data migration strategy for schema changes
