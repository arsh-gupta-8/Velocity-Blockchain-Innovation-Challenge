import { useEffect, useRef, useState } from 'react'
import { money, displayDate } from '../data/demo'
import { Button, Icon, SupplierAvatar } from './ui'

function localDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function ContractRequest({ supplier, onSubmit, onCancel }) {
  const [step, setStep] = useState('terms')
  const [values, setValues] = useState({ volume: '', price: String(supplier.price), advance: '30', date: localDate(new Date(Date.now() + 30 * 86400000)), insurance: true, notes: '' })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const reviewRef = useRef(null)
  const volumeRef = useRef(null)
  useEffect(() => { if (step === 'review') reviewRef.current?.focus(); else volumeRef.current?.focus() }, [step])
  const total = (Number(values.volume) || 0) * (Number(values.price) || 0)
  const advance = total * Number(values.advance) / 100
  const tomorrow = localDate(new Date(Date.now() + 86400000))
  const update = (field, value) => setValues((previous) => ({ ...previous, [field]: value }))

  function validate() {
    if (!Number.isInteger(Number(values.volume)) || Number(values.volume) < 1 || Number(values.volume) > supplier.capacity) return `Choose a whole-number volume between 1 and ${supplier.capacity} tonnes.`
    if (!Number.isFinite(Number(values.price)) || Number(values.price) <= 0 || Number(values.price) > 10000) return 'Enter a price between $0.01 and $10,000 per tonne.'
    if (!Number.isFinite(Number(values.advance)) || Number(values.advance) < 0 || Number(values.advance) > 100) return 'The advance must be between 0% and 100%.'
    if (!values.date || values.date < tomorrow) return 'Choose a delivery date after today.'
    return ''
  }

  function review(event) {
    event.preventDefault()
    const message = validate()
    if (message) { setError(message); return }
    setError('')
    setStep('review')
  }

  function submit() {
    const message = validate()
    if (message) { setError(message); setStep('terms'); return }
    if (!agreed) return
    onSubmit({ supplierId: supplier.id, volume: Number(values.volume), price: Number(values.price), advance: Number(values.advance), date: values.date, insurance: values.insurance, notes: values.notes.trim() })
  }

  return <>
    <div className="step-indicator" aria-label={`Step ${step === 'terms' ? '1' : '2'} of 2`}><span className={step === 'terms' ? 'current' : 'done'}><b>{step === 'terms' ? '1' : '✓'}</b>Set terms</span><i /><span className={step === 'review' ? 'current' : ''}><b>2</b>Review request</span></div>
    <div className="request-supplier"><SupplierAvatar supplier={supplier} /><div><strong>{supplier.name}</strong><p>{supplier.material} · {supplier.region}, {supplier.country}</p></div></div>
    {step === 'terms' ? <form onSubmit={review}>
      <div className="form-grid">
        <label>Volume <span className="input-unit">tonnes</span><input ref={volumeRef} data-autofocus type="number" name="volume" min="1" max={supplier.capacity} step="1" required value={values.volume} onChange={(event) => update('volume', event.target.value)} placeholder="e.g. 40" /><small>Sample capacity: {supplier.capacity} t / month</small></label>
        <label>Agreed unit price <span className="input-unit">USD / tonne</span><input type="number" name="price" min="0.01" max="10000" step="0.01" required value={values.price} onChange={(event) => update('price', event.target.value)} /><small>Indicative price: {money(supplier.price)} / t</small></label>
        <label>Working capital advance <span className="input-unit">%</span><input type="number" name="advance" min="0" max="100" step="1" required value={values.advance} onChange={(event) => update('advance', event.target.value)} /><small>Percentage of total contract value</small></label>
        <label>Target delivery date<input type="date" name="date" min={tomorrow} required value={values.date} onChange={(event) => update('date', event.target.value)} /><small>Subject to agreement with the cooperative</small></label>
      </div>
      <label className="checkbox-card"><input type="checkbox" checked={values.insurance} onChange={(event) => update('insurance', event.target.checked)} /><span><strong>Include buyer-backed insurance support</strong><small>Propose an insurance commitment in the contract. Coverage requires a separate agreement with an insurer.</small></span><Icon name="shield" /></label>
      <label className="notes-label">Additional terms <span className="muted">(optional)</span><textarea maxLength={600} value={values.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Collection arrangements, quality requirements, or delivery notes…" rows={3} /></label>
      <div className="request-totals"><span>Estimated contract value<strong>{money(total)}</strong></span><span>Proposed advance<strong>{money(advance)}</strong></span></div>
      {error && <p role="alert" className="form-error">{error}</p>}
      <footer className="modal-actions"><Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button><Button type="submit">Review request<Icon name="arrow" size={17} /></Button></footer>
    </form> : <div ref={reviewRef} tabIndex={-1} aria-label="Review contract request">
      <div className="review-callout"><Icon name="file" /><div><strong>A clear agreement, from the start.</strong><p>The cooperative will need to review and accept your proposed terms.</p></div></div>
      <dl className="detail-list"><div><dt>Biomass volume</dt><dd>{values.volume} tonnes of {supplier.material.toLowerCase()}</dd></div><div><dt>Unit price</dt><dd>{money(Number(values.price))} / tonne</dd></div><div><dt>Contract value</dt><dd>{money(total)}</dd></div><div><dt>Working capital advance</dt><dd>{money(advance)} ({values.advance}%)</dd></div><div><dt>Target delivery</dt><dd>{displayDate(values.date)}</dd></div><div><dt>Insurance support</dt><dd>{values.insurance ? 'Proposed buyer commitment' : 'Not included'}</dd></div></dl>
      {values.notes && <div className="review-notes"><strong>Additional terms</strong><p>{values.notes}</p></div>}
      <label className="agreement"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /><span>I understand this creates a sample request only. No legal contract is signed, insurance bound, or money transferred.</span></label>
      <footer className="modal-actions"><Button variant="secondary" onClick={() => setStep('terms')}>Back to terms</Button><Button disabled={!agreed} onClick={submit}>Send demo request<Icon name="arrow" size={17} /></Button></footer>
    </div>}
  </>
}
