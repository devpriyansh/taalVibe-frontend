import React, { useEffect, useState } from 'react';
import CloudMusicService from '../services/CloudMusicService';
import { useLibrary } from '../contexts/LibraryContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const [driveStatus, setDriveStatus] = useState(null);
  const [folderIdInput, setFolderIdInput] = useState('');
  const { syncDrive, importing, importProgress } = useLibrary();
  const location = useLocation();
  const navigate = useNavigate();

  const loadStatus = async () => {
    try {
      const status = await CloudMusicService.getDriveStatus();
      setDriveStatus(status);
      if (status.folderId) {
        setFolderIdInput(status.folderId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [location]);

  const handleConnect = async () => {
    try {
      const url = await CloudMusicService.getAuthUrl();
      window.location.href = url; // Redirect to Google OAuth
    } catch (e) {
      alert('Failed to init OAuth');
    }
  };

  const handleSetFolder = async () => {
    try {
      await CloudMusicService.setDriveFolder(folderIdInput);
      alert('Folder updated');
      loadStatus();
    } catch (e) {
      alert('Failed to update folder');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="p-8 h-full overflow-y-auto pb-24 md:pb-8">
      <h1 className="text-3xl font-outfit font-light mb-8">Settings</h1>

      {/* Account Section */}
      <div className="bg-sonora-surface rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
          <User size={24} className="text-sonora-primary" />
          Account Profile
        </h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center font-bold text-xl text-white shadow-lg border border-white/10">
              {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-medium text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-sonora-text-muted">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="inline-block mt-1 text-[10px] uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">Admin</span>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/50 rounded-xl font-medium transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      {user?.role === 'admin' ? (
        <div className="bg-sonora-surface rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-medium mb-4 flex items-center">
            Central Google Drive Configuration (Admin Only)
            {driveStatus?.connected && <span className="ml-3 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Connected ✓</span>}
          </h2>

          {!driveStatus?.connected ? (
            <div>
              <p className="text-sonora-muted mb-4">Connect the central Google Drive to host the shared music catalog.</p>
              <button 
                onClick={handleConnect}
                className="bg-sonora-primary text-black px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all"
              >
                Connect Google Drive
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-sonora-muted mb-2">Music Folder ID</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={folderIdInput}
                    onChange={e => setFolderIdInput(e.target.value)}
                    placeholder="e.g. 1AbCdEf..."
                    className="bg-sonora-base border border-sonora-surface rounded px-4 py-2 flex-grow focus:outline-none focus:border-sonora-primary text-sonora-text"
                  />
                  <button 
                    onClick={handleSetFolder}
                    className="bg-sonora-surface hover:bg-white/10 px-4 py-2 rounded border border-white/5 transition-colors"
                  >
                    Save
                  </button>
                </div>
                <p className="text-xs text-sonora-muted mt-2">Paste the ID of the Google Drive folder containing the central catalog.</p>
              </div>

              <div className="border-t border-white/5 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sync Library</h3>
                    <p className="text-sm text-sonora-muted">Last synced: {driveStatus.lastSyncedAt ? new Date(driveStatus.lastSyncedAt).toLocaleString() : 'Never'}</p>
                  </div>
                  <button 
                    onClick={syncDrive}
                    disabled={importing || !driveStatus.folderId}
                    className="bg-sonora-primary text-black px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {importing ? 'Syncing...' : 'Sync Music'}
                  </button>
                </div>
                
                {importProgress && (
                  <div className="mt-4 p-4 bg-white/5 rounded text-sm text-sonora-muted">
                    <p>Status: Syncing...</p>
                    <p>Found: {importProgress.total} songs</p>
                    <p>Newly Added: {importProgress.imported}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}

      <div className="bg-sonora-surface rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-medium mb-4 flex items-center">
          App Installation
        </h2>
        <div className="text-sonora-muted mb-4 space-y-2 text-sm">
          <p>You can install TaalVibe on your device for a native app experience.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>iOS Safari:</strong> Tap the Share button (<span className="text-xl">⍐</span>) and select "Add to Home Screen".</li>
            <li><strong>Android/Chrome:</strong> Tap the menu and select "Install app" or "Add to Home screen".</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
