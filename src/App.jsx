import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LibraryProvider } from './contexts/LibraryContext'
import { PlayerProvider } from './contexts/PlayerContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import RootLayout from './layouts/RootLayout'

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Search = lazy(() => import('./pages/Search'))
const Settings = lazy(() => import('./pages/Settings'))
const Library = lazy(() => import('./pages/Library'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Playlists = lazy(() => import('./pages/Playlists'))
const PlaylistDetail = lazy(() => import('./pages/PlaylistDetail'))
const MoodDetail = lazy(() => import('./pages/MoodDetail'))
import GlobalLoader from './components/common/GlobalLoader'
import { PWAInstallProvider } from './contexts/PWAInstallContext'
import DownloadAppBanner from './components/common/DownloadAppBanner'

const Loader = () => (
  <div className="flex items-center justify-center h-full w-full bg-sonora-base text-sonora-text">
    <div className="animate-pulse-slow text-sonora-primary font-outfit text-xl">Loading...</div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <PWAInstallProvider>
        <LibraryProvider>
          <PlayerProvider>
            <GlobalLoader />
            <Suspense fallback={<Loader />}>
              <div className="app-frame bg-sonora-base text-sonora-text relative overflow-hidden flex flex-col">
                <DownloadAppBanner />
                <div className="flex-1 overflow-hidden relative">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route element={<RootLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/playlists" element={<Playlists />} />
                    <Route path="/playlists/:id" element={<PlaylistDetail />} />
                    <Route path="/mood/:id" element={<MoodDetail />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile-settings" element={<Navigate to="/settings" />} />
                  </Route>
                </Route>
                              
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
                </div>
              </div>
            </Suspense>
          </PlayerProvider>
        </LibraryProvider>
      </PWAInstallProvider>
    </AuthProvider>
  )
}

export default App