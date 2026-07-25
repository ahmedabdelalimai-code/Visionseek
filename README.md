# VisionSeek OS

VisionSeek OS is an **Integrated Strategic Opportunity Intelligence & Venture Creation Operating System**. It is being built as a production-oriented modular monolith that turns strategic signals into accountable, human-authorized decisions and learning assets.

> **Canonical lifecycle:** Detect → Verify → Understand → Connect → Decide → Build → Operate → Learn → Compound.

## Sprint 1 scope

Sprint 1 establishes the technical foundation rather than a complete production workflow. It includes a strict TypeScript Next.js application shell, a PostgreSQL schema and migration, runtime validation, API contracts, seed data for a Korea–MENA scenario, locale-aware responsive workspace skeletons, unit tests, and CI automation.

| Capability | Sprint 1 implementation | Status |
|---|---|---|
| Application platform | Next.js App Router with TypeScript strict mode | Implemented |
| Data platform | PostgreSQL with Drizzle typed schema and SQL migration | Implemented |
| Locale architecture | English LTR and Arabic RTL route structure and message catalogs | Implemented |
| Core UI | Decision Inbox, Opportunity Workspace, Evidence Capture, Living Thesis, Decision Record | Skeletons implemented |
| Identity boundary | OIDC-ready provider interface and actor model | Adapter deferred |
| Storage boundary | S3-compatible object-storage interface | Adapter deferred |
| AI boundary | Provider-agnostic AI gateway interface | Adapter deferred |
| Events | Domain event publisher port | Durable outbox deferred |

## Architecture

The system is deliberately a **modular monolith**. It keeps the operational simplicity of one deployable Next.js application while expressing bounded-context boundaries through directory structure and dependency rules. A domain module may depend on shared kernel contracts and application ports, but it must not embed infrastructure-provider logic.

| Bounded context | Responsibility | Sprint 1 location |
|---|---|---|
| Intelligence Collection | Sources, signals, observed market inputs | `src/lib/db/schema.ts` |
| Opportunity Intelligence | Opportunities, theses, claims, readiness | `src/modules/opportunity/` |
| Analytic Integrity | Evidence, confidence change traceability | `src/modules/integrity/` |
| Decision Intelligence | Human decision policy and decision records | `src/modules/decision/` |
| Mission & Venture Execution | Future mission and venture workflow | Reserved boundary |
| Human Capability Intelligence | People/capability intelligence | Reserved boundary |
| Learning & Compound Assets | Reusable learning assets | Reserved boundary |
| Identity & Governance | Actors, OIDC boundary, audit events | `src/lib/auth/`, `actors`, `audit_events` |
| Product Configuration & Packs | Configurable product packs | Reserved boundary |

### Core product invariants

| Rule | Enforcement point |
|---|---|
| An opportunity cannot become `DecisionReady` without an active thesis, evidence, owner, review date, and key gaps. | `evaluateDecisionReadiness` domain policy and readiness API contract |
| Published thesis versions are immutable. | PostgreSQL trigger in `drizzle/0000_sprint_1_foundation.sql` |
| AI cannot approve final decisions. | `assertHumanDecisionAuthority` policy and OpenAPI contract |
| Audit events are immutable. | PostgreSQL trigger in `drizzle/0000_sprint_1_foundation.sql` |
| Confidence changes require a reason and actor. | Zod `ConfidenceChangeSchema` and database table constraints |
| People data is separated from public analytic records. | `actors` table holds person-level fields; analytic entities store only actor references |
| Every opportunity is Tactical, Strategic, or Mixed. | Zod enum and PostgreSQL enum |

### Dependency direction

```text
UI routes/components
        ↓
API contracts and application services
        ↓
Domain policies and shared kernel
        ↓
Ports: database, events, storage, AI, identity
        ↓
Infrastructure adapters
```

The `src/lib/ai`, `src/lib/storage`, `src/lib/auth`, and `src/lib/events` modules define **ports**, not fake production integrations. Concrete providers are deliberately not configured in Sprint 1.

## Repository map

```text
src/
  app/                    Next.js routes, locale-aware workspaces, API endpoints
  components/             Responsive interface skeletons
  contracts/              API and HTTP contracts
  core/                   Lifecycle and identifier shared kernel
  i18n/                   next-intl request and route configuration
  lib/
    ai/                   Provider-agnostic AI gateway port
    auth/                 OIDC-ready identity provider port
    db/                   Drizzle client, typed schema, and seed
    events/               Event publisher port
    storage/              S3-compatible object storage port
    validation/           Runtime Zod schemas
  modules/                Bounded-context policies and application services

drizzle/                  Initial PostgreSQL migration
messages/                 English and Arabic message catalogs
tests/                    Unit tests and fixtures
```

## Local setup

### Prerequisites

| Tool | Required version |
|---|---|
| Node.js | 22 or later |
| npm | 10 or later |
| Docker Compose | v2 or later |
| PostgreSQL | 16, supplied by Docker Compose |

1. Clone the repository and switch to the implementation branch.

   ```bash
   git clone https://github.com/ahmedabdelalimai-code/Visionseek.git
   cd Visionseek
   git switch foundation/sprint-1
   ```

2. Create local configuration and install the locked dependency set.

   ```bash
   cp .env.example .env
   npm ci
   ```

3. Start PostgreSQL and apply the typed migration.

   ```bash
   docker compose up -d db
   npm run db:migrate
   ```

4. Optionally seed the Korea–MENA opportunity scenario, then start the application.

   ```bash
   npm run db:seed
   npm run dev
   ```

The English interface is available at `http://localhost:3000/en`; the Arabic RTL interface is available at `http://localhost:3000/ar`.

## Quality gates

Run the same checks used by the continuous-integration workflow before opening a pull request:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## API contract

The static OpenAPI 3.1 specification is available at [`public/openapi.yaml`](public/openapi.yaml). It describes the health, opportunity creation, decision-readiness, evidence-capture, and decision-recording surfaces.

## Intentional Sprint 1 gaps and assumptions

The following items are explicit **placeholders**, not production integrations. OIDC discovery/token verification, S3 client operations, concrete AI provider calls, durable event outbox delivery, full CRUD workflow persistence, authorization policy enforcement, and production observability remain follow-on work. The data model and interfaces are shaped so these can be added without leaking a provider dependency into the domain modules.

No deployment configuration is included, and this branch is intended for a Draft Pull Request only.
