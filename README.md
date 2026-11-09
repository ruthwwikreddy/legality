# LEGALITY — Digital Legal Services Management Platform

> **Enterprise-grade legal technology platform digitising the complete client-to-counsel lifecycle:** Service request intake, dynamic clause drafting, multi-party electronic agreement execution, and statutory regulatory compliance management.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![IT Act 2000](https://img.shields.io/badge/Section%2010A-IT%20Act%20Compliant-emerald)](https://www.indiacode.nic.in/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

---

## 🔐 Demo Access Credentials

> **Live demo:** Log in directly at [/login](http://localhost:3000/login) with any of the following seeded accounts. No registration required.

| Role | Portal | Email | Password | Access Level |
|---|---|---|---|---|
| **Platform Admin** | `/admin` | `admin@legality.in` | `Admin@123456` | Full system access, all requests, team management |
| **Senior Counsel** | `/admin` | `counsel@legality.in` | `Admin@123456` | Matter management, agreement drafting, client comms |
| **Legal Associate** | `/admin` | `associate@legality.in` | `Admin@123456` | Assigned request work, document upload, updates |
| **Corporate Client** | `/portal` | `client@techcorp.in` | `Client@123456` | TechCorp Solutions — service requests, agreements, compliance |
| **Startup Client** | `/portal` | `client@innovate.in` | `Client@123456` | Innovate BioLabs — service requests, documents, notifications |

> **Quick start tip:** Sign in as `admin@legality.in` to see the full administrative dashboard, then open an incognito window and log in as `client@techcorp.in` to see the client portal simultaneously.

---

## Table of Contents

1. [🔐 Demo Access Credentials](#-demo-access-credentials)
2. [Executive Overview](#executive-overview)
3. [Core Legal Practice Verticals](#core-legal-practice-verticals)
4. [Three-Tier Role-Based Architecture](#three-tier-role-based-architecture)
5. [MOU & Agreement Digital Signing Engine](#mou--agreement-digital-signing-engine)
6. [Complete Feature Matrix](#complete-feature-matrix)
7. [Technology Stack](#technology-stack)
8. [Database Architecture & Data Models](#database-architecture--data-models)
9. [Security & Privileged Data Governance](#security--privileged-data-governance)
10. [Full SEO & Structured Data Architecture](#full-seo--structured-data-architecture)
11. [Local Development & Setup](#local-development--setup)
12. [Environment Variables](#environment-variables)
13. [Seeded Accounts & Test Credentials](#seeded-accounts--test-credentials)
14. [REST API Endpoints Reference](#rest-api-endpoints-reference)
15. [Production Deployment (Vercel & Cloud)](#production-deployment-vercel--cloud)
16. [Regulatory Compliance Disclaimers](#regulatory-compliance-disclaimers)

---

## Executive Overview

**LEGALITY** is built to bridge the operational gap between modern enterprises and specialized legal counsel. By replacing fragmented communication, opaque turnaround times, and physical paper signatures with an entirely digitized workspace, the platform provides:

- **End-to-End Matter Tracking**: Structured client intake through dynamic category forms with real-time status progression.
- **Privileged Communication & Vetting**: Counsel assignment, two-way matter messaging, working draft redlines, and client document delivery.
- **Multi-Party Digital Signing**: Access-code verified signatory execution compliant with **Section 10A of the Information Technology Act, 2000**, accompanied by cryptographic SHA-256 audit certificates.
- **Enterprise Regulatory Compliance**: Active compliance ledgers with authority milestones and interactive checklist toggles.

---

## Core Legal Practice Verticals

The platform digitises four specialized legal workstreams:

| Practice Vertical | Scope of Work | Typical Deliverables |
|---|---|---|
| **1. MOUs & Agreements** | Bilateral & multilateral MOUs, strategic partnership agreements, NDAs, shareholder agreements. | Structured digital contracts, multi-party signing links, audit-certified executed PDFs. |
| **2. Legal Documentation** | Master Services Agreements (MSAs), Statements of Work (SOWs), employment deeds, vendor contracts, IP assignment. | Contract vetting reports, redlined drafts, client-vault fair copies. |
| **3. Permissions & Approvals** | Statutory licences, Pollution Control Board (PCB CTE/CTO) clearances, MCA entity approvals, municipal trade permits. | Statutory checklist, milestone tracking, archived official certificates. |
| **4. Legal Compliance & Governance** | Corporate secretarial filings (ROC/MCA), DPDP Act compliance, labour law registers, covenant enforcement. | Interactive compliance ledger, advance deadline alerts, formal legal notices. |

---

## Three-Tier Role-Based Architecture

Role-based access control (RBAC) is enforced at both the API routing layer and frontend route guards:

```
                                  ┌───────────────────────────┐
                                  │      LEGALITY PLATFORM    │
                                  └─────────────┬─────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
      ┌─────────────────────┐        ┌─────────────────────┐        ┌─────────────────────┐
      │   ADMINISTRATOR     │        │ LEGAL TEAM MEMBER   │        │      CLIENT         │
      │  (Managing Counsel) │        │     (Associate)     │        │  (Enterprise/Corp)  │
      ├─────────────────────┤        ├─────────────────────┤        ├─────────────────────┤
      │ • Full system scope │        │ • Assigned matters  │        │ • Matter submission │
      │ • Matter assignment │        │ • Client messaging  │        │ • Real-time status  │
      │ • Client directory  │        │ • Draft generation  │        │ • Document vault    │
      │ • Staff governance  │        │ • Status updates    │        │ • Review & signing  │
      │ • Global compliance │        │ • Document upload   │        │ • Compliance check  │
      │ • Activity audit    │        │ • Agreement monitor │        │ • Profile dossier   │
      └─────────────────────┘        └─────────────────────┘        └─────────────────────┘
```

### 1. Administrator (`ADMIN`)
- Complete oversight across all clients, active requests, agreements, and firm documents.
- Primary counsel assignment with designated delivery milestones.
- Employee account governance (provisioning, role assignment, account activation/deactivation).
- Immutable system-wide activity audit trail tracking every mutation.

### 2. Legal Team Member (`EMPLOYEE`)
- Access to assigned client matters, background information, and uploaded materials.
- Private internal note drafting (visible exclusively to legal staff).
- Client status updates, revision requests, and deliverable delivery.
- Authoring agreements and monitoring party execution progress.

### 3. Corporate Client (`CLIENT`)
- Account onboarding with corporate identifiers (GSTIN, PAN, business entity type, address).
- Dynamic service request creation with supporting document uploads.
- Secure document repository (distinguishing client uploads from counsel deliverables).
- Electronic agreement review and digital signature execution.
- Real-time notification center and interactive regulatory compliance checklist.

---

## MOU & Agreement Digital Signing Engine

One of the flagship capabilities of LEGALITY is its proprietary electronic signature workflow:

```
  ┌───────────────┐     ┌───────────────────┐     ┌──────────────────┐     ┌─────────────────┐
  │ Admin Drafts  │ ──► │ Unique Token Link │ ──► │ Signer Identity  │ ──► │ Multi-Modal     │
  │ Agreement     │     │ Dispatched to     │     │ Verification     │     │ Digital Signing │
  │ From Template │     │ All Signatories   │     │ (Access Code)    │     │ (Draw/Type/eSign│
  └───────────────┘     └───────────────────┘     └──────────────────┘     └────────┬────────┘
                                                                                    │
                                                                                    ▼
  ┌─────────────────────────────────────────────────────────────────────────────────┴─────────┐
  │                         SERVER-SIDE AUTOMATED PDF COMPILATION                             │
  │  • Formatted A4 Multi-Page Legal Layout                                                   │
  │  • Signatures Section with Exact Timestamps & Legal Declarations                          │
  │  • SHA-256 Cryptographic Audit Trail Certificate (Signer IP, Browser Agent, Checksum)     │
  │  • Section 10A Information Technology Act, 2000 Statutory Compliance Record               │
  └───────────────────────────────────────────────────────────────────────────────────────────┘
```

### Signatory Verification Workflow
1. **Creation**: Administrator selects a pre-loaded template (NDA, MOU, MSA) or authors custom clauses, configuring multiple contracting parties with name, official email, designation, and signing order.
2. **Access Security**: The system generates a cryptographic `secureShareToken` for the agreement and unique `viewToken` + 6-digit `accessCode` for each signatory.
3. **Identity Verification (`/agreements/sign/[token]`)**: The signatory verifies access using their official email or 6-digit code.
4. **Execution Modal**:
   - **Type**: Renders stylized legal signature fonts with timestamp.
   - **Draw**: Interactive HTML5 touch/mouse canvas.
   - **eSign**: Integration placeholder for Indian UIDAI / Aadhaar eSign under Section 10A of the IT Act, 2000.
5. **State Progression**: Updates party status (`PENDING` → `VIEWED` → `REVIEWED` → `SIGNED`). When all parties complete signing, agreement automatically elevates to `FULLY_SIGNED`.
6. **Automated PDF Generation (`pdf-lib`)**: Compiles the final document with an immutable **Audit Trail Certificate** specifying signer identities, UTC timestamps, IP telemetry, and SHA-256 file hashes.

---

## Complete Feature Matrix

### Public Website
- **Home (`/`)**: Value proposition, 4 practice verticals, 4-stage process workflow, Bar Council of India regulatory notice.
- **Services (`/services`)**: In-depth landing pages for all 4 legal services with scopes and deliverables.
- **How It Works (`/how-it-works`)**: Step-by-step breakdown of digital intake, review, signing, and compliance.
- **About (`/about`)**: Operational philosophy, data privacy, and legal integrity standards.
- **Contact (`/contact`)**: Headquarters details, direct counsel phone lines, emergency filing support, and inquiry intake form.

### Client Portal (`/portal/*`)
- **Dashboard (`/portal`)**: Live KPIs (Total Requests, In Review, Pending Signatures, Active Compliance), action alerts.
- **My Requests (`/portal/requests`)**: Filterable request ledger by category and status.
- **New Request (`/portal/requests/new`)**: 4 category-specific dynamic intake schemas with file attachment.
- **Request Details (`/portal/requests/[id]`)**: Status tracker, updates conversation thread, deliverable downloads.
- **Document Vault (`/portal/documents`)**: Categorized client storage with secure upload/download.
- **Agreements Ledger (`/portal/agreements`)**: Signing progress, party badges, access to digital signing flow.
- **Permissions Tracker (`/portal/permissions`)**: Statutory application monitoring with authority details.
- **Compliance Obligations (`/portal/compliance`)**: Regulatory calendar with live task checkboxes.
- **Notification Hub (`/portal/notifications`)**: Real-time alerts with unread counter and 1-click mark-as-read.
- **Company Profile (`/portal/profile`)**: Interactive client dossier with live editing.

### Administrative Console (`/admin/*`)
- **Operations Board (`/admin`)**: 7 live operational metrics, incoming request queue, real-time activity feed.
- **Request Management (`/admin/requests`, `/admin/requests/[id]`)**: Intake vetting, counsel assignment, status change, internal private notes, document delivery.
- **Agreement Center (`/admin/agreements`, `/admin/agreements/[id]`, `/admin/agreements/new`)**: Template-based creation, clause editor, signatory tracking, executed PDF download.
- **Document Repository (`/admin/documents`)**: Master document repository across all clients with client visibility controls.
- **Client Directory (`/admin/clients`, `/admin/clients/[id]`)**: Searchable roster, client profile dossier, historical matters.
- **Team Management (`/admin/team`)**: Provision counsel and associates, role configuration, account toggle.
- **Cross-Client Compliance (`/admin/compliance`)**: Deadline monitoring across all organizations, task checklist management.
- **Activity Audit Trail (`/admin/activity`)**: Chronological system audit log for compliance records.

---

## Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | High-performance server-side rendering, API route handlers, and streaming. |
| **Language** | TypeScript 5 | Strict end-to-end type safety across client, server, and database models. |
| **Styling** | Tailwind CSS 3.4 | Clean, minimal, professional legal styling without bloated CSS runtimes. |
| **Icons** | Lucide React | Consistent, lightweight SVG iconography. |
| **ORM** | Prisma ORM 5.22 | Relational schema definitions, migrations, and type-safe query generation. |
| **Database** | SQLite (Dev) / PostgreSQL (Prod) | Portable zero-config development database; instant migration to PostgreSQL. |
| **Authentication** | `jose` (JWT) + `bcryptjs` | Stateless secure authentication via `httpOnly`, `SameSite=Lax` cookies. |
| **PDF Generation** | `pdf-lib` | Pure JavaScript server-side PDF manipulation with cryptographic SHA-256 hashing. |

---

## Database Architecture & Data Models

The relational schema (`prisma/schema.prisma`) comprises 18 interconnected models:

```prisma
model User {
  id              String             @id @default(cuid())
  email           String             @unique
  passwordHash    String
  role            String             @default("CLIENT") // ADMIN, EMPLOYEE, CLIENT
  fullName        String
  phone           String?
  isActive        Boolean            @default(true)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  clientProfile   ClientProfile?
  employeeProfile EmployeeProfile?
  clientRequests  ServiceRequest[]   @relation("ClientRequests")
  assignedRequests RequestAssignment[]
  updatesCreated  RequestUpdate[]
  internalNotes   InternalNote[]
  documentsUploaded Document[]
  activityLogs    ActivityLog[]
  notifications   Notification[]
  complianceRecords ComplianceRecord[]
}
```

### Key Models Overview:
1. **User & Profiles**: `User`, `ClientProfile`, `EmployeeProfile`
2. **Matters & Requests**: `ServiceRequest`, `RequestAssignment`, `RequestUpdate`, `InternalNote`
3. **Document Vault**: `Document`, `DocumentVersion`
4. **Agreements & Signatures**: `AgreementTemplate`, `Agreement`, `AgreementParty`, `AgreementSignature`
5. **Regulatory Governance**: `ComplianceRecord`, `ComplianceTask`
6. **System Services**: `Notification`, `ActivityLog`

---

## Security & Privileged Data Governance

- **Stateless JWT in HttpOnly Cookies**: Token is isolated from client-side JavaScript, mitigating XSS exposure.
- **Strict Role-Based Middleware**: Access to `/admin/*` is restricted to `ADMIN` and `EMPLOYEE` roles; clients attempting admin access are automatically redirected to `/portal`.
- **Private Internal Notes**: Internal strategy discussions (`InternalNote`) are strictly filtered from all client-facing queries.
- **Document Visibility Toggles**: Documents marked `isClientVisible: false` are accessible solely to legal staff.
- **Cryptographic Document Verification**: Executed PDFs generate an on-the-fly SHA-256 checksum to prevent post-execution tampering.
- **Comprehensive Audit Trail**: Every sensitive action (login, status transition, assignment, upload, signature) creates an immutable record in `ActivityLog`.

---

## Full SEO & Structured Data Architecture

LEGALITY features a complete, search-engine-optimized structure:

- **Dynamic Sitemap (`/sitemap.xml`)**: Automatically served via `src/app/sitemap.ts` with change frequencies and page priorities.
- **Robots Directives (`/robots.txt`)**: Configured in `src/app/robots.ts` to index public marketing pages while safeguarding private authenticated portals and one-time signing links.
- **Structured JSON-LD (`schema.org/LegalService`)**: Embedded in the root HTML head, defining service offerings, business hours, and headquarters coordinates for Google Rich Results.
- **Dedicated Layout Metadata**: Individual `layout.tsx` metadata definitions for `/services`, `/about`, `/how-it-works`, `/contact`, `/login`, and `/register`.
- **OpenGraph & Twitter Cards**: High-definition social card previews across LinkedIn, Twitter/X, and messaging apps.

---

## Local Development & Setup

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+ or yarn / pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ruthwwikreddy/legality.git
cd legality
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
JWT_SECRET=legality-super-secure-jwt-key-minimum-32-chars-2024
NEXTAUTH_URL=http://localhost:3000
```

### 3. Initialize & Seed Database
```bash
# Push database schema to local SQLite database
npx prisma db push

# Run the seeding script to populate default legal accounts & templates
node prisma/seed.js
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Seeded Accounts & Test Credentials

The database comes pre-seeded with five realistic Indian legal personas covering all three roles:

### Staff & Counsel Accounts (access `/admin`)

| Role | Full Name | Email | Password | Designation |
|---|---|---|---|---|
| **Administrator** | Arjun Kapoor | `admin@legality.in` | `Admin@123456` | Managing Partner |
| **Senior Counsel** | Adv. Ananya Deshmukh | `counsel@legality.in` | `Admin@123456` | Senior Legal Counsel |
| **Legal Associate** | Rohan Mehra | `associate@legality.in` | `Admin@123456` | Legal Associate |

### Client Accounts (access `/portal`)

| Client Name | Organization | Email | Password |
|---|---|---|---|
| Rajesh Sharma | TechCorp Solutions Pvt. Ltd. | `client@techcorp.in` | `Client@123456` |
| Dr. Priya Nambiar | Innovate BioLabs LLP | `client@innovate.in` | `Client@123456` |

New client accounts can be created anytime at `/register`.

---

## REST API Endpoints Reference

All endpoints enforce strict authentication and dynamic evaluation (`export const dynamic = 'force-dynamic'`).

### Authentication
- `POST /api/auth/register` — Register a new corporate client account.
- `POST /api/auth/login` — Sign in and receive secure `legality_token` cookie.
- `GET  /api/auth/me` — Retrieve current authenticated user profile.
- `PATCH /api/auth/me` — Update authenticated user profile and company dossier.
- `POST /api/auth/logout` — Terminate session and clear cookie.

### Service Requests
- `GET  /api/requests` — List service requests (role-filtered).
- `POST /api/requests` — Submit a new service request with category schema.
- `GET  /api/requests/[id]` — Retrieve request details, assignments, and updates.
- `PATCH /api/requests/[id]/status` — Update matter progression status (staff only).
- `POST /api/requests/[id]/assignments` — Assign primary counsel (admin only).
- `POST /api/requests/[id]/updates` — Post a message to the matter timeline.
- `POST /api/requests/[id]/notes` — Add a private internal note (staff only).

### Agreements & Electronic Signing
- `GET  /api/agreements` — List agreements for authenticated user.
- `POST /api/agreements` — Create a new agreement with multi-party signatories.
- `GET  /api/agreements/[id]` — Retrieve agreement clauses and signing progress.
- `PATCH /api/agreements/[id]` — Update agreement draft content or status.
- `GET  /api/agreements/[id]/download` — Download audit-certified executed PDF.
- `GET  /api/agreements/sign/[token]` — Retrieve agreement via secure access token.
- `POST /api/agreements/sign/[token]/verify` — Verify party identity via access code.
- `POST /api/agreements/sign/[token]/execute` — Register digital signature and compile PDF.

### Document Vault
- `GET  /api/documents` — List documents (client vs firm visibility).
- `POST /api/documents/upload` — Upload supporting file or legal draft.
- `GET  /api/documents/[id]/download` — Download privileged document file.

### Compliance & Admin
- `GET  /api/compliance` — List regulatory compliance obligations.
- `POST /api/compliance` — Create compliance record with statutory deadline.
- `PATCH /api/compliance/[id]/tasks/[taskId]` — Check off statutory subtask.
- `GET  /api/admin/metrics` — Aggregate 7 executive KPIs.
- `GET  /api/admin/clients` — Searchable corporate client directory.
- `GET  /api/admin/team` — List legal staff and assignment counts.
- `POST /api/admin/team` — Provision new attorney or associate.
- `PATCH /api/admin/team/[id]` — Toggle employee account status.
- `GET  /api/admin/activity` — Chronological immutable audit trail.

---

## Production Deployment (Vercel & Cloud)

### Deploying to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **Add New Project** and import **`legality`**.
3. Configure the **Environment Variables**:
   ```
   JWT_SECRET=your-production-secure-random-key-minimum-32-chars
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```
4. The deployment build script is pre-configured in `package.json`:
   ```json
   "build": "prisma generate && prisma db push --accept-data-loss && node prisma/seed.js && next build",
   "postinstall": "prisma generate"
   ```
   *Vercel will automatically generate the Prisma Client, synchronize database tables, seed initial legal templates, and compile all static and dynamic routes.*

### Migrating to Production PostgreSQL (Supabase / Neon / AWS RDS)

To switch from local SQLite to PostgreSQL in production:
1. Update `datasource` in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL="postgresql://user:password@host:5432/legality"` in your production environment variables.
3. Run `npx prisma db push` to initialize PostgreSQL tables.

---

## Regulatory Compliance Disclaimers

> **Bar Council of India Disclaimer**: As per the rules of the Bar Council of India, law firms and advocates are not permitted to solicit work or advertise. The information provided across this platform is intended solely for client administration, record keeping, and operational workflow management.

> **Section 10A IT Act Compliance Notice**: Electronic contracts and digital signatures executed on LEGALITY are structured in alignment with Section 10A of the Information Technology Act, 2000 (India), which provides statutory recognition to contracts formed and executed through electronic means.

---

© 2026 LEGALITY Services. All rights reserved.
