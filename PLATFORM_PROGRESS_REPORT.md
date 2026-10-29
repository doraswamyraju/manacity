# ManaCity Platform: Development & Architecture Progress Report
**Date:** October 29, 2026  
**Repository Branch:** `origin/main`  
**Latest Git Commit:** `1531b46`  
**Production Server:** `root@147.93.107.21` (`/var/www/manacity`)

---

## 1. Executive Summary of Today's Work

Today we completed a major series of platform upgrades across the **Landing Page**, **Business Onboarding Flow**, **Super Admin Monetization & Block Management**, and the **Smart Website Builder**:
1. **Landing Page Overhaul & Visual Parity**:
   - Resolved the Hero search dropdown cut-off bug.
   - Restored scenic Tirupati regional branding with floating trust badges.
   - Reused the exact header search bar inside the hero with rotating rainbow gradient and scroll-triggered header reveal.
   - Deduplicated trending listings from live MongoDB and displayed real uploaded logos and cover photos without cropping.
2. **Onboarding Search & Fallback Overhaul**:
   - Added Tirupati geographic coordinate biasing (`lat: 13.6288, lng: 79.4192`, radius: 45km) to Google Places Autocomplete.
   - Added automatic fallback to Google Places TextSearch (`places:searchText`) so colloquial queries (e.g. `garuda paints tirupati`) accurately match verified Google profiles (`Sri Garuda Paints and Hardwares`).
   - Removed fake dummy predictions and added an explicit **"Don't have a Google Profile? Fill Manually ↓"** bypass.
3. **Super Admin Subscription & Builder Pricing Control**:
   - Added dedicated management block in Super Admin (`SubscriptionsTab.jsx`) to edit prices, billing intervals (Annual, Lifetime, Monthly), discounts, and feature checklists for Free Microsite, Smart Builder Add-on, and Pro Platform Suite.
4. **Dynamic Website Block & Layout Library**:
   - Implemented `WebsiteBlockLibrary` in Prisma and built a full Super Admin management view (`WebsiteBlocksTab.jsx`) under **Library Management ➔ Website Blocks & Layouts**.
   - Allows Super Admin and assigned staff to create, categorize, and toggle **Free vs. Pro (Paid)** status on headers, hero layouts, and section components in real time without redeploying code.
5. **In-Builder Domain Search & Buying (ResellerClub)**:
   - Added a dual-tab domain modal in `WebsiteBuilder.jsx`: **Tab 1: Buy New Domain (`.in`, `.com`, `.co.in`, `.org`)** with wholesale cost tracking + custom profit margin (e.g., ₹300 margin) and **Tab 2: Connect Existing Domain (BYOD)** with 1-click GoDaddy DNS jump.

---

## 2. Detailed Technical Breakdown by Component

### A. Landing Page & Directory (`Home.jsx` & `directoryLeadController.js`)
- **Hero Search Dropdown Cut-off Fix**:
  - Replaced `overflow: hidden` on the Hero section container with `overflow: visible` and elevated stacking context (`zIndex: 50` on hero, `zIndex: 100` on hero search container).
  - Search auto-suggestions and category filters now cleanly overlay on top of category tiles without clipping.
- **Card-to-Company Linking**:
  - Clicking the business name or card cover photo directly opens the company's microsite (`https://[subdomain].manacity.in` or `/site/:slug`).
- **Google Reviews & Map Link**:
  - Clicking `★ 4.9 (45 reviews)` opens their verified Google Business Profile on Google Maps in a new tab.
- **Catalog Tags**:
  - Display 2–3 pills for the actual products/services added during onboarding directly under the business card title.
- **Uncropped Logo Badge**:
  - Renders uploaded logos with `object-fit: contain` and white padding so wide or tall logos never get sliced off.

---

### B. Business Onboarding Wizard (`OnboardingWizard.jsx` & `phase1Controller.js`)
- **Tirupati Regional Biasing**:
  - Google Places API calls now send a circular boundary around Tirupati (`13.6288, 79.4192`).
  - Added multi-tier search fallback:
    1. Places API (New v1) Autocomplete with circle bias.
    2. Places API (New v1) `places:searchText`.
    3. Legacy Google Places `textsearch`.
- **Zero-Friction Manual Fallback**:
  - If a business is not registered on Google Maps or Google returns 0 results, an amber prompt appears: *"Use [Typed Name] & Fill Manually"*.
  - Added a direct **"Don't have a Google Profile? Fill Manually ↓"** button that focuses straight on the business name and details form.

---

