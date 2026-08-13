# Customer Referral & Commission Program - Implementation & Roadmap Status

This document records the complete specification, architecture, implemented web features, and future mobile app roadmap for the **Customer Referral & Commission Program** in `manacity`.

---

## 📌 Status Summary

| Phase | Feature / Component | Status | Details |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Database Models & Schema | **COMPLETED & DEPLOYED** | Prisma models added: `ReferralCode`, `Referral`, `ReferralCommission`, `ReferrerPayoutProfile`, `ReferralPayout`, `ReferralProgramConfig`. |
| **Phase 2** | Backend APIs & Controllers | **COMPLETED & DEPLOYED** | `/api/referrals/` endpoints for link generation, stats, catalog rewards, payout setup, click/conversion tracking, and admin payout processing. |
| **Phase 3** | Web Referrer Dashboard | **COMPLETED & DEPLOYED** | `UserReferralDashboard.jsx` integrated into Business Admin & Customer member sidebars. Includes WhatsApp share, QR code modal, stats, catalog rewards, and payout setup. |
| **Phase 4** | Web Admin Control Console | **COMPLETED & DEPLOYED** | `AdminReferralManagement.jsx` integrated into Super Admin sidebar. Includes payout processing queue (UTR entry & status), per-product commission customizer, and program config rules. |
| **Phase 5** | Automated Cookie & Link Tracking | **COMPLETED & DEPLOYED** | Global `?ref=` query param tracking hook added in `App.jsx`. |
| **Phase 6** | Mobile App Integration (Android / iOS) | **PLANNED (FUTURE PHASE)** | Native Mobile UI screens for Refer & Earn, deep linking, native share sheet, and withdrawal requests. |

---

## 1. System Architecture & Workflows

```
[ Admin / Business Owner ]
       │  (1) Configures Global Rules & Per-Product Commission Rates (% or Flat ₹)
       ▼
[ Product & Service Catalog / Storefront ]
       │  (2) Displays Products & Services on Web & Apps with estimated referral earnings
       ▼
[ Referrer / Customer ]
       │  (3) Generates unique referral link (REF-XXXXXX) or item-specific link & QR code
       ▼
[ Referred Buyer / Friend ]
       │  (4) Clicks link (Cookie stored for 30 days) & completes Product/Service purchase
       ▼
[ Conversion Engine ]
       │  (5) Calculates commission & creates ReferralCommission (Status: PENDING_VERIFICATION - 14-day holding period)
       ▼
[ Admin Console ] ───────── (6) Admin Reviews & Approves Payout Queue ───► [ Bank / UPI Transfer ]
       │
[ User Dashboard ]  ◄────── (7) Referrer tracks live sales, holding balance, available balance & requests withdrawal
```

---

## 2. Database Models (`backend/prisma/schema.prisma`)

