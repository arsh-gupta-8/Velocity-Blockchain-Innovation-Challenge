# Terra — Apparel Company Frontend

Local frontend prototype for the Sustainable Biomass Value Chain Financing Platform. **Terra** and **Northline Apparel** are working demo names, not confirmed product branding or real participants.

## Run locally

Use a current Node.js version satisfying the Vite engine in the existing lockfile (Node 22.12+ or a supported newer release).

```bash
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite. `npm run build` creates the production bundle; `npm run preview` serves it locally.

## Included flows

- Buyer overview with metrics derived from the current sample contracts, incoming proposal, and delivery alert.
- Cooperative marketplace: text search, country, biomass, minimum capacity, sustainability documentation, and sorting.
- Supplier profile with sourcing information, capacity, fulfillment history, and sample ratings.
- Two-step contract request: whole-tonne volume, USD unit price, advance percentage, future delivery date, insurance-support proposal, and notes. Native form validation and a final demo acknowledgement precede submission.
- Contract management: inbound proposal acceptance/decline, outbound cancellation, demo advance recording, sample delivery recording (up to 10 tonnes per action), completion, and delivery-alert acknowledgement.
- Browser-local persistence, reset confirmation, toast feedback, empty states, responsive layouts, reduced-motion support, labelled controls, and keyboard-operable dialogs with focus trapping and return.

## Demo boundaries

Every company, cooperative, price, capacity, rating, certification/documentation status, insurance commitment, and agreement is fictional. No carbon benefit is calculated or claimed. A permanent notice identifies the sample workspace; commitment and recording actions make their demo behavior explicit.

No authentication, backend, wallet, legal signature, payment, Stellar submission, or insurance-provider integration is implemented. The current repository’s Solidity/Hardhat contracts are not integrated into this UI. Sample transactions only change React state and browser storage. A deployment must replace these actions with agreed service/contract interfaces and verified data.

This is the apparel portal only. It does not implement farmer onboarding or disaster reporting. Buyers can view an illustrative cooperative-reported delivery disruption.

## Files and integration points

- `src/index.css`: shared visual tokens, resets, typography, surface colors, and palette utilities.
- `src/App.css`: responsive portal layouts and reusable component styles.
- `src/components/ui.jsx`: `Icon`, `Button`, `Badge`, `StatusBadge`, `SupplierAvatar`, `EmptyState`, and accessible `Modal`.
- `src/components/ContractRequest.jsx`: request form and review step.
- `src/data/demo.js`: isolated fictional fixtures, display helpers, and persisted-record validation.
- `src/hooks/useDemoContracts.js`: versioned sample persistence and reset. Storage key: `terra-apparel-contracts-v1`. Storage failures fall back to session state.
- `src/App.jsx`: navigation, pages, and demo action handlers (`createContract`, `updateContract`, `confirmAction`), the points to replace when real interfaces are available.

Hash navigation supports `#overview`, `#cooperatives`, and `#contracts`. It needs no server rewrite rules. No additional runtime dependencies were added. See `THEME.md` to reuse the theme in the farmer portal.
