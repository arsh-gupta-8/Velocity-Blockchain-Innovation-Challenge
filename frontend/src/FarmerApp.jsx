import { useEffect, useState } from 'react'
import { cooperatives, money, displayDate, supplierFor } from './data/demo'
import { useDemoContracts } from './hooks/useDemoContracts'
import { Badge, Button, EmptyState, Icon, Modal, StatusBadge, SupplierAvatar } from './components/ui'
import ContractRequest from './components/ContractRequest'
import './App.css'

const pageNames = { overview: 'Overview', buyers: 'Apparel Buyers', contracts: 'Contracts' }
const readPage = () => Object.hasOwn(pageNames, window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'overview'

// Sample list of apparel buying companies for the farmer's marketplace view
const apparelBuyers = [
  { id: 'ab-1', name: 'Northline Apparel', region: 'London & Global', country: 'United Kingdom', demand: 3200, rating: 4.9, activeContracts: 4, verified: true, description: 'Committed to replacing diesel boilers with verified sustainable biomass across European and Asian manufacturing hubs.' },
  { id: 'ab-2', name: 'Vanguard Textiles', region: 'Stockholm', country: 'Sweden', demand: 2500, rating: 4.8, activeContracts: 3, verified: true, description: 'Pioneering strict CBAM-compliant supply chains with certified agricultural residue inputs.' },
  { id: 'ab-3', name: 'EcoThread Global', region: 'New York', country: 'United States', demand: 4100, rating: 4.7, activeContracts: 6, verified: true, description: 'Global apparel brand funding smallholder working capital advances and crop insurance support.' }
]

function BuyerCard({ buyer, onOpen }) {
  return <article className="supplier-card">
    <div className="supplier-cover forest"><span className="cover-line line-one" /><span className="cover-line line-two" /><span className="cover-line line-three" /><span className="material-tag"><Icon name="leaf" size={14} />Biomass Offtaker</span><span className="cover-location">{buyer.country}</span><div className="cover-plant"><Icon name="leaf" size={102} /></div></div>
    <div className="supplier-card-body"><div className="supplier-title"><h3>{buyer.name}</h3><span className="rating"><Icon name="star" size={14} />{buyer.rating.toFixed(1)}</span></div><p className="location"><Icon name="pin" size={14} />{buyer.region}, {buyer.country}</p><div className="supplier-card-metrics"><span><small>Annual demand</small><strong>{buyer.demand} <em>tonnes</em></strong></span><span><small>Active partnerships</small><strong>{buyer.activeContracts} <em>unions</em></strong></span></div><div className="supplier-card-footer"><span className="document-status"><Icon name="shield" size={14} />Verified ESG Buyer</span><button className="text-button" onClick={() => onOpen(buyer)}>View buyer profile<Icon name="arrow" size={15} /></button></div></div>
  </article>
}

function BuyerDetails({ buyer, onRequest }) {
  return <><div className="profile-intro"><div className="supplier-avatar large forest" style={{ fontFamily: 'Georgia, serif', fontSize: '24px' }}>{buyer.name[0]}</div><div><Badge tone="green">Verified Apparel Buyer</Badge><h3>{buyer.name}</h3><p className="location"><Icon name="pin" size={15} />{buyer.region}, {buyer.country}</p></div></div><p className="profile-description">{buyer.description}</p><div className="profile-stats"><div><strong>{buyer.demand}t</strong><span>Annual demand</span></div><div><strong>{buyer.activeContracts}</strong><span>Partner unions</span></div><div><strong>100%</strong><span>Working capital backed</span></div></div><h4>Commitment terms</h4><dl className="detail-list"><div><dt>Working capital advances</dt><dd>Offered upfront</dd></div><div><dt>Insurance support</dt><dd>Included in contract</dd></div><div><dt>Payment terms</dt><dd>Milestone-based escrow</dd></div><div><dt>Compliance standards</dt><dd>EU CBAM &amp; ESPR ready</dd></div></dl><p className="data-note"><Icon name="help" size={16} />Apparel buyer profiles and demand targets are illustrative sample records.</p><footer className="modal-actions"><span className="muted small">Request a guaranteed biomass purchase contract.</span><Button onClick={() => onRequest(buyer)} icon="plus">Request supply contract</Button></footer></>
}

function FarmerContractTable({ contracts, onOpen, compact = false }) {
  return <div className="table-scroll"><table><thead><tr><th>Apparel Buyer / Contract</th><th>Volume</th>{!compact && <th>Contract Value</th>}<th>Target Delivery</th><th>Status</th><th><span className="sr-only">Details</span></th></tr></thead><tbody>{contracts.map((contract) => {
    return <tr key={contract.id}><td><div className="table-supplier"><div className="supplier-avatar forest" style={{ fontFamily: 'Georgia, serif' }}>NA</div><div><button className="table-title" onClick={() => onOpen(contract)}>Northline Apparel</button><span>{contract.id} <span className="subtle-dot">·</span> Biomass Supply</span></div></div></td><td><strong className="table-number">{contract.volume} t</strong><small>{contract.delivered} t delivered</small></td>{!compact && <td>{money(contract.volume * contract.price)}</td>}<td>{displayDate(contract.date)}{contract.risk && !contract.riskAcknowledged && <span className="risk-inline"><Icon name="alert" size={12} />Weather alert logged</span>}</td><td><StatusBadge status={contract.status} /></td><td><button className="icon-button" aria-label={`View contract ${contract.id}`} onClick={() => onOpen(contract)}><Icon name="chevron" size={17} /></button></td></tr>
  })}</tbody></table></div>
}

function Dashboard({ contracts, navigate, onBuyer, onContract, onReportDisruption, onSwitchRole }) {
  const active = contracts.filter((contract) => contract.status === 'Active')
  const incoming = contracts.filter((contract) => contract.status === 'Incoming request')
  const approved = contracts.filter((contract) => ['Active', 'Completed'].includes(contract.status))
  const totalVolume = approved.reduce((sum, contract) => sum + contract.volume, 0)
  const delivered = approved.reduce((sum, contract) => sum + contract.delivered, 0)
  const totalFunding = approved.reduce((sum, contract) => sum + contract.volume * contract.price * (contract.advance || 30) / 100, 0)
  const risk = active.find((contract) => contract.risk && !contract.riskAcknowledged)
  
  const stats = [
    { label: 'Active supply contracts', value: String(active.length).padStart(2, '0'), note: 'Guaranteed apparel buyers', icon: 'file', tone: 'sage' },
    { label: 'Committed harvest', value: totalVolume.toLocaleString(), unit: 't', note: `${delivered} tonnes successfully shipped`, icon: 'leaf', tone: 'wheat' },
    { label: 'Working capital secured', value: money(totalFunding), note: 'Upfront advance & insurance backing', icon: 'wallet', tone: 'clay' },
    { label: 'Incoming proposals', value: String(incoming.length).padStart(2, '0'), note: 'From verified apparel brands', icon: 'people', tone: 'lilac' },
  ]
  return <>
    <div className="page-heading"><div><p className="eyebrow">FARMER UNION PORTAL</p><h1 style={{ fontFamily: 'Georgia, serif' }}>Empowering sustainable growers.</h1><p>Secure working capital, guaranteed purchase contracts, and climate resilience.</p></div><div style={{ display: 'flex', gap: '10px' }}><Button variant="secondary" onClick={onSwitchRole}>Switch role</Button><Button onClick={() => onReportDisruption()} icon="alert">Report harvest issue</Button></div></div>
    <section className="hero-grid"><div className="impact-banner"><div className="hero-copy"><span className="hero-label"><span />HARVESTING RENEWABLE VALUE</span><h2>Fair contracts.<br />Upfront working capital.</h2><p>Connect your farming cooperative directly with global apparel decarbonization goals.</p><button onClick={() => navigate('buyers')} className="hero-link">Browse apparel buyers<Icon name="arrow" size={18} /></button></div><div className="hero-art" aria-hidden="true"><div className="sun" /><div className="field field-back" /><div className="field field-mid" /><div className="field field-front" /><div className="hero-sprout"><Icon name="leaf" size={118} /></div><span className="art-caption">SMALLHOLDER VALUE CHAIN FINANCE</span></div></div><div className="next-card"><div className="next-card-top"><span className="square-icon"><Icon name="people" size={22} /></span><Badge tone={incoming.length ? 'amber' : 'green'}>{incoming.length ? 'Action required' : 'All contracts secured'}</Badge></div><h3>{incoming.length ? 'New buyer contract proposal.' : 'Log a harvest status.'}</h3><p>{incoming.length ? 'Northline Apparel sent a purchase proposal with upfront working capital terms.' : 'Report weather issues or check your active delivery schedules.'}</p><button className="text-button" onClick={() => incoming.length ? onContract(incoming[0]) : navigate('contracts')}>{incoming.length ? 'Review proposal' : 'View contracts'}<Icon name="arrow" size={17} /></button></div></section>
    <section className="stats-grid" aria-label="Union summary">{stats.map((stat) => <article className="stat-card" key={stat.label}><div className="stat-top"><span>{stat.label}</span><span className={`stat-icon ${stat.tone}`}><Icon name={stat.icon} size={18} /></span></div><div className="stat-value">{stat.value}<span>{stat.unit}</span></div><p>{stat.note}</p></article>)}</section>
    {risk && <div className="risk-banner"><span className="risk-banner-icon"><Icon name="alert" /></span><div><strong>Harvest disruption reported</strong><p>Your weather or drought report for agreement {risk.id} has been logged for buyer insurance review.</p></div><button className="text-button" onClick={() => onContract(risk)}>View details<Icon name="arrow" size={16} /></button></div>}
    <section className="section-block"><div className="section-heading"><div><h2>Active supply agreements</h2><p>Your commitments to apparel decarbonization partners.</p></div><button className="text-button" onClick={() => navigate('contracts')}>View all contracts<Icon name="arrow" size={16} /></button></div><div className="panel">{contracts.length ? <FarmerContractTable contracts={contracts.slice(0, 3)} onOpen={onContract} compact /> : <EmptyState title="No active contracts yet" description="Connect with apparel buyers or request a supply partnership."><Button onClick={() => navigate('buyers')}>Explore apparel buyers</Button></EmptyState>}</div></section>
    <section className="section-block"><div className="section-heading"><div><div className="inline-heading"><h2>Featured apparel buyers</h2><Badge>Verified off-takers</Badge></div><p>Global brands seeking sustainable biomass off-take.</p></div><button className="text-button" onClick={() => navigate('buyers')}>Explore all buyers<Icon name="arrow" size={16} /></button></div><div className="supplier-grid featured-grid">{apparelBuyers.map((buyer) => <BuyerCard key={buyer.id} buyer={buyer} onOpen={onBuyer} />)}</div></section>
  </>
}

function BuyerMarketplace({ onBuyer }) {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('All regions')
  const filtered = apparelBuyers.filter((buyer) => `${buyer.name} ${buyer.country} ${buyer.region}`.toLowerCase().includes(search.toLowerCase().trim()) && (country === 'All regions' || buyer.country === country))
  return <><div className="page-heading"><div><p className="eyebrow">APPAREL BUYER NETWORK</p><h1 style={{ fontFamily: 'Georgia, serif' }}>Verified industrial off-takers.</h1><p>Find apparel brands looking for sustainable biomass and crop residue supply.</p></div><span className="network-label"><Icon name="people" size={17} />3 verified buyers</span></div><div className="market-intro"><Icon name="leaf" size={26} /><p>Guaranteed purchase agreements.<span>Secure working capital and crop insurance backing for your farm union.</span></p><Badge>Decarbonization partners</Badge></div><section className="filters panel" aria-label="Filter buyers"><div className="search-field"><Icon name="search" size={19} /><input aria-label="Search buyers" placeholder="Search apparel buyers or locations…" value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button className="icon-button" aria-label="Clear search" onClick={() => setSearch('')}><Icon name="close" size={16} /></button>}</div><div className="filter-row"><Icon name="filter" size={17} /><label className="sr-only" htmlFor="region">Region</label><select id="region" value={country} onChange={(event) => setCountry(event.target.value)}>{['All regions', 'United Kingdom', 'Sweden', 'United States'].map((value) => <option key={value}>{value}</option>)}</select></div></section><div className="results-heading"><p><strong>{filtered.length}</strong> apparel buyer{filtered.length !== 1 ? 's' : ''} found</p></div>{filtered.length ? <div className="supplier-grid">{filtered.map((buyer) => <BuyerCard key={buyer.id} buyer={buyer} onOpen={onBuyer} />)}</div> : <div className="panel"><EmptyState title="No buyers match your filter" description="Try resetting your region filter."><Button variant="secondary" onClick={() => { setSearch(''); setCountry('All regions') }}>Reset filters</Button></EmptyState></div>}<p className="data-note"><Icon name="help" size={16} />All apparel buyers provide verified working capital and insurance terms.</p></>
}