### C. Super Admin Monetization & Layout Console
- **Configurable Subscription Pricing ([`SubscriptionsTab.jsx`](file:///d:/manacity/web/src/admin/SubscriptionsTab.jsx))**:
  - Backed by the new `PlatformPlanPriceConfig` model in MongoDB.
  - Endpoints: `GET /api/admin/subscription-plans` and `POST /api/admin/subscription-plans`.
  - Supports live editing of prices, intervals (`ANNUAL`, `LIFETIME`, `MONTHLY`), and feature lists.
- **Dynamic Block Library Console ([`WebsiteBlocksTab.jsx`](file:///d:/manacity/web/src/admin/WebsiteBlocksTab.jsx))**:
  - Backed by the new `WebsiteBlockLibrary` model in MongoDB.
  - Endpoints: `GET /api/admin/website-blocks`, `POST /api/admin/website-blocks`, `DELETE /api/admin/website-blocks/:id`.
  - Allows Super Admin to register layout blocks with custom names, categories (`HEADER`, `HERO`, `ABOUT`, `SERVICES`, etc.), preview images, and toggle **FREE vs. PRO (PAID)** access.

---

### D. In-Builder Domain Search & Buying
- **ResellerClub Integration ([`resellerClubService.js`](file:///d:/manacity/backend/src/services/resellerClubService.js))**:
  - Checks domain availability across `.in`, `.co.in`, `.com`, and `.org`.
  - Applies automated retail markup (default: ₹300 margin) over wholesale cost.
  - Includes DNS fallback verification when API credentials are not yet entered in `.env`.
  - Records purchase orders and tracks margins in the `DomainOrder` MongoDB model.
- **Smart Website Builder UI ([`WebsiteBuilder.jsx`](file:///d:/manacity/web/src/pages/WebsiteBuilder.jsx))**:
  - Integrated dual-tab modal:
    - **Tab 1: ✨ Buy New Domain**: Search box with live availability, retail pricing in INR, and 1-click **"Register Now"** button.
    - **Tab 2: Connect Existing Domain (BYOD)**: Direct link to GoDaddy DNS Manager, copyable `A` and `CNAME` records, and live DNS status tester.

---

## 3. Database Schema Additions (`schema.prisma`)

```prisma
// 1. Updated Subscription model
model Subscription {
  id                  String             @id @default(auto()) @map("_id") @db.ObjectId
  businessGroupId     String             @db.ObjectId
  businessGroup       BusinessGroup      @relation(fields: [businessGroupId], references: [id], onDelete: Cascade)
  tier                SubscriptionTier   @default(FREE)
  status              SubscriptionStatus @default(ACTIVE)
  expiresAt           DateTime?
  locationLimit       Int                @default(1)
  websiteLimit        Int                @default(1)
  hasAdvancedBuilder  Boolean            @default(false)
  advancedBuilderPlan String?            // 'ANNUAL' or 'LIFETIME'
  builderExpiresAt    DateTime?
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt
}

// 2. Configurable Subscription & Addon Pricing
model PlatformPlanPriceConfig {
  id                  String   @id @default(auto()) @map("_id") @db.ObjectId
  planKey             String   @unique
  title               String
  description         String?
  priceInr            Float
  interval            String   @default("ANNUAL")
  features            String[]
  isActive            Boolean  @default(true)
  discountPercentage  Float    @default(0.0)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

// 3. Dynamic Website Block & Layout Library
model WebsiteBlockLibrary {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  category       String   // 'HEADER', 'HERO', 'ABOUT', 'SERVICES', 'FEATURES', 'CTA', 'FOOTER'
  name           String
  blockKey       String   @unique
  previewImgUrl  String?
  description    String?
  defaultProps   Json?
  isPremium      Boolean  @default(false)
  status         String   @default("ACTIVE")
  sortOrder      Int      @default(0)
  createdById    String?  @db.ObjectId
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

// 4. ResellerClub Domain Orders & Margin Tracking
model DomainOrder {
  id                 String    @id @default(auto()) @map("_id") @db.ObjectId
  businessGroupId    String    @db.ObjectId
  domain             String    @unique
  tld                String
  years              Int       @default(1)
  costPriceInr       Float
  sellingPriceInr    Float
  profitMarginInr    Float
  resellerOrderId    String?
  paymentGateway     String    @default("RAZORPAY")
  paymentRef         String?
  orderStatus        String    @default("PENDING")
  autoDnsConfigured  Boolean   @default(false)
  expiresAt          DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}
```

---

## 4. Git Commits Pushed Today

| Commit | Description |
|---|---|
| [`25e3851`](file:///d:/manacity) | Unify hero and header search bar, display uploaded logos, deduplicate listings, and polish footer |
| [`33bccdc`](file:///d:/manacity) | Display products/services on cards, add company page & Google Maps review links, fix logo clipping |
| [`f5be3ed`](file:///d:/manacity) | Super Admin dedicated subscription & builder pricing console, block library, and domain order models |
| [`cb06f98`](file:///d:/manacity) | Fix search overlay cut-off, add Tirupati location bias to Google Places, and add manual onboarding fallback |
| [`cb04cc4`](file:///d:/manacity) | Dynamic website blocks library console with real-time layout creation and paywall toggles |
| [`1531b46`](file:///d:/manacity) | In-builder domain search and buying with automated profit margin tracking via ResellerClub |

---

## 5. Deployment Command for VPS

Whenever ready to update the live production server (`147.93.107.21`), execute this 1-line command:

```bash
cd /var/www/manacity && git reset --hard origin/main && git pull origin main && cd backend && npm install && npm run prisma:generate && pm2 restart manacity-backend && cd ../web && npm install && npm run build && systemctl reload nginx
```

---

## 6. Action Items to Resume Tomorrow

1. **Connect Builder UI to Dynamic Blocks**:
   - Update `WebsiteBuilder.jsx` to load header and hero blocks dynamically from `WebsiteBlockLibrary` instead of static templates.
2. **Implement Paywall Upgrade Modal**:
   - When a free business user selects a layout marked `isPremium: true` in the builder, trigger the **"Upgrade to Smart Modular Builder"** modal powered by the prices set in Super Admin.
3. **ResellerClub API Credentials Configuration**:
   - Add `RESELLERCLUB_USER_ID` and `RESELLERCLUB_API_KEY` to `backend/.env` to switch from DNS simulation to live domain booking.
4. **Seed Remaining Header and Hero Component Variants**:
   - Wire the remaining 8 headers and 4 hero components from `project_3999` into ManaCity's dynamic block renderer.
