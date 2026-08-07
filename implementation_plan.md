# ManaCity - Architecture, Roles & Phase 1 Execution Plan (v3.0)

This document details the refined role structure, public aggregator portal (`manacity.in`), Super Admin controls, and the updated Phase 1–3 execution plan for ManaCity.

---

## 1. User Roles & Access Architecture

1. **Super Admin (Platform Owner - Us):**
   - Full control over `manacity.in` frontend, listing moderation, category management, platform analytics, billing, user access, and system-wide settings.
2. **Admin / Business Owner:**
   - Signs up, connects Google Places API / imports business profile, creates automated website, manages products/services, views lead analytics, and configures optional marketplace add-ons.
3. **End-User / Customer:**
   - Public visitors searching for products, services, or local businesses on `manacity.in` (Justdial-style local aggregator portal) or visiting specific business subdomains (`[city].manacity.in/[business-slug]`). Can generate leads via Call, WhatsApp, and Inquiry forms.

---

## 2. Updated Phase 1 Execution Sequence (MVP Focus)

### Step 1: Public Aggregator Portal (`manacity.in`)
- **Justdial-style Local Directory & Search:**
  - Search bar (Search by Product, Service, Business Name, or City).
  - City selector & Category grids (e.g., Digital Marketing, Rice Mills, Clinics, Hotels).
  - Rich business cards with ratings, phone/WhatsApp lead buttons, operating status, and direct link to 1-Click Generated Website.
  - SEO-optimized directory routes (`manacity.in/[city]/[category]` and `[city].manacity.in/[business-slug]`).

### Step 2: Super Admin Management Dashboard
- Control center to manage public frontend content, categories, global product/service library items, directory listings moderation, user roles, and platform metrics.

### Step 3: Admin (Business Owner) Onboarding & Places Integration
- Signup/Login wizard.
- Google Places API business search & 1-click import.
- Instant 1-Click Website generator + centralized library selector.
- Business Dashboard showing daily leads, call clicks, WhatsApp clicks, and Let's Track telemetry.

---

## 3. Detailed Stage-by-Stage Plan

### Stage 1: Role-Based DB Schema & Aggregator Core
* **Prisma Models:**
  * `User` (Roles: `SUPER_ADMIN`, `BUSINESS_OWNER`, `CUSTOMER`).
  * `DirectoryListing` (Aggregator search index, category tags, city routing, lead metrics).
  * `ProductServiceLibrary` (Master global catalog managed by Super Admin).
  * `Lead` & `LetsTrackVisitor` (Multi-tenant lead dispatcher & telemetry).

### Stage 2: Public Aggregator Web UI (`manacity.in`)
* **React/Vite App (`/web`):**
  * Homepage aggregator UI: Hero search, City picker, Featured categories, Trending local businesses.
  * Search Results & Category Listing Pages with filtering by rating, city, and category.
  * Business Detail & Lead Modal (Direct Call & WhatsApp integration).

### Stage 3: Super Admin Portal
* Admin management screens: Listing approval, Category management, Product/Service master library editor, and platform lead analytics.

### Stage 4: Admin (Business Owner) 2-Minute Onboarding & 1-Click Builder
* 1-Click Google Places import -> Instant Website layout -> Lead Dashboard & Let's Track activation.

---

## 4. Verification Plan

### Automated Tests
* Jest API tests for role-based authentication (`SUPER_ADMIN` vs `BUSINESS_OWNER` vs public `CUSTOMER`).
* Search index query verification for products, services, and categories on `manacity.in`.

### Manual Verification
* Test public searching on `manacity.in` aggregator homepage.
* Verify Super Admin control panel actions.
* Verify 2-minute Business Owner onboarding flow.


---

## Add-on Marketplace (Cross-Plan Modular Subscriptions)

Business owners can enable optional modular features on any plan:

| Add-on Module | Monthly Price | Core Capabilities |
| :--- | :---: | :--- |
| **Let's Track (5 users)** | ₹99 | Team location and visitor tracking |
| **CRM / Lead Management** | ₹99 | Pipeline management, customer notes, follow-up reminders |
| **Inventory Management** | ₹99 | Stock tracking, low-stock alerts, product catalog sync |
| **Billing & Invoicing** | ₹99 | Quick invoice creation, payment status, GST receipts |
| **QR Review System** | ₹99 | Custom printable QR codes & instant review landing pages |
| **WhatsApp Automation** | ₹149 | Automated lead notifications & WhatsApp messaging workflows |
| **Appointment Booking** | ₹99 | Calendar sync, booking slot management, reminder alerts |
| **Staff Management** | ₹99 | Role permissions, staff activity logs, shift scheduling |
| **AI Image Generation** | Usage / Sub | Pay-per-use AI banner & product photo generator |

---

## Verification Plan

### Automated Tests
* **Backend:** Unit/Integration tests with Jest for Google Places importer, catalog search, Let's Track tenant routing, lead tracking, and pricing engine.
* **Web UI:** End-to-end tests for 2-minute onboarding flow, website dynamic rendering, and catalog updates.

### Manual Verification
* Test onboarding wizard using Google Places search and verify complete section generation.
* Test Let's Track notification pipeline across web and mobile endpoints.
* Verify directory subdomains (`city.manacity.in/business`) and lead tracking counters.

