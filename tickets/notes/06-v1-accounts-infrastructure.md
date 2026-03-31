# v1.0 — Accounts & Infrastructure

**Phase:** v1.0 Full Launch (Q3 2026)
**Goal:** Convert validated MVP users into paying subscribers and prove retention.

## User Accounts

- [ ] Implement email + password registration
- [ ] Implement login / logout flow
- [ ] Encryption passphrase setup during account creation
- [ ] Recovery key generation on account creation
- [ ] Password reset flow (without compromising encryption)
- [ ] Email verification

## Biometric Unlock

- [ ] Face ID support (iOS)
- [ ] Touch ID support (iOS)
- [ ] Biometric as shortcut for passphrase entry on daily app access
- [ ] Fallback to passphrase if biometric fails

## Server Backend

- [ ] API server for encrypted blob storage (Go or Node.js)
- [ ] PostgreSQL database for encrypted data
- [ ] API endpoints: auth, sync, user management
- [ ] Rate limiting and abuse prevention
- [ ] Server stores only ciphertext — zero ability to decrypt

## Encrypted Cloud Sync

- [ ] Sync encrypted data from device to server
- [ ] Sync across multiple iOS devices for same account
- [ ] Conflict resolution strategy (CRDT-based)
- [ ] Incremental sync (only changed records)
- [ ] Handle offline → online sync gracefully
- [ ] Sync status indicator in the app

## Infrastructure

- [ ] CI/CD pipeline for backend deployment
- [ ] Monitoring and alerting (uptime, error rates)
- [ ] Automated backups for PostgreSQL
- [ ] Staging environment for testing