function Contracts({ contracts, onOpen, navigate, initialTab }) {
  const [tab, setTab] = useState(initialTab || 'All contracts')
  const [search, setSearch] = useState('')
  const tabs = ['All contracts', 'Active', 'Requests', 'Completed']
  const filtered = contracts.filter((contract) => (tab === 'All contracts' || (tab === 'Requests' ? ['Incoming request', 'Awaiting response'].includes(contract.status) : contract.status === tab)) && `${contract.id}`.toLowerCase().includes(search.toLowerCase().trim()))
  return <><div className="page-heading"><div><p className="eyebrow">UNION CONTRACTS &amp; FINANCING</p><h1 style={{ fontFamily: 'Georgia, serif' }}>Supply agreements &amp; working capital.</h1><p>Manage purchase orders, advance funding, and harvest deliveries.</p></div><Button onClick={() => navigate('buyers')} icon="plus">Request new contract</Button></div><div className="contracts-summary"><div><Icon name="file" /><strong>{contracts.filter((contract) => contract.status === 'Active').length}</strong><span>active agreements</span></div><div><Icon name="clock" /><strong>{contracts.filter((contract) => ['Incoming request', 'Awaiting response'].includes(contract.status)).length}</strong><span>pending offers</span></div><div><Icon name="check" /><strong>{contracts.filter((contract) => contract.status === 'Completed').length}</strong><span>completed harvests</span></div></div><section className="panel"><div className="contracts-toolbar"><div className="tabs" role="tablist" aria-label="Contract status">{tabs.map((name) => <button role="tab" aria-selected={tab === name} key={name} onClick={() => setTab(name)} className={tab === name ? 'selected' : ''}>{name}{name === 'Requests' && <span>{contracts.filter((contract) => ['Incoming request', 'Awaiting response'].includes(contract.status)).length}</span>}</button>)}</div><div className="search-field compact-search"><Icon name="search" size={17} /><input aria-label="Search contracts" placeholder="Search contracts…" value={search} onChange={(event) => setSearch(event.target.value)} /></div></div>{filtered.length ? <FarmerContractTable contracts={filtered} onOpen={onOpen} /> : <EmptyState title="No contracts here yet" description={search ? 'Try another contract ID.' : 'Your agreements will appear here.'}><Button variant="secondary" onClick={() => { setSearch(''); setTab('All contracts') }}>Show all contracts</Button></EmptyState>}</section><p className="data-note"><Icon name="help" size={16} />Demo actions update this union's sample records only.</p></>
}

