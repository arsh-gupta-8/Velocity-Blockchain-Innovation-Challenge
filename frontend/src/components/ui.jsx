import { useEffect, useId, useRef } from 'react'

const paths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.4" /><rect x="14" y="3" width="7" height="7" rx="1.4" /><rect x="3" y="14" width="7" height="7" rx="1.4" /><rect x="14" y="14" width="7" height="7" rx="1.4" /></>,
  leaf: <><path d="M20 4c-8-1-15 1-15 8a6 6 0 0 0 6 6c7 0 9-7 9-14Z" /><path d="m4 21 11-11M9 16v-5m0 5h5" /></>,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
  arrow: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  wallet: <><path d="M20 8V5H5a2 2 0 0 0 0 4h15v11H5a2 2 0 0 1-2-2V7M20 12h-5v4h5" /><path d="M17 14h.01" /></>,
  truck: <><path d="M3 5h11v12H3ZM14 9h4l3 4v4h-7" /><circle cx="6.5" cy="18" r="2" /><circle cx="17.5" cy="18" r="2" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  alert: <><path d="m12 3 10 18H2Z" /><path d="M12 9v5m0 3h.01" /></>,
  reset: <><path d="M3 11a9 9 0 1 1 2 7M3 4v7h7" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01" /></>,
  filter: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2" /><circle cx="15" cy="17" r="2" /></>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5" /></>,
}

export function Icon({ name, size = 20, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.leaf}</svg>
}

export function Button({ children, variant = 'primary', className = '', icon, ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{icon && <Icon name={icon} size={17} />}{children}</button>
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}><span className="badge-dot" />{children}</span>
}

export function StatusBadge({ status }) {
  const tone = { Active: 'green', Completed: 'green', 'Awaiting response': 'amber', 'Incoming request': 'blue', Declined: 'neutral', Cancelled: 'neutral' }[status]
  return <Badge tone={tone}>{status}</Badge>
}

export function SupplierAvatar({ supplier, large = false }) {
  return <div className={`supplier-avatar ${supplier.color} ${large ? 'large' : ''}`} aria-hidden="true">{supplier.initials}<Icon name="leaf" size={large ? 36 : 22} /></div>
}

export function EmptyState({ title, description, children }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name="search" size={28} /></span><h3>{title}</h3><p>{description}</p>{children}</div>
}

export function Modal({ title, subtitle, children, onClose, wide = false }) {
  const titleId = useId()
  const subtitleId = useId()
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const previous = document.activeElement
    const scroll = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    const focusable = () => [...panel.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')].filter((element) => element.getClientRects().length)
    const first = panel.querySelector('[data-autofocus]') || focusable()[0] || panel
    first.focus()
    function onKeyDown(event) {
      if (event.key === 'Escape') onCloseRef.current()
      if (event.key === 'Tab') {
        const elements = focusable()
        const firstElement = elements[0]
        const lastElement = elements.at(-1)
        if (!firstElement) { event.preventDefault(); panel.focus() }
        else if (event.shiftKey && (document.activeElement === firstElement || !panel.contains(document.activeElement))) { event.preventDefault(); lastElement.focus() }
        else if (!event.shiftKey && (document.activeElement === lastElement || !panel.contains(document.activeElement))) { event.preventDefault(); firstElement.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = scroll; document.removeEventListener('keydown', onKeyDown); if (previous?.isConnected) previous.focus() }
  }, [])

  useEffect(() => {
    if (document.activeElement === document.body) panelRef.current?.focus()
  })

  return <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}><section ref={panelRef} className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={subtitle ? subtitleId : undefined} tabIndex={-1}><header className="modal-heading"><div><h2 id={titleId}>{title}</h2>{subtitle && <p id={subtitleId}>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button></header>{children}</section></div>
}
