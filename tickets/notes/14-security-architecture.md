# Cross-Cutting — Security & Encryption Architecture

**Phase:** All phases (foundational from MVP onward)

Security is a core product pillar. All personal data is encrypted on the device before transmission. The server stores only ciphertext.

> **Implementation Status:** MVP encryption is implemented. AES-256-GCM via react-native-quick-crypto (native) and Web Crypto API (web). PBKDF2 key derivation (600k iterations). Key stored in expo-secure-store (iOS Keychain / Android KeyStore). Passphrase setup + biometric unlock flow.

## Encryption (MVP)

- [x] AES-256-GCM for all PII encryption
- [x] Key derivation from user passphrase (PBKDF2)
- [x] iOS: react-native-quick-crypto (native crypto, CryptoKit-backed)
- [x] All data encrypted before local storage
- [x] No plaintext PII on disk at any time

## Encryption (v1.0+)

- [x] Android: react-native-quick-crypto (uses Android native crypto) — *implemented alongside iOS*
- [x] Web: Web Crypto API implementation (matching native crypto) — *platform-branching in lib/crypto.ts*
- [ ] Shared encryption module across platforms (Rust/KMM)
- [ ] Recovery key generation and secure storage

## Sync Data Privacy

- [ ] Calendar events read on-device, matched on-device
- [ ] Email headers read on-device, matched on-device
- [ ] Only encrypted interaction records synced to server (person ID + timestamp + type)
- [ ] Raw calendar/email data never uploaded
- [x] Server has zero ability to decrypt user data — *zero-knowledge: no server, all local*

## Threat Model

- [ ] Define and document threat model
- [x] Server compromise: attacker gets only ciphertext — *no server in MVP; local data encrypted*
- [ ] Man-in-the-middle: TLS + certificate pinning
- [x] Device theft: biometric + passphrase protection — *passphrase required, biometric unlock supported*
- [ ] Third-party audit of encryption implementation
- [ ] Penetration testing before public launch

## Zero-Knowledge Architecture

- [x] Server operator cannot decrypt or access user data — *no server; data encrypted locally*
- [x] Encryption keys never leave the device — *stored in expo-secure-store (hardware-backed keychain)*
- [ ] Key rotation strategy
- [ ] Secure key exchange for shared/viewer access (Phase 2)