function ContractDetails({ contract, onUpdate, onDecision, onReportRisk }) {
  const total = contract.volume * contract.price
  const progress = Math.round(contract.delivered / contract.volume * 100)
  return <><div className="contract-detail-top"><div className="table-supplier"><div className="supplier-avatar forest" style={{ fontFamily: 'Georgia, serif' }}>NA</div><div><strong>Northline Apparel</strong><p>Biomass Off-take Agreement · Global Supply</p></div></div><StatusBadge status={contract.status} /></div><dl className="detail-list"><div><dt>Supply commitment</dt><dd>{contract.volume} tonnes</dd></div><div><dt>Unit price</dt><dd>{money(contract.price)} / tonne</dd></div><div><dt>Total contract value</dt><dd>{money(total)}</dd></div><div><dt>Working capital advance</dt><dd>{money(total * (contract.advance || 30) / 100)} (30% upfront)</dd></div><div><dt>Insurance protection</dt><dd>Covered against climate shocks</dd></div><div><dt>Target delivery</dt><dd>{displayDate(contract.date)}</dd></div></dl><div className="delivery-progress"><div><strong>Harvest delivery progress</strong><span>{contract.delivered} / {contract.volume} t</span></div><progress value={contract.delivered} max={contract.volume} aria-label="Harvest delivery progress" /><small>{progress}% of biomass shipped to buyer</small></div>{contract.notes && <div className="review-notes"><strong>Contract terms</strong><p>{contract.notes}</p></div>}{contract.risk && <div className={`contract-alert ${contract.riskAcknowledged ? 'acknowledged' : ''}`}><Icon name="alert" /><div><strong>Harvest Disruption Logged</strong><p>{contract.risk}</p></div></div>}<p className="data-note"><Icon name="help" size={16} />Working capital is automatically disbursed upon contract validation.</p><footer className="modal-actions contract-actions">{contract.status === 'Incoming request' && <><Button variant="secondary" onClick={() => onDecision('decline')}>Decline offer</Button><Button icon="check" onClick={() => onDecision('accept')}>Accept purchase contract</Button></>}{contract.status === 'Active' && <><Button variant="secondary" icon="alert" onClick={() => onReportRisk()}>Report harvest issue</Button><Button icon="truck" onClick={() => onDecision('delivery')}>Record harvest shipment</Button></>}{['Completed', 'Declined', 'Cancelled'].includes(contract.status) && <span className="muted small">This agreement is {contract.status.toLowerCase()}.</span>}</footer></>
}

