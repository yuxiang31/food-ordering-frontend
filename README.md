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

