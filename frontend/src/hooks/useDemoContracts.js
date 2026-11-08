import { useEffect, useState } from 'react'
import { initialContracts, isContract } from '../data/demo'

const STORAGE_KEY = 'terra-apparel-contracts-v1'

export function useDemoContracts() {
  const [storageUnavailable, setStorageUnavailable] = useState(false)
  const [contracts, setContracts] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
      if (saved?.version === 1 && Array.isArray(saved.contracts) && saved.contracts.every(isContract) && new Set(saved.contracts.map((item) => item.id)).size === saved.contracts.length) return saved.contracts
    } catch { /* Invalid or inaccessible storage starts a fresh sample session. */ }
    return structuredClone(initialContracts)
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, contracts }))
      setStorageUnavailable(false)
    } catch {
      setStorageUnavailable(true)
    }
  }, [contracts])

  return { contracts, setContracts, storageUnavailable, resetContracts: () => setContracts(structuredClone(initialContracts)) }
}
