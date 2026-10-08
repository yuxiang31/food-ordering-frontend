# API adapter boundary

Implement CatalogRepository and OrderRepository from ../repositories/contracts.ts here when a backend is available, then replace the services in src/app/services.tsx. Components must not fetch URLs or import mock fixtures.

Adapters own base URL configuration, AbortSignal forwarding, response validation/mapping, and conversion of server/network errors to ServiceError. Submit menu IDs, selected option IDs, quantities, fulfillment and guest details; the server must calculate authoritative prices, fees, stock and permissions. Do not trust client totals. Use a checkout batch/idempotency key and explicit per-restaurant outcomes to handle partial failures when the real multi-restaurant endpoint is designed. The current demo submission is atomic and cannot model distributed fulfillment.

Future authentication should use the provider's supported session mechanism (prefer secure HttpOnly cookies where appropriate), handle CSRF as required, and enforce authorization on the server. No token-storage placeholder is provided.
