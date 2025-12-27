import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardAdmin from './pages/DashboardAdmin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<DashboardAdmin />} />
    </Routes>
  )
}

export default App

