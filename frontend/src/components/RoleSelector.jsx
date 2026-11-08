import { Icon } from './ui'

export default function RoleSelector({ onSelectRole }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f7f8f3', padding: '24px' }}>
      <div style={{ maxWidth: '850px', width: '100%', textAlign: 'center' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
          <span className="brand-symbol" style={{ width: '45px', height: '48px', display: 'grid', placeItems: 'center', borderRadius: '50% 50% 45% 15%', background: '#e6edda', color: '#254e3b' }}>
            <Icon name="leaf" size={28} />
          </span>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '42px', letterSpacing: '-2px' }}>
            terra<span style={{ color: '#616e32' }}>.</span>
          </span>
        </div>
        <p style={{ fontSize: '12px', letterSpacing: '1.5px', fontWeight: '600', color: '#656d59', marginBottom: '8px', textTransform: 'uppercase' }}>
          Sustainable Biomass Value Chain Financing
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 3vw, 44px)', fontWeight: '400', marginBottom: '16px', color: '#23372f' }}>
          Choose your portal to get started
        </h1>
        <p style={{ fontSize: '14px', color: '#626b58', maxWidth: '540px', margin: '0 auto 40px', lineHeight: '1.8' }}>
          Bridging apparel decarbonization needs with smallholder agricultural residues, working capital, and guaranteed purchase contracts.
        </p>

        {/* Role Selection Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', textAlign: 'left' }}>
          
          {/* Farmer Card */}
          <div 
            onClick={() => onSelectRole('farmer')}
            style={{ background: '#fff', border: '1px solid #e5e8de', borderRadius: '16px', padding: '32px', cursor: 'pointer', transition: 'all .2s ease', boxShadow: '0 4px 20px rgba(37, 78, 59, 0.04)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8aa35e'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e8de'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eef4e3', display: 'grid', placeItems: 'center', color: '#3b6238', marginBottom: '20px' }}>
              <Icon name="leaf" size={24} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.2px', color: '#617036', textTransform: 'uppercase' }}>For Growers</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '400', margin: '8px 0 12px', color: '#23372f' }}>
              Farmer / Farm Union
            </h2>
            <p style={{ fontSize: '13px', color: '#646d5c', lineHeight: '1.8', marginBottom: '24px' }}>
              Access upfront working capital advances, crop insurance backing, and connect with global apparel brands for guaranteed biomass purchase contracts.
            </p>
            <span className="text-button" style={{ color: '#254e3b', fontWeight: '650', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Enter farmer portal <Icon name="arrow" size={16} />
            </span>
          </div>

          {/* Apparel Company Card */}
          <div 
            onClick={() => onSelectRole('apparel')}
            style={{ background: '#fff', border: '1px solid #e5e8de', borderRadius: '16px', padding: '32px', cursor: 'pointer', transition: 'all .2s ease', boxShadow: '0 4px 20px rgba(37, 78, 59, 0.04)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8aa35e'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e8de'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8edf3', display: 'grid', placeItems: 'center', color: '#3a5f78', marginBottom: '20px' }}>
              <Icon name="file" size={24} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.2px', color: '#4c7084', textTransform: 'uppercase' }}>For Off-Takers</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '400', margin: '8px 0 12px', color: '#23372f' }}>
              Apparel Company
            </h2>
            <p style={{ fontSize: '13px', color: '#646d5c', lineHeight: '1.8', marginBottom: '24px' }}>
              Source sustainable biomass to replace diesel boilers, meet strict EU export regulations (CBAM, ESPR)[cite: 1], and manage supply contracts and ratings.
            </p>
            <span className="text-button" style={{ color: '#254e3b', fontWeight: '650', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Enter apparel portal <Icon name="arrow" size={16} />
            </span>
          </div>

        </div>

      </div>
    </div>
  )
}