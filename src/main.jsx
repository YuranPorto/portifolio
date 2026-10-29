import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Briefing from './pages/Briefing.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>

        {/* Briefing routes */}
        <Route path="/briefing" element={<Briefing />} />
        <Route path="/pt/briefing" element={<Briefing />} />
        <Route path="/en/briefing" element={<Briefing />} />
        <Route path="/:lang/briefing" element={<Briefing />} />

        {/* Root and Language Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/:lang" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
