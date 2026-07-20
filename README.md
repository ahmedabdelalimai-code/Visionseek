# VisionSeek OS

VisionSeek OS is an Integrated Strategic Opportunity Intelligence & Venture Creation Operating System.

## Architecture: Modular Monolith

This project follows a modular monolith architecture to keep domain boundaries explicit while avoiding the complexity of microservices in the early stages.

### Core Bounded Contexts
1. Intelligence Collection
2. Opportunity Intelligence
3. Analytic Integrity
4. Decision Intelligence
5. Mission & Venture Execution
6. Human Capability Intelligence
7. Learning & Compound Assets
8. Identity & Governance
9. Product Configuration & Packs

## Technical Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Validation:** Zod
- **I18n:** next-intl (Arabic RTL & English LTR)
- **CI/CD:** GitHub Actions

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm 9+
- Docker & Docker Compose

### Setup
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Copy environment variables: `cp .env.example .env`
4. Start the database: `docker-compose up -d`
5. Run migrations: `pnpm drizzle-kit push`
6. Start development server: `pnpm dev`

## Sprint 1 Foundation
- Repository structure for modular monolith
- Database schema and initial migration setup
- Runtime validation schemas
- API contracts and OpenAPI spec
- Seed data for Korea–MENA scenario
- Initial UI skeletons for Decision Inbox, Opportunity Workspace, etc.
- RTL/LTR locale architecture
- CI workflow
