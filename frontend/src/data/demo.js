// Fictional fixtures. No supplier, certification, rating, or impact is verified.
export const cooperatives = [
  { id: 'ceylon', name: 'Ceylon Harvest Union', initials: 'CH', country: 'Sri Lanka', region: 'Kurunegala', material: 'Rice husk', capacity: 240, price: 82, rating: 4.9, fulfillment: 98, completed: 32, farmers: 186, certification: 'Sustainability documented', color: 'sage', description: 'A farmer-owned cooperative collecting rice husk from smallholder farms across Sri Lanka’s North Western Province.', moisture: '12–15%', energy: '13–15 MJ/kg', leadTime: '2–3 weeks', pesticide: 'Supplier declaration available', practices: ['Agricultural residue sourcing', 'Batch-level origin records', 'Shared collection and transport'] },
  { id: 'mekong', name: 'Mekong Growers Collective', initials: 'MG', country: 'Vietnam', region: 'Can Tho', material: 'Rice husk', capacity: 380, price: 76, rating: 4.8, fulfillment: 96, completed: 47, farmers: 312, certification: 'Sustainability documented', color: 'wheat', description: 'A network of smallholder rice growers aggregating post-harvest residues in the Mekong Delta.', moisture: '10–14%', energy: '13–15 MJ/kg', leadTime: '3–4 weeks', pesticide: 'Usage records available', practices: ['Rice milling by-product recovery', 'Regional aggregation hubs', 'Seasonal supply planning'] },
  { id: 'tamil', name: 'Tamil Green Producers', initials: 'TG', country: 'India', region: 'Coimbatore', material: 'Coconut shell', capacity: 180, price: 110, rating: 4.7, fulfillment: 95, completed: 26, farmers: 142, certification: 'Organic documented', color: 'clay', description: 'A producer union helping coconut-growing households turn agricultural by-products into a reliable income stream.', moisture: '8–12%', energy: '18–20 MJ/kg', leadTime: '2–4 weeks', pesticide: 'Organic documentation available', practices: ['Coconut by-product recovery', 'Smallholder collection network', 'Documented handling practices'] },
  { id: 'lanka', name: 'Southern Roots Cooperative', initials: 'SR', country: 'Sri Lanka', region: 'Matara', material: 'Wood pellets', capacity: 120, price: 125, rating: 4.6, fulfillment: 94, completed: 18, farmers: 94, certification: 'Documentation pending', color: 'forest', description: 'A rural producer group sourcing woody residues from documented agricultural maintenance activities.', moisture: '6–10%', energy: '16–18 MJ/kg', leadTime: '3–5 weeks', pesticide: 'Not supplied', practices: ['Residue-based feedstock', 'Local processing partners', 'Source documentation in progress'] },
  { id: 'punjab', name: 'Punjab Field Partners', initials: 'PF', country: 'India', region: 'Ludhiana', material: 'Straw briquettes', capacity: 300, price: 88, rating: 4.8, fulfillment: 97, completed: 39, farmers: 228, certification: 'Sustainability documented', color: 'wheat', description: 'A farmer collective collecting crop straw for briquetting and industrial biomass supply.', moisture: '10–14%', energy: '14–16 MJ/kg', leadTime: '2–3 weeks', pesticide: 'Supplier declaration available', practices: ['Crop residue collection', 'Community briquetting partners', 'Traceable collection batches'] },
  { id: 'highland', name: 'Highland Circular Union', initials: 'HC', country: 'Vietnam', region: 'Dak Lak', material: 'Coffee husk', capacity: 160, price: 92, rating: 4.7, fulfillment: 96, completed: 21, farmers: 118, certification: 'Organic documented', color: 'sage', description: 'A cooperative connecting coffee-growing families with buyers for responsibly collected coffee-processing residues.', moisture: '10–13%', energy: '15–17 MJ/kg', leadTime: '3–4 weeks', pesticide: 'Organic documentation available', practices: ['Coffee-processing residue recovery', 'Shared drying facilities', 'Farm-group origin records'] },
]

export const initialContracts = [
  { id: 'TR-1042', supplierId: 'ceylon', volume: 60, price: 82, advance: 30, insurance: true, date: '2026-12-15', status: 'Active', delivered: 20, direction: 'outgoing', createdAt: '2026-11-04T09:00:00.000Z', advanceRecorded: true },
  { id: 'TR-1041', supplierId: 'mekong', volume: 80, price: 76, advance: 25, insurance: true, date: '2026-12-20', status: 'Active', delivered: 0, direction: 'outgoing', createdAt: '2026-11-03T09:00:00.000Z', advanceRecorded: false, risk: 'Heavy rainfall may delay collection by 5–7 days. The cooperative has requested a delivery review.', riskAcknowledged: false },
  { id: 'TR-1040', supplierId: 'tamil', volume: 40, price: 110, advance: 20, insurance: true, date: '2026-12-28', status: 'Incoming request', delivered: 0, direction: 'incoming', createdAt: '2026-11-06T09:00:00.000Z', advanceRecorded: false },
  { id: 'TR-1039', supplierId: 'punjab', volume: 50, price: 88, advance: 30, insurance: false, date: '2026-12-10', status: 'Awaiting response', delivered: 0, direction: 'outgoing', createdAt: '2026-11-05T09:00:00.000Z', advanceRecorded: false },
  { id: 'TR-1032', supplierId: 'highland', volume: 30, price: 92, advance: 20, insurance: true, date: '2026-10-28', status: 'Completed', delivered: 30, direction: 'outgoing', createdAt: '2026-10-10T09:00:00.000Z', advanceRecorded: true },
]

export const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 }).format(value)
export const displayDate = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
export const supplierFor = (id) => cooperatives.find((supplier) => supplier.id === id)

export function isContract(value) {
  return value && typeof value.id === 'string' && supplierFor(value.supplierId) &&
    Number.isFinite(value.volume) && value.volume > 0 && Number.isFinite(value.price) && value.price > 0 &&
    Number.isFinite(value.advance) && value.advance >= 0 && value.advance <= 100 &&
    Number.isFinite(value.delivered) && value.delivered >= 0 && value.delivered <= value.volume &&
    typeof value.insurance === 'boolean' && typeof value.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.date) && Number.isFinite(Date.parse(value.date)) &&
    new Date(value.date).toISOString().slice(0, 10) === value.date &&
    (value.notes === undefined || typeof value.notes === 'string') &&
    (value.risk === undefined || typeof value.risk === 'string') &&
    (value.advanceRecorded === undefined || typeof value.advanceRecorded === 'boolean') &&
    (value.riskAcknowledged === undefined || typeof value.riskAcknowledged === 'boolean') &&
    ['Active', 'Incoming request', 'Awaiting response', 'Completed', 'Declined', 'Cancelled'].includes(value.status)
}
