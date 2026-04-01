# Cross-Cutting — Security & Encryption Architecture

**Phase:** All phases (foundational from MVP onward)

Security is a core product pillar. All personal data is encrypted on the device before transmission. The server stores only ciphertext.

## Encryption (MVP)

- [ ] AES-256-GCM for all PII encryption
- [ ] Key derivation from user passphrase (PBKDF2 or Argon2)
- [ ] iOS: CryptoKit implementation
- [ ] All data encrypted before local storage
- [ ] No plaintext PII on disk at any time

## Encryption (v1.0+)

- [ ] Android: Android Keystore / javax.crypto implementation
- [ ] Web: Web Crypto API implementation (matching native crypto)
- [ ] Shared encryption module across platforms (Rust/KMM)
- [ ] Recovery key generation and secure storage

## Sync Data Privacy

- [ ] Calendar events read on-device, matched on-device
- [ ] Email headers read on-device, matched on-device
- [ ] Only encrypted interaction records synced to server (person ID + timestamp + type)
- [ ] Raw calendar/email data never uploaded
- [ ] Server has zero ability to decrypt user data

## Threat Model

- [ ] Define and document threat model
- [ ] Server compromise: attacker gets only ciphertext
- [ ] Man-in-the-middle: TLS + certificate pinning
- [ ] Device theft: biometric + passphrase protection
- [ ] Third-party audit of encryption implementation
- [ ] Penetration testing before public launch

## Zero-Knowledge Architecture

- [ ] Server operator cannot decrypt or access user data
- [ ] Encryption keys never leave the device
- [ ] Key rotation strategy
- [ ] Secure key exchange for shared/viewer access (Phase 2)
