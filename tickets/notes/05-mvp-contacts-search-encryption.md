# MVP — Contact Import, Search & Encryption

**Phase:** MVP (Q2 2026)
**Platform:** iOS (iPhone) only

## Contact Book Import

- [ ] Integrate native iOS contact picker (CNContactPickerViewController)
- [ ] Allow user to select multiple contacts at once
- [ ] Pre-fill name, photo, phone, email from contact data
- [ ] Prompt user to assign imported contacts to circles
- [ ] Handle permission request for Contacts access gracefully
- [ ] Show helpful message if permission denied

## Search

- [ ] Implement fuzzy search by name
- [ ] Search by tags
- [ ] Show results as a filtered list with avatar + name
- [ ] Tap result to navigate to person on canvas or open detail view
- [ ] Search should be fast and responsive (<100ms for up to 500 people)

## End-to-End Encryption

- [ ] Encrypt all PII using CryptoKit (AES-256-GCM)
- [ ] Generate encryption key from user-defined passphrase (PBKDF2/Argon2)
- [ ] Encrypt data before writing to local storage
- [ ] Decrypt data on read, in-memory only
- [ ] Ensure no plaintext PII is ever written to disk
- [ ] Handle passphrase entry on app launch (with biometric shortcut)

## Local Storage

- [ ] Design encrypted local data schema (SQLite or Core Data with encrypted fields)
- [ ] Store encrypted person records, edges, and metadata
- [ ] Implement data migration strategy for schema changes
- [ ] No server, no account, no sync — all data stays on-device
- [ ] Zero infrastructure cost for MVP