function ReportDisruptionModal({ contracts, onSubmit, onClose }) {
  const [contractId, setContractId] = useState(contracts.filter(c => c.status === 'Active')[0]?.id || contracts[0]?.id || '')
  const [reason, setReason] = useState('Severe drought conditions affecting crop yield in local district.')
  return <Modal title="Report Harvest Disruption" subtitle="Log weather issues, droughts, or natural disasters for crop insurance review." onClose={onClose}>
    <div style={{ display: 'grid', gap: '16px', marginTop: '10px' }}>
      <label className="notes-label">Select Active Contract
        <select value={contractId} onChange={(e) => setContractId(e.target.value)} style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '7px', border: '1px solid #dfe7d2' }}>
          {contracts.filter(c => c.status === 'Active').map(c => <option key={c.id} value={c.id}>{c.id} ({c.volume} tonnes)</option>)}
        </select>
      </label>
      <label className="notes-label">Describe the Disruption / Weather Issue
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Provide details on weather, drought, or flood impact..." />
      </label>
    </div>
    <footer className="modal-actions">
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={() => { onSubmit(contractId, reason); onClose(); }}>Submit disruption report</Button>
    </footer>
  </Modal>
}

export default function FarmerApp({ onSwitchRole }) {
  const [page, setPage] = useState(readPage)
  const [mobileNav, setMobileNav] = useState(false)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [contractTab, setContractTab] = useState('All contracts')
  const { contracts, setContracts, resetContracts, storageUnavailable } = useDemoContracts()

  useEffect(() => { const onHash = () => { setPage(readPage()); setModal(null); setMobileNav(false) }; window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash) }, [])
  useEffect(() => { if (!toast) return; const timeout = window.setTimeout(() => setToast(''), 5000); return () => window.clearTimeout(timeout) }, [toast])
  useEffect(() => { document.title = `${pageNames[page]} · Terra Farmer Portal`; window.scrollTo(0, 0) }, [page])
  useEffect(() => { if (!mobileNav) return; const escape = (event) => { if (event.key === 'Escape') setMobileNav(false) }; window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape) }, [mobileNav])

  function navigate(next, tab = 'All contracts') { setContractTab(tab); setPage(next); window.location.hash = next; setMobileNav(false); setModal(null) }
  function openBuyer(buyer) { setModal({ type: 'buyer', buyerId: buyer.id }) }
  function openContract(contract) { setModal({ type: 'contract', contractId: contract.id }) }
  function updateContract(id, changes, message) { setContracts((current) => current.map((contract) => contract.id === id ? { ...contract, ...changes } : contract)); setToast(message) }
  
  function createContract(values) {
    const id = `TR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
    const next = { ...values, id, status: 'Awaiting response', delivered: 0, direction: 'outgoing', createdAt: new Date().toISOString() }
    setContracts((current) => [next, ...current]); navigate('contracts', 'Requests'); setToast(`Supply proposal ${id} sent to apparel buyer.`)
  }

  const currentContract = modal?.contractId ? contracts.find((contract) => contract.id === modal.contractId) : null
  const currentBuyer = modal?.buyerId ? apparelBuyers.find((b) => b.id === modal.buyerId) : null
  const incomingCount = contracts.filter((contract) => contract.status === 'Incoming request').length
  const alerts = contracts.filter((contract) => contract.status === 'Active' && contract.risk && !contract.riskAcknowledged)

  const confirmLabels = { 
    accept: ['Accept this purchase contract?', 'This will activate the guaranteed biomass off-take agreement and disburse working capital.', 'Accept contract'], 
    decline: ['Decline this proposal?', 'The buyer proposal will be marked as declined.', 'Decline proposal'], 
    delivery: ['Record harvest shipment?', 'Add up to 10 tonnes shipped to this agreement. Fully shipped orders are marked as completed.', 'Record shipment'] 
  }

  function confirmAction() {
    const action = modal.action
    const id = currentContract.id
    if (action === 'accept') updateContract(id, { status: 'Active' }, 'Purchase contract accepted. Working capital advance recorded.')
    if (action === 'decline') updateContract(id, { status: 'Declined' }, 'Proposal declined.')
    if (action === 'delivery') { 
      const delivered = Math.min(currentContract.volume, currentContract.delivered + 10)
      updateContract(id, { delivered, status: delivered === currentContract.volume ? 'Completed' : 'Active' }, 'Harvest shipment recorded.') 
    }
    setModal({ type: 'contract', contractId: id })
  }

  return <div className="app-shell">
    <a href="#main-content" className="skip-link" onClick={(event) => { event.preventDefault(); document.getElementById('main-content').focus() }}>Skip to content</a>
    {mobileNav && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    
    <aside className={`sidebar ${mobileNav ? 'is-open' : ''}`} aria-label="Main navigation">
      <a href="#overview" className="brand" onClick={() => navigate('overview')}>
        <span className="brand-symbol" style={{ background: '#e1ebd0' }}><Icon name="leaf" size={27} /></span>
        <span>terra<span className="brand-period">.</span><small>FARMER UNION PORTAL</small></span>
      </a>
      <div className="workspace-label">UNION WORKSPACE</div>
      <div className="company-switch">
        <div className="company-avatar" style={{ background: '#e6edda', color: '#254e3b' }}>G</div>
        <div><strong>GreenValley Cooperative</strong><span>Smallholder Union · Demo</span></div>
        <Icon name="shield" size={17} />
      </div>
      <div className="nav-section-label">AGRICULTURE &amp; OFF-TAKE</div>
      <nav>
        {[{ id: 'overview', icon: 'grid', label: 'Overview' }, { id: 'buyers', icon: 'leaf', label: 'Apparel Buyers' }, { id: 'contracts', icon: 'file', label: 'Contracts' }].map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={() => navigate(item.id)} className={`nav-link ${page === item.id ? 'active' : ''}`} aria-current={page === item.id ? 'page' : undefined}>
            <Icon name={item.icon} size={20} />{item.label}
            {item.id === 'contracts' && incomingCount > 0 && <span className="nav-count">{incomingCount}</span>}
          </a>
        ))}
      </nav>
      <div className="sidebar-bottom">
        {onSwitchRole && (
          <button className="sidebar-help" onClick={onSwitchRole} style={{ marginBottom: '10px', background: '#eef2e7', borderRadius: '7px' }}>
            <Icon name="people" size={18} />Switch Role / Portal<Icon name="arrow" size={15} />
          </button>
        )}
        <div className="sidebar-note">
          <span className="sidebar-note-icon"><Icon name="leaf" size={24} /></span>
          <h3>Climate resilience &amp; income.</h3>
          <p>Guaranteed biomass off-take powering apparel decarbonization.</p>
          <span className="sidebar-note-line" />
        </div>
        <button className="sidebar-help" onClick={() => setModal({ type: 'help' })}><Icon name="help" size={18} />About this portal<Icon name="arrow" size={15} /></button>
        <div className="user-profile">
          <span className="user-avatar" style={{ background: '#e1ebd0', color: '#254e3b' }}>GV</span>
          <div><strong>GreenValley Union</strong><small>Smallholder Cooperative</small></div>
          <span className="online-dot" />
        </div>
      </div>
    </aside>

    <div className="workspace">
      <header className="topbar">
        <div className="breadcrumb">
          <button className="icon-button mobile-menu" aria-label="Toggle navigation" aria-expanded={mobileNav} onClick={() => setMobileNav((current) => !current)}><Icon name="menu" /></button>
          <span>Farmer Portal</span>
          <Icon name="chevron" size={13} />
          <strong>{pageNames[page]}</strong>
        </div>
        <div className="topbar-right">
          <span className="demo-pill"><span />Interactive farmer demo</span>
          <span className="topbar-divider" />
          <button className="notification-button icon-button" aria-label={`Notifications: ${alerts.length + incomingCount} updates`} onClick={() => setModal({ type: 'notifications' })}>
            <Icon name="bell" size={20} />
            {alerts.length + incomingCount > 0 && <span />}
          </button>
          <span className="topbar-avatar" style={{ background: '#e1ebd0', color: '#254e3b' }}>GV</span>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <div className="demo-notice">
          <span><Icon name="leaf" size={15} />Smallholder Biomass &amp; Working Capital Workspace</span>
          <p>Connect with apparel buyers, secure advance financing, and report harvests.</p>
          <button onClick={() => setModal({ type: 'reset' })}>Reset demo<Icon name="reset" size={13} /></button>
        </div>
        {storageUnavailable && <p role="status" className="storage-warning">Browser storage is unavailable. Changes will last for this session only.</p>}

        {page === 'overview' && <Dashboard contracts={contracts} navigate={navigate} onBuyer={openBuyer} onContract={openContract} onReportDisruption={() => setModal({ type: 'disruption' })} onSwitchRole={onSwitchRole} />}
        {page === 'buyers' && <BuyerMarketplace onBuyer={openBuyer} />}
        {page === 'contracts' && <Contracts key={contractTab} contracts={contracts} navigate={navigate} onOpen={openContract} initialTab={contractTab} />}

        <footer className="app-footer">
          <span>terra. <span className="subtle-dot">/</span> Value chain financing for smallholder biomass.</span>
          <span>Farmer Union Portal</span>
        </footer>
      </main>
    </div>

    {modal?.type === 'buyer' && currentBuyer && <Modal key={`buyer-${currentBuyer.id}`} title="Apparel Buyer Profile" subtitle="Decarbonization off-taker partnership details." onClose={() => setModal(null)} wide><BuyerDetails buyer={currentBuyer} onRequest={(buyer) => setModal({ type: 'request', buyerId: buyer.id })} /></Modal>}
    
    {modal?.type === 'request' && currentBuyer && (
      <Modal key={`request-${currentBuyer.id}`} title="Propose Biomass Supply" subtitle="Submit harvest volume, pricing, and working capital terms to the buyer." onClose={() => setModal(null)} wide>
        <ContractRequest supplier={{ name: currentBuyer.name, material: 'Sustainable Biomass', price: 65, capacity: 500 }} onSubmit={createContract} onCancel={() => setModal({ type: 'buyer', buyerId: currentBuyer.id })} />
      </Modal>
    )}

    {modal?.type === 'contract' && currentContract && (
      <Modal key={`contract-${currentContract.id}`} title={`Contract ${currentContract.id}`} subtitle="Supply agreement, working capital, and harvest delivery milestones." onClose={() => setModal(null)} wide>
        <ContractDetails 
          contract={currentContract} 
          onUpdate={(changes, message) => updateContract(currentContract.id, changes, message)} 
          onDecision={(action) => setModal({ type: 'confirm', contractId: currentContract.id, action })} 
          onReportRisk={() => setModal({ type: 'disruption' })}
        />
      </Modal>
    )}

    {modal?.type === 'disruption' && (
      <ReportDisruptionModal contracts={contracts} onClose={() => setModal(null)} onSubmit={(contractId, reason) => {
        updateContract(contractId, { risk: reason, riskAcknowledged: false }, 'Harvest disruption reported successfully.');
      }} />
    )}

    {modal?.type === 'confirm' && currentContract && (
      <Modal key={`confirm-${modal.action}`} title={confirmLabels[modal.action][0]} onClose={() => openContract(currentContract)}>
        <p className="confirm-description">{confirmLabels[modal.action][1]}</p>
        <footer className="modal-actions">
          <Button variant="secondary" onClick={() => openContract(currentContract)}>Go back</Button>
          <Button onClick={confirmAction}>{confirmLabels[modal.action][2]}</Button>
        </footer>
      </Modal>
    )}

    {modal?.type === 'reset' && (
      <Modal key="reset" title="Start fresh?" onClose={() => setModal(null)}>
        <p className="confirm-description">Reset this browser's demo agreements to original sample records.</p>
        <footer className="modal-actions">
          <Button variant="secondary" onClick={() => setModal(null)}>Keep changes</Button>
          <Button onClick={() => { resetContracts(); setModal(null); setToast('Farmer workspace reset.'); navigate('overview') }}>Reset sample data</Button>
        </footer>
      </Modal>
    )}

    {modal?.type === 'help' && (
      <Modal key="help" title="Farmer Union Portal Overview" subtitle="Value chain financing for smallholder sustainable biomass." onClose={() => setModal(null)}>
        <div className="help-content">
          <p>This farmer-side interface enables agricultural cooperatives to connect with apparel brands seeking biomass to replace diesel boilers.</p>
          <h4>Key Features</h4>
          <ol>
            <li>Browse verified apparel buyers seeking biomass off-take.</li>
            <li>Manage purchase contracts with upfront working capital and insurance.</li>
            <li>Report weather disruptions or droughts for crop insurance review.</li>
            <li>Track harvest shipments and fulfillment milestones.</li>
          </ol>
        </div>
        <footer className="modal-actions"><Button onClick={() => { setModal(null); navigate('buyers') }}>Explore buyers<Icon name="arrow" size={17} /></Button></footer>
      </Modal>
    )}

    {modal?.type === 'notifications' && (
      <Modal key="notifications" title="Union Notifications" subtitle="Incoming contract proposals and alerts." onClose={() => setModal(null)}>
        <div className="notification-list">
          {contracts.filter((contract) => contract.status === 'Incoming request' || (contract.status === 'Active' && contract.risk && !contract.riskAcknowledged)).map((contract) => (
            <button key={contract.id} onClick={() => openContract(contract)}>
              <span className="square-icon"><Icon name={contract.status === 'Incoming request' ? 'file' : 'alert'} /></span>
              <span><strong>{contract.status === 'Incoming request' ? 'New apparel proposal' : 'Disruption notice'}</strong><small>Northline Apparel · {contract.id}</small></span>
              <Icon name="chevron" size={17} />
            </button>
          ))}
          {!alerts.length && !incomingCount && <EmptyState title="All caught up" description="New contract offers from apparel brands will appear here." />}
        </div>
      </Modal>
    )}

    <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">
      {toast && (
        <div className="toast">
          <span><Icon name="check" size={18} /></span>
          {toast}
          <button className="icon-button" aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={16} /></button>
        </div>
      )}
    </div>
  </div>
}