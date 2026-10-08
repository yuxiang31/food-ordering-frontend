# Savour — good food, great mood

A React and TypeScript food-ordering frontend for a fictional Bangsar neighbourhood catalog. Browse independent kitchens, search and filter meals, customise food, and manage a single cart grouped by restaurant. Guest demo checkout creates one independent demo order per restaurant in a combined receipt.

**Frontend only:** no backend, real authentication, payments, delivery, or actual order submission. Restaurant names, ratings, timings and prices are mock examples. Photography is illustrative and may differ from the listed dish. Checkout asks users to use sample contact details.

## Setup

Use Node.js 22.12+ (Node 24 recommended) and pnpm 11.19.0. From the project root:

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Vite. The project uses three runtime dependencies: React, React DOM, and React Router. CSS Modules and native controls avoid a UI-framework dependency.

## Commands

| Command             | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Local development server                       |
| `pnpm build`        | Strict TypeScript checks and production bundle |
| `pnpm preview`      | Preview the production build locally           |
| `pnpm lint`         | ESLint including React Hooks checks            |
| `pnpm format`       | Format source and documentation                |
| `pnpm format:check` | Verify formatting                              |
| `pnpm test`         | Run business-logic and user-interaction tests  |
| `pnpm test:watch`   | Interactive test runner                        |

The lockfile is committed for reproducible installs. `pnpm-workspace.yaml` permits esbuild's required installation script. For deployment, configure the host to serve `index.html` for unknown frontend paths so direct links and browser refresh work.

## Structure

```text
src/
  app/                    Routes, shell, service composition
  components/ui/          Controls, quantity selector, image fallback, icons, states
  features/
    catalog/              Discovery, details, loading/data hooks
    restaurants/          Restaurant cards and menu page
    cart/                 Reducer, reconciliation, pricing, groups, summary
    checkout/             Guest demo checkout and separate order receipts
    auth/                 Session types and future UI role helper
  services/
    repositories/         Typed contracts and async mock implementations
    api/                  Backend adapter integration documentation
  data/mocks/             Isolated restaurants, categories, menus
  models/                 Shared domain contracts
  styles/                 Semantic design tokens and global foundations
  utils/                  MYR money formatting
  test/                   Shared test setup
```

## Architecture and data boundaries

Pages consume feature hooks and context. Catalog hooks call the `CatalogRepository`; checkout calls the `OrderRepository`. Only the mock repository imports mock fixtures. Services are injected in `app/services.tsx`; tests can inject alternative implementations without rewriting the UI.

The catalog is loaded once at the provider boundary, with cancellation, loading, retry, and error states. This deliberately avoids a query-cache library for the current small dataset. When pagination, frequent refetching or mutation invalidation is needed, a query cache can be introduced behind the same hooks. Checkout is loaded on demand.

Mock repositories are asynchronous, return independent data copies, and support configurable latency, normal/empty/error catalog scenarios and order failures. Create services with `createMockServices({ latency: 0, scenario: 'error' })` for deterministic development or tests; no hidden production debug controls are exposed.

## State and cart conventions

- Repository data: `CatalogProvider` owns loading, errors and retries.
- Cart: Context + pure reducer; no additional global state library.
- Search, category, vegetarian/budget filters and sort: URL query parameters. Browser navigation and reload retain them.
- Options, quantity and checkout form: local state/native form controls.
- Totals: derived using integer sen; formatted with `Intl.NumberFormat` in MYR.

Cart lines are identified by menu ID plus sorted selected option IDs. Identical selections merge, while different options remain separate. Each option group supports one selection; optional groups include a no-extra choice. Quantity is limited to 1–20 per configuration. Decreasing stops at 1; removal is explicit.

The cart accepts multiple restaurants. Each restaurant group displays its own items, subtotal, delivery fee and total. Items and entire restaurant orders can be removed independently. Pickup removes every delivery fee and displays collection addresses. Demo checkout creates one order per restaurant and one combined receipt.

