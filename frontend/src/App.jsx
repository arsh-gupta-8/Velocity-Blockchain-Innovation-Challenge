import { useState, useEffect } from 'react'
import RoleSelector from './components/RoleSelector'
import FarmerApp from './FarmerApp'
import ApparelApp from './ApparelApp'
import './index.css'
import './App.css'

const readRole = () => {
  const hash = window.location.hash.slice(1)
  if (hash.startsWith('farmer')) return 'farmer'
  if (hash.startsWith('apparel')) return 'apparel'
  return null
}

export default function App() {
  const [role, setRole] = useState(readRole)

  useEffect(() => {
    const handleHashChange = () => {
      setRole(readRole())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole)
    window.location.hash = selectedRole === 'farmer' ? 'farmer' : 'apparel'
  }

  const handleSwitchRole = () => {
    setRole(null)
    window.location.hash = ''
  }

  if (role === 'farmer') {
    return <FarmerApp onSwitchRole={handleSwitchRole} />
  }

  if (role === 'apparel') {
    return <ApparelApp onSwitchRole={handleSwitchRole} />
  }

  return <RoleSelector onSelectRole={handleSelectRole} />
}