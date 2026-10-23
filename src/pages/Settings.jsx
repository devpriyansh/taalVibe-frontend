import React, { useEffect, useState } from 'react';
import CloudMusicService from '../services/CloudMusicService';
import { useLibrary } from '../contexts/LibraryContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Folder, 
  FolderSync, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Music, 
  ChevronRight,
  FolderSearch,
  ArrowLeft
} from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const [driveStatus, setDriveStatus] = useState(null);
  const [folderIdInput, setFolderIdInput] = useState('');
  const { syncDrive, importing, importProgress } = useLibrary();
  const location = useLocation();
  const navigate = useNavigate();

  // Admin Drive Playlists State
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [editingFolders, setEditingFolders] = useState({});
  const [savingPlaylistId, setSavingPlaylistId] = useState(null);
  const [syncingPlaylistId, setSyncingPlaylistId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Add Playlist Modal / Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [newPlaylistFolderId, setNewPlaylistFolderId] = useState('');

  // Discovered Drive Subfolders
  const [discoveredFolders, setDiscoveredFolders] = useState([]);
  const [isScanningFolders, setIsScanningFolders] = useState(false);

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

  const loadFeaturedPlaylists = async () => {
    try {
      const playlists = await CloudMusicService.getFeaturedPlaylists();
      if (playlists) {
        setFeaturedPlaylists(playlists);
        const folderMap = {};
        playlists.forEach(p => {
          folderMap[p.id] = p.folderId || '';
        });
        setEditingFolders(folderMap);
      }
    } catch (e) {
      console.error('Error loading playlists:', e);
    }
  };

  useEffect(() => {
    loadStatus();
    loadFeaturedPlaylists();

    const params = new URLSearchParams(window.location.search);
    if (params.get('drive') === 'connected') {
      setStatusMessage('Google Drive connected successfully!');
      setTimeout(() => setStatusMessage(''), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
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
      setStatusMessage('Central Music Folder updated successfully!');
      setTimeout(() => setStatusMessage(''), 4000);
      loadStatus();
    } catch (e) {
      alert('Failed to update folder: ' + e.message);
    }
  };

  const handleSavePlaylistFolder = async (playlistId) => {
    try {
      setSavingPlaylistId(playlistId);
      const targetFolderId = (editingFolders[playlistId] || '').trim();
      await CloudMusicService.updateFeaturedPlaylist(playlistId, {
        folderId: targetFolderId
      });
      
      if (targetFolderId) {
        setStatusMessage('Folder saved! Syncing songs from Google Drive...');
        try {
          const res = await CloudMusicService.syncFeaturedPlaylist(playlistId);
          setStatusMessage(`Sync complete! Added: ${res.stats?.added || 0}, Existing: ${res.stats?.skipped || 0}`);
        } catch (syncErr) {
          console.warn('Auto-sync error:', syncErr);
          setStatusMessage('Folder saved! (Click Sync Folder to refresh songs)');
        }
      } else {
        setStatusMessage('Playlist folder cleared successfully.');
      }
      setTimeout(() => setStatusMessage(''), 5000);
      await loadFeaturedPlaylists();
    } catch (e) {
      alert('Failed to save folder: ' + e.message);
    } finally {
      setSavingPlaylistId(null);
    }
  };

  const handleSyncPlaylist = async (playlistId) => {
    try {
      setSyncingPlaylistId(playlistId);
      const res = await CloudMusicService.syncFeaturedPlaylist(playlistId);
      setStatusMessage(`Sync complete! Added: ${res.stats?.added || 0}, Updated: ${res.stats?.updated || 0}`);
      setTimeout(() => setStatusMessage(''), 5000);
      await loadFeaturedPlaylists();
    } catch (e) {
      alert('Failed to sync playlist folder: ' + (e.response?.data?.message || e.message));
    } finally {
      setSyncingPlaylistId(null);
    }
  };

  const handleDeletePlaylist = async (playlistId, name) => {
    if (window.confirm(`Are you sure you want to delete playlist "${name}"?`)) {
      try {
        await CloudMusicService.deleteFeaturedPlaylist(playlistId);
        setStatusMessage(`Deleted playlist "${name}"`);
        setTimeout(() => setStatusMessage(''), 4000);
        await loadFeaturedPlaylists();
      } catch (e) {
        alert('Failed to delete playlist: ' + e.message);
      }
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      await CloudMusicService.createFeaturedPlaylist({
        name: newPlaylistName.trim(),
        description: newPlaylistDesc.trim(),
        folderId: newPlaylistFolderId.trim()
      });
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setNewPlaylistFolderId('');
      setShowAddForm(false);
      setStatusMessage('New playlist created!');
      setTimeout(() => setStatusMessage(''), 4000);
      await loadFeaturedPlaylists();
    } catch (err) {
      alert('Failed to create playlist: ' + err.message);
    }
  };

  const handleScanFolders = async () => {
    setIsScanningFolders(true);
    try {
      const folders = await CloudMusicService.getAdminDriveFolders();
      setDiscoveredFolders(folders || []);
      if (!folders || folders.length === 0) {
        setStatusMessage('No subfolders found inside the central Music folder.');
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (e) {
      console.error(e);
      alert('Could not scan subfolders from Google Drive: ' + e.message);
    } finally {
      setIsScanningFolders(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="p-4 sm:p-8 h-full overflow-y-auto pb-28 md:pb-12 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all shadow-sm border border-white/10 shrink-0"
          aria-label="Go back"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-outfit font-bold text-white">Settings</h1>
          <p className="text-xs sm:text-sm text-sonora-text-muted mt-0.5">Manage your account and Google Drive configurations</p>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/40 text-pink-300 flex items-center gap-3 animate-fade-in text-sm font-medium">
          <Check size={18} className="text-pink-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Account Section */}
      <div className="bg-sonora-surface rounded-2xl p-6 mb-8 shadow-sm border border-white/5">
        <h2 className="text-xl font-outfit font-semibold mb-6 flex items-center gap-2.5 text-white">
          <User size={22} className="text-sonora-primary" />
          Account Profile
        </h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center font-bold text-xl text-white shadow-lg border border-white/10">
              {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-medium text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-sonora-text-muted">{user?.email}</p>
              {isAdmin && (
                <span className="inline-block mt-1 text-[10px] uppercase tracking-wider bg-pink-500/20 text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded font-bold">
                  Administrator
                </span>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/50 rounded-xl font-medium transition-all text-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Admin Google Drive & Custom Playlists Section */}
      {isAdmin && (
        <div className="space-y-8 mb-8">
          
          {/* Main Google Drive Connection */}
          <div className="bg-sonora-surface rounded-2xl p-6 shadow-sm border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-outfit font-semibold flex items-center gap-2.5 text-white">
                <Folder size={22} className="text-sonora-primary" />
                Central Google Drive Connection
              </h2>
              {driveStatus?.connected ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full font-medium">
                    Connected ✓
                  </span>
                  <button
                    onClick={handleConnect}
                    className="text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 px-2.5 py-1 rounded-full font-medium transition-colors"
                    title="Refresh Google OAuth connection"
                  >
                    Reconnect
                  </button>
                </div>
              ) : driveStatus?.status === 'EXPIRED' ? (
                <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
                  Token Expired ⚠
                </span>
              ) : null}
            </div>

            {!driveStatus?.connected ? (
              <div className="space-y-4">
                {driveStatus?.status === 'EXPIRED' && (
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
                    <span className="text-base leading-none">⚠️</span>
                    <div>
                      <p className="font-semibold text-amber-200">Google Drive Token Expired or Revoked</p>
                      <p className="mt-0.5 text-amber-300/80 leading-relaxed">
                        Google has invalidated the OAuth refresh token (this happens after 7 days if the OAuth Consent Screen in Google Cloud is in "Testing" status, or if the Google account password changed). Reconnect below to resume song playback and syncing.
                      </p>
                    </div>
                  </div>
                )}
                <p className="text-sonora-text-muted text-sm">
                  Connect the shared Google Drive account to stream catalog tracks and playlists.
                </p>
                <button 
                  onClick={handleConnect}
                  className="bg-sonora-primary text-black px-6 py-2.5 rounded-xl font-medium hover:bg-opacity-90 transition-all font-outfit shadow-lg shadow-sonora-primary/20"
                >
                  {driveStatus?.status === 'EXPIRED' ? 'Reconnect Google Drive' : 'Connect Google Drive'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-sonora-text-muted mb-2 font-medium">
                    Root Music Folder ID (Directory)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      value={folderIdInput}
                      onChange={e => setFolderIdInput(e.target.value)}
                      placeholder="e.g. 1AbCdEfGhIjKlMnOpQrStUvWxYz..."
                      className="bg-sonora-base border border-sonora-border rounded-xl px-4 py-2.5 flex-grow focus:outline-none focus:border-sonora-primary text-sonora-text font-mono text-sm"
                    />
                    <button 
                      onClick={handleSetFolder}
                      className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl font-medium text-white transition-colors text-sm border border-white/10"
                    >
                      Save Root ID
                    </button>
                  </div>
                  <p className="text-xs text-sonora-text-muted mt-2">
                    The parent folder ID on Google Drive containing your music library and playlist subfolders.
                  </p>
                </div>

                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">Sync Entire Library</h3>
                    <p className="text-xs text-sonora-text-muted mt-0.5">
                      Last synced: {driveStatus.lastSyncedAt ? new Date(driveStatus.lastSyncedAt).toLocaleString() : 'Never'}
                    </p>
                  </div>
                  <button 
                    onClick={syncDrive}
                    disabled={importing || !driveStatus.folderId}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} className={importing ? "animate-spin" : ""} />
                    {importing ? 'Scanning & Syncing...' : 'Sync All Music'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-sonora-text-muted pt-2 border-t border-white/5">
                  <span>Connection: Active</span>
                  <button
                    onClick={handleConnect}
                    className="text-xs text-sonora-text-muted hover:text-white underline transition-colors"
                  >
                    Re-authenticate / Switch Google Account
                  </button>
                </div>

                {importProgress && (
                  <div className="p-4 bg-white/5 rounded-xl text-xs text-sonora-text-muted space-y-1">
                    <p className="font-medium text-white">Sync In Progress...</p>
                    <p>Total discovered: {importProgress.total} songs</p>
                    <p>Newly indexed: {importProgress.imported} songs</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Featured Drive Playlists & Folder Directories Management */}
          <div className="bg-sonora-surface rounded-2xl p-6 shadow-sm border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-outfit font-semibold flex items-center gap-2.5 text-white">
                  <Sparkles size={22} className="text-pink-400" />
                  Custom Playlists & Folder Directories
                </h2>
                <p className="text-xs sm:text-sm text-sonora-text-muted mt-1">
                  Assign Google Drive folder directories for each playlist (e.g. TaalVibe Special, Old Songs, Romantic Songs)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleScanFolders}
                  disabled={isScanningFolders || !driveStatus?.connected}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Detect folders inside your Google Drive Music folder"
                >
                  <FolderSearch size={15} className={isScanningFolders ? "animate-spin" : "text-blue-400"} />
                  <span>{isScanningFolders ? 'Scanning...' : 'Scan Drive Subfolders'}</span>
                </button>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={15} />
                  <span>Add Playlist</span>
                </button>
              </div>
            </div>

            {/* Subfolders Detected Helper */}
            {discoveredFolders.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1">
                    <Folder size={14} /> Discovered Subfolders in Google Drive ({discoveredFolders.length})
                  </span>
                  <button 
                    onClick={() => setDiscoveredFolders([])}
                    className="text-xs text-blue-400 hover:text-white"
                  >
                    Hide
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  {discoveredFolders.map(f => (
                    <div 
                      key={f.id} 
                      className="bg-black/30 border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{f.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono truncate">{f.id}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(f.id);
                          setStatusMessage(`Copied folder ID for "${f.name}" to clipboard!`);
                          setTimeout(() => setStatusMessage(''), 3000);
                        }}
                        className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition-colors flex-shrink-0"
                      >
                        Copy ID
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Playlist Form */}
            {showAddForm && (
              <form onSubmit={handleCreatePlaylist} className="mb-6 p-5 rounded-2xl bg-white/[0.03] border border-pink-500/30 space-y-4 animate-slide-up">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Plus size={16} className="text-pink-400" />
                  Create New Drive Playlist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Playlist Name *</label>
                    <input 
                      type="text" 
                      required
                      value={newPlaylistName}
                      onChange={e => setNewPlaylistName(e.target.value)}
                      placeholder="e.g. 90s Hits or Sufi Melodies"
                      className="w-full bg-sonora-base border border-sonora-border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Description</label>
                    <input 
                      type="text" 
                      value={newPlaylistDesc}
                      onChange={e => setNewPlaylistDesc(e.target.value)}
                      placeholder="e.g. Evergreen melodies & acoustic classics"
                      className="w-full bg-sonora-base border border-sonora-border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Google Drive Folder ID (Directory)</label>
                  <input 
                    type="text" 
                    value={newPlaylistFolderId}
                    onChange={e => setNewPlaylistFolderId(e.target.value)}
                    placeholder="Paste the folder ID from Google Drive URL"
                    className="w-full bg-sonora-base border border-sonora-border rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md transition-all"
                  >
                    Create Playlist
                  </button>
                </div>
              </form>
            )}

            {/* Playlists List */}
            <div className="space-y-4">
              {featuredPlaylists.length === 0 ? (
                <div className="text-center py-12 text-sonora-text-muted text-sm border border-dashed border-white/10 rounded-2xl">
                  No featured playlists configured.
                </div>
              ) : (
                featuredPlaylists.map(playlist => {
                  const currentFolderValue = editingFolders[playlist.id] ?? (playlist.folderId || '');
                  const isSaving = savingPlaylistId === playlist.id;
                  const isSyncing = syncingPlaylistId === playlist.id;
                  const hasFolder = Boolean(playlist.folderId);

                  return (
                    <div 
                      key={playlist.id} 
                      className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-white/15 transition-all flex flex-col gap-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${playlist.gradient || 'from-pink-500 to-purple-600'} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                            <Music size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-outfit font-bold text-white text-base">
                                {playlist.name}
                              </h3>
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                                {playlist.songCount || 0} {playlist.songCount === 1 ? 'song' : 'songs'}
                              </span>
                            </div>
                            <p className="text-xs text-sonora-text-muted mt-0.5">
                              {playlist.description || 'Google Drive Playlist'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => navigate(`/mood/${playlist.slug || playlist.id}`)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <span>View</span>
                            <ChevronRight size={14} />
                          </button>

                          {hasFolder && (
                            <button
                              onClick={() => handleSyncPlaylist(playlist.id)}
                              disabled={isSyncing}
                              className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                              title="Sync songs from this folder now"
                            >
                              <FolderSync size={13} className={isSyncing ? "animate-spin" : ""} />
                              <span>{isSyncing ? 'Syncing...' : 'Sync Folder'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDeletePlaylist(playlist.id, playlist.name)}
                            className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                            title="Delete playlist"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Folder Directory Input */}
                      <div className="bg-sonora-base/60 p-3 rounded-xl border border-white/5">
                        <label className="block text-[11px] text-zinc-400 mb-1 font-medium">
                          Google Drive Folder ID (Directory for "{playlist.name}"):
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text"
                            value={currentFolderValue}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingFolders(prev => ({ ...prev, [playlist.id]: val }));
                            }}
                            placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j..."
                            className="flex-1 bg-sonora-surface border border-sonora-border rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                          />
                          <button
                            onClick={() => handleSavePlaylistFolder(playlist.id)}
                            disabled={isSaving}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            <Check size={14} />
                            <span>{isSaving ? 'Saving...' : 'Save Folder'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* App Installation */}
      <div className="bg-sonora-surface rounded-2xl p-6 shadow-sm border border-white/5">
        <h2 className="text-xl font-outfit font-semibold mb-4 text-white">
          App Installation
        </h2>
        <div className="text-sonora-text-muted space-y-2 text-sm leading-relaxed">
          <p>You can install TaalVibe directly to your device for an immersive full-screen music experience:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>iPhone / iPad (iOS Safari):</strong> Tap the Share button (<span className="text-blue-400 font-bold">⍐</span>) in Safari's toolbar and select <span className="text-pink-400 font-semibold">"Add to Home Screen"</span>.</li>
            <li><strong>Android / Chrome / Desktop:</strong> Click the <span className="text-white font-semibold">Download App</span> button in the top banner or select <span className="text-white font-semibold">"Install app"</span> from your browser menu.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