Only versioned cart IDs, options and quantities are saved in `localStorage` under `savour.cart.v1`. Restored entries are structurally checked and reconciled with the current catalog; unknown/unavailable items or invalid options are omitted, and prices are recalculated. Corrupt or unavailable storage never prevents using the cart. Fulfillment resets to delivery on reload. Guest contact details are neither saved to browser storage nor included in the receipt. Receipts use router state for the demo and are not a durable order-history system.

## Future backend integration

1. Implement `CatalogRepository` and `OrderRepository` in `services/api/`.
2. Validate and map responses into the shared models, forward cancellation signals, and normalise failures.
3. Replace the mock adapters in the service composition point.
4. Submit item IDs, option IDs and quantities. The server must determine authoritative prices, fees, availability and fulfillment eligibility.
5. Design a multi-restaurant checkout batch with idempotency and explicit individual order outcomes. Real systems must handle partial restaurant failures and retries without duplicate orders; the mock submission is atomic.
6. Replace the transient receipt with an API-backed order route/history and authoritative statuses.

See `src/services/api/README.md` for integration details. Client-side totals are estimates, not authoritative payment amounts.

## Authentication and authorization

Current behavior is explicitly **guest/no authentication**. The mock `AuthRepository` returns no user and rejects login as unsupported. There is no fake login, credential, token, or client security mechanism.

The authentication contract exposes login, logout and current user. A future session provider can own `SessionState`, resolve the current user during bootstrap, and connect profile pages and route guards. Route guards should wait for session resolution before redirecting. The `hasRole` helper is for presentation only. The real server must enforce permissions on every protected operation. Use the provider's supported session handling; do not add insecure token-storage placeholders.

## UX and accessibility

Warm cream surfaces, terracotta primary actions and green accents communicate a food-focused hierarchy. Semantic CSS tokens cover text, surfaces, borders, focus and status colours. Main navigation, prices and cart actions stay visible. Dedicated food pages support browser history; unnecessary dialogs are avoided.

Mobile layouts stack details, use horizontally scrollable categories and show sticky cart access. Tablet grids use two columns; desktop grids use up to four, with a separate cart summary. Controls have touch-friendly sizing. Images have fixed layout dimensions, lazy loading, descriptive alternatives and a local fallback.

Semantic landmarks, headings, form labels, fieldsets, native radio/checkbox controls, a skip link, visible keyboard focus, route-heading focus and live action feedback support keyboard and screen-reader use. States include loading, empty, error/retry, unavailable, selected and success. Motion respects reduced-motion preferences. Important actions use text or accessible names, rather than colour or icons alone.

## Validation

Automated tests cover selection constraints, integer pricing, multi-restaurant grouping, independent removal, editing/merging, quantity limits, corrupt persisted data, repricing, repository cancellation, empty/error scenarios, search/filter interactions, guest checkout, distinct restaurant receipts and retaining carts after failed submissions. Type checking, lint, formatting and a production build are required checks.

Browser verification should include mobile, tablet and desktop layouts; search/filter/navigation; food options; cart edits/removal; delivery/pickup totals; form validation; keyboard navigation and visible focus. This is accessibility-oriented implementation and testing, not a formal WCAG certification.

Completed checks and browser verification results are recorded in [docs/validation.md](docs/validation.md).

## Known limitations and next steps

- Static fictional catalog; illustrative photos load from Unsplash and require internet access. Production should use licensed, accurate assets on a controlled image CDN.
- No real geolocation/service-area validation, inventory, promotions, tax engine, payments, accounts or order history.
- Demo delivery times and fees are fixed per restaurant. Kitchens do not receive orders.
- Allergy information is not authoritative.
- Cart persistence is local to one browser and does not synchronise across tabs/devices.
- Multi-restaurant submission is atomic in the mock; production must define partial failure, cancellation, refunds and independent delivery semantics.

Next backend work: agree DTOs and fulfillment rules, implement catalog and server-side order validation, design idempotent multi-restaurant checkout, then connect real authentication, order tracking and payments.