```prisma
enum ReferralStatus {
  CLICKED
  LEAD_CREATED
  CONVERTED
  CANCELLED
  REFUNDED
}

enum CommissionStatus {
  PENDING_VERIFICATION
  APPROVED
  REJECTED
  PAYOUT_REQUESTED
  PAID
}

enum PayoutMethod {
  UPI
  BANK_TRANSFER
}

model ReferralCode {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  code        String   @unique
  totalClicks Int      @default(0)
  createdAt   DateTime @default(now())

  referrals   Referral[]
}

model Referral {
  id              String           @id @default(auto()) @map("_id") @db.ObjectId
  referralCodeId  String           @db.ObjectId
  referralCode    ReferralCode     @relation(fields: [referralCodeId], references: [id], onDelete: Cascade)
  referrerUserId  String           @db.ObjectId
  
  referredEmail   String?
  referredPhone   String?
  ipAddress       String?
  userAgent       String?
  
  status          ReferralStatus   @default(CLICKED)
  
  itemType        String?          // "PRODUCT", "SERVICE", "SUBSCRIPTION"
  itemId          String?          @db.ObjectId
  itemName        String?
  orderId         String?
  saleAmount      Float?
  
  commissions     ReferralCommission[]
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

model ReferralCommission {
  id             String           @id @default(auto()) @map("_id") @db.ObjectId
  referralId     String           @db.ObjectId
  referral       Referral         @relation(fields: [referralId], references: [id], onDelete: Cascade)
  userId         String           @db.ObjectId
  user           User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  saleAmount     Float
  commissionRate Float
  earnedAmount   Float
  currency       String           @default("INR")
  
  status         CommissionStatus @default(PENDING_VERIFICATION)
  payoutId       String?          @db.ObjectId
  payout         ReferralPayout?  @relation(fields: [payoutId], references: [id])
  
  eligibleAt     DateTime
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}

model ReferrerPayoutProfile {
  id             String       @id @default(auto()) @map("_id") @db.ObjectId
  userId         String       @unique @db.ObjectId
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  payoutMethod   PayoutMethod @default(UPI)
  upiId          String?
  accountHolder  String?
  accountNumber  String?
  ifscCode       String?
  panNumber      String?
  
  isVerified     Boolean      @default(false)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model ReferralPayout {
  id              String               @id @default(auto()) @map("_id") @db.ObjectId
  userId          String               @db.ObjectId
  user            User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  totalAmount     Float
  currency        String               @default("INR")
  
  status          CommissionStatus     @default(PAYOUT_REQUESTED)
  paymentRef      String?
  proofReceiptUrl String?
  processedBy     String?              @db.ObjectId
  processedAt     DateTime?
  adminNotes      String?
  
  commissions     ReferralCommission[]
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
}

model ReferralProgramConfig {
  id                  String   @id @default(auto()) @map("_id") @db.ObjectId
  isEnabled           Boolean  @default(true)
  commissionType      String   @default("PERCENTAGE") // PERCENTAGE or FLAT
  commissionValue     Float    @default(10.0)
  minimumPayoutAmount Float    @default(500.0)
  holdingPeriodDays   Int      @default(14)
  cookieValidityDays  Int      @default(30)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

---

## 3. Backend API Specification (`/api/referrals/`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/referrals/click` | Public | Tracks referral link clicks and increments counter. |
| `POST` | `/api/referrals/conversion` | Public/Internal | Attributes sale/lead conversion and generates commission. |
| `GET` | `/api/referrals/code` | Authenticated | Gets or generates current user's referral code (`REF-XXXXXX`). |
| `GET` | `/api/referrals/stats` | Authenticated | Retrieves user earnings stats, ledger, payout profile, and withdrawal history. |
| `GET` | `/api/referrals/catalog` | Authenticated | Lists all catalog items with estimated referral rewards (% or ₹). |
| `POST` | `/api/referrals/payout-profile` | Authenticated | Saves/updates user UPI ID or Bank account details. |
| `POST` | `/api/referrals/request-payout` | Authenticated | Submits cash withdrawal request when balance ≥ ₹500. |
| `GET` | `/api/referrals/admin/overview` | Admin | Retrieves total program metrics (revenue, total paid, pending requests). |
| `PUT` | `/api/referrals/admin/config` | Admin | Updates global program rules (commission %, holding period, min limit). |
| `GET` | `/api/referrals/admin/commissions` | Admin | Fetches master referral commission ledger for audit. |
| `PATCH` | `/api/referrals/admin/commissions/:id/status` | Admin | Manually overrides commission status. |
| `GET` | `/api/referrals/admin/payouts` | Admin | Lists pending payout requests with user bank details. |
| `POST` | `/api/referrals/admin/payouts/:id/process` | Admin | Approves/rejects payout and logs bank UTR reference. |
| `PATCH` | `/api/referrals/admin/item-commission` | Admin | Customizes referral rate per product/service item. |

---

## 4. Web Frontend Components

1. **`UserReferralDashboard.jsx` (`web/src/pages/referral/UserReferralDashboard.jsx`)**:
   - Integrated into `AdminSidebar.jsx` and `CustomerSidebar.jsx` under **Refer & Earn**.
   - Contains unique link generator, copy link button, WhatsApp 1-click sharing, QR code generator modal.
   - Displays real-time KPI cards for *Total Clicks*, *Converted Referrals*, *Total Earned Income*, *Holding Balance (14d)*, and *Available Balance*.
   - Includes **Product & Service Catalog Tab** for item-level referral link sharing.
   - Includes **Sales Breakdown Ledger** with obfuscated buyer info (`a***n@gmail.com`).
   - Includes **Payout Setup Modal** for entering UPI ID or Bank Details.

2. **`AdminReferralManagement.jsx` (`web/src/pages/referral/AdminReferralManagement.jsx`)**:
   - Integrated into `SuperAdminSidebar.jsx` under **Referral Program**.
   - Includes **Payout Request Queue** with direct recipient UPI/Bank info and UTR entry.
   - Includes **Per-Item Rate Customizer** for individual product/service overrides.
   - Includes **Master Ledger** and **Program Rules Form**.

---

## 5. Next Steps for Future Mobile App Phase

When building the native mobile app (Android / iOS):
1. **Deep Linking**: Implement Firebase Dynamic Links or Universal Links for `https://manacity.in/?ref=REF-XXXXXX` to route app installs directly to the referrer.
2. **Native Share Sheet**: Use device native sharing APIs (`Share.share`) for WhatsApp, SMS, and Social Media.
3. **Mobile Refer & Earn Screen**: Consume the existing `/api/referrals/stats` and `/api/referrals/catalog` REST endpoints.
