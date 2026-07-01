# ManaCity - Stage-by-Stage Execution Plan (Version 1.0)

This document outlines the detailed, stage-by-stage technical execution plan for building the ManaCity platform foundation. The application is architected as a monorepo containing the backend service, web dashboard/landing pages, and native Android and iOS client apps.

---

## Stage 1: Core Foundation & Database Design

### Goal
Establish the monorepo workspace structure, initialize core projects, and deploy the unified database schema that supports multi-tenancy, gamification, and mock Google Business Profiles.

### Proposed Changes

#### [Folder Structure](file:///d:/manacity)
Create the directory structure:
* `/backend` - Node.js + Express + Prisma + MongoDB API server (running on Port 5009)
* `/web` - React/Vite web application (Dashboard & Public Landing Pages)
* `/android` - Android Studio Native Kotlin project
* `/ios` - Xcode Native Swift project

#### [schema.prisma](file:///d:/manacity/backend/prisma/schema.prisma)
Define relational database models optimized for MongoDB covering:
* `User` (Auth, profiles, roles: Business Owner vs. Super Admin)
* `Business` (Multi-location support: `BusinessGroup` and `Location` models)
* `Subscription` (Plans, states, usage counters)
* `Task` & `TaskProgress` (XP points, completion state, categories)
* `Review` & `ReplyTemplate` (Manual reviews, response templates, ratings)
* `Website` (Config, styling, domain setup, pages JSON)
* `Customer` (CRM, lead capture details)

---

## Stage 2: Authentication & Session Management

### Goal
Implement secure multi-platform authentication (Email/Password & Google OAuth) with session tokens valid for Web, Android, and iOS.

### Proposed Changes
* **Backend:** Implement JWT-based signup, login, password reset, and email verification endpoints. Set up Google OAuth token verification flow.
* **Web UI:** Create responsive Auth screens (Login, Register, Forgot Password, Verify Email) with premium styling and smooth animations.
* **Android (Kotlin):** Integrate Firebase Auth / native Google Sign-In SDK and build the login Jetpack Compose screens.
* **iOS (Swift):** Build Swift login view using SwiftUI, Keychain services for secure token storage, and Sign In with Apple/Google.

---

## Stage 3: Business & Multi-Location Registration

### Goal
Allow business owners to register a parent business profile and manage multiple branches/locations under a single dashboard account.

### Proposed Changes
* **Backend API:** Create endpoints to CRUD locations, upload gallery assets (integrated with Cloud Storage), and save operating hours, categories, services, and social links.
* **Web/Mobile Clients:** Design step-by-step registration wizard. Users configure profile photos, logos, products, services, and location details.

---

## Stage 4: Subscription & Limits System (Module 4)

### Goal
Implement the subscription engine restricting features and location counts based on the active tier (Free, Starter, Growth, Premium, Agency, Enterprise).

### Proposed Changes
* **Backend middleware:** Rate limits and feature gates checking the business’s current tier.
* **Billing System:** Integrate Stripe in test mode (or mock billing framework) to handle plan upgrades, renewals, and invoice generation.

---

## Stage 5: Smart Tasks Engine & Gamified Business Score (Modules 6 & 7)

### Goal
Introduce the gamified loop where business owners improve their overall score and earn rewards by performing operations.

### Proposed Changes
* **Backend Engine:**
  * Auto-generate tasks based on profile completeness (e.g., "Add Business Hours" -> 50 XP).
  * Calculate scores dynamically across categories: Profile, Activity, Trust, Reviews, Website, and Photos.
  * Define XP levels, streaks tracker, and badges rewards logic.
* **Web & Mobile Dashboards:** Visual gauges showing real-time scores, active streaks, task lists with XP progress bars, and unlocked badges.

---

## Stage 6: Smart Website Builder & Tourism Templates (Modules 8 & 11)

### Goal
Generate and host static or dynamically generated SEO-friendly websites using the business profile information.

### Proposed Changes
* **Builder Engine:** Dynamic page generation engine mapping database business details (About, Products, Gallery, Reviews) to a selected template.
* **Tourism Templates:** Pre-designed CSS/HTML components for Hotels, Travel Agencies, Taxis, Tour Operators, and Homestays.
* **Hosting/Routing:** Serve generated sites on subdomains (e.g., `businessname.manacity.com`) with preliminary custom domain routing support.

---

## Stage 7: Smart Reviews & Request Campaigns (Modules 9 & 10)

### Goal
Provide review gathering tools and manual review management before the Google API sync is activated.

### Proposed Changes
* **Review Landing Page:** A public landing page where customers can rate their experience and write feedback.
* **Review Request Engine:** Generator for:
  * QR Codes (pointing to the Review Landing Page).
  * Email / SMS templates.
  * WhatsApp redirection links.
* **Review Management Hub:** A dashboard panel to read reviews, mark sentiment, draft replies, and apply AI/pre-built templates.

---

## Stage 8: Media Library, CRM & Communications (Modules 12, 13, 14, 16)

### Goal
Centralize reusable content, customer contacts, media assets, and push notifications.

### Proposed Changes
* **Media Library:** Folder structures for Logos, Gallery, and Banners.
* **Customer CRM:** Lead capture databases, client interaction notes, status pipelines.
* **Notification Dispatcher:** In-app notifications feed, email alerts (using Nodemailer/SendGrid), and Push Notifications (via Firebase Cloud Messaging for Android & iOS).

---

## Stage 9: Super Admin & Reporting (Modules 17 & 18)

### Goal
Manage platform metrics, system users, global subscription plans, billing audits, and global notification broadcasts.

### Proposed Changes
* **Super Admin Portal:** Exclusive view showing audit logs, system-wide analytics, pricing configurations, and customer support tickets.
* **Report Generator:** Weekly/Monthly PDF email summaries showing task progress, site visits, and review stats.

---

## Stage 10: Google Business Profile API Readiness & Verification (Module 20)

### Goal
Launch public-facing assets to satisfy Google's verification process for full API access.

### Proposed Changes
* **Public Site:** Premium main landing page with interactive feature breakdowns, pricing tables, FAQ, Documentation, and Support contact pages.
* **Compliance Pages:** Privacy Policy, Terms of Service, and OAuth Consent screen assets matching Google's guidelines.

---

## Verification Plan

### Automated Tests
* **Backend:** Jest unit tests verifying database transactions, token verification, and score math.
* **Web UI:** Cypress/Playwright flows for registration and site generation.

### Manual Verification
* Deploy mock endpoints. Connect native Android emulator and iOS simulator to mock backend API, verifying offline capabilities and state updates.
