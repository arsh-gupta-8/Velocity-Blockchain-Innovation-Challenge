# Project Requirements Document (PRD): Sustainable Biomass Value Chain Financing Platform

## 1. Project Overview & Objective
A decentralized web platform designed to bridge the financing and supply chain gap between smallholder farming cooperatives/unions and major apparel brands. The platform enables apparel companies to secure sustainable biomass (to replace diesel boilers for decarbonization) while providing farmers with upfront working capital, insurance, and guaranteed purchase contracts.

---

## 2. Target Audience & User Roles
The platform features a dual-portal architecture supporting two distinct user types:
1. **Farmers / Farm Unions:** Looking for reliable buyers, upfront working capital, crop insurance, and contracts to stabilize incomes against climate shocks.
2. **Apparel Companies / Brands:** Looking for certified sustainable biomass sources to meet strict ESG/export mandates (e.g., EU CBAM, ESPR) and drive decarbonization.

---

## 3. Core Functional Requirements

### 3.1. Authentication & Role Selection
* **Onboarding:** Users can sign up and choose their role upon entry (**Farmer / Farm Union** or **Apparel Company**).
* **Role-Based Access Control (RBAC):** Dynamic routing ensures users are directed to the correct dashboard corresponding to their persona.

### 3.2. Marketplace & Discovery Engine
* **Apparel View:** Apparel companies can browse a directory of verified farm unions, viewing metrics such as biomass type, harvest capacity, location, and reputation scores.
* **Farmer View:** Farm unions can browse a directory of registered apparel brands looking for biomass procurement partners.
* **Search & Filters:** Filter by region (e.g., South/Southeast Asia hubs like Sri Lanka, India, Vietnam), volume capacity, and sustainability certifications.

### 3.3. Smart Contract & Contract Request Workflow
* **Bid-Directional Contracting:** 
  * Apparel companies can send contract requests to farm unions.
  * Farm unions can also initiate and request supply contracts from apparel brands.
* **Contract Terms Formulation:** Contracts explicitly codify:
  * **Apparel Obligations:** Provision of working capital advances and insurance backing.
  * **Farmer Obligations:** Commitment to harvest and deliver specific volumes of sustainable biomass.

### 3.4. Reputation & Trust System
* **Rating & Scoring Engine:** Both interfaces display reliability scores and metrics derived from historical platform performance.
* **Transaction Metrics:** Track completed transactions, fulfillment rates, and historical volume delivery to build verified on-chain or platform-native trust profiles.

### 3.5. Climate Risk & Harvest Reporting
* **Disaster Reporting Module:** Farmers have a dedicated reporting interface to log bad harvests or supply chain disruptions caused by natural factors (e.g., droughts, floods, natural disasters).
* **Impact Tracking:** Alerts connected parties to mitigate disputes and adjust financing or delivery timelines dynamically.

---

## 4. User Flow Architecture

```text
[ Landing Page / Auth ]
       │
       ├─► Select: [ Farmer / Farm Union ]
       │      └─► Farmer Dashboard ──► Browse Apparel ──► Request/Accept Contract ──► Log Harvest / Report Disruption
       │
       └─► Select: [ Apparel Company ]
              └─► Apparel Dashboard ──► Browse Farm Unions ──► Request/Accept Contract ──► Monitor Deliveries & Ratings