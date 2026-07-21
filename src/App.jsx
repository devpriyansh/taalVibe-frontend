import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import RootLayout from './layouts/RootLayout'
import WakeUpLoader from './components/common/WakeUpLoader';
import FunLoader from './components/common/FunLoader';
import FloatingBackground from './components/common/FloatingBackground';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <AuthProvider>
      <WakeUpLoader>
        <Suspense fallback={<div className="flex items-center justify-center h-full w-full app-frame"><FunLoader message="Loading..." /></div>}>
          <div className="app-frame bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            <FloatingBackground />

            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route element={<ProtectedRoute />}>
                <Route element={<RootLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile-settings" element={<Navigate to="/dashboard" />} />
                </Route>
              </Route>
                            
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Suspense>
      </WakeUpLoader>
    </AuthProvider>
  )
}

export default App