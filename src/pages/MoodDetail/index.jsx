import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLibrary } from '../../contexts/LibraryContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { useAuth } from '../../contexts/AuthContext';
import { Play, ArrowLeft, ListMusic, Sparkles, FolderSync, Settings } from 'lucide-react';
import CloudMusicService from '../../services/CloudMusicService';
import SongRow from '../../components/common/SongRow';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';

const DEFAULT_PLAYLISTS = {
  'taalvibe-special': {
    name: 'TaalVibe Special',
    description: 'Handpicked hits, trending beats & exclusive tracks',
    gradient: 'from-[#ff0f7b] to-[#f89b29]'
  },
  'old-songs': {
    name: 'Old Songs',
    description: 'Golden retro hits, timeless classics & pure nostalgia',
    gradient: 'from-[#4facfe] to-[#00f2fe]'
  },
  'romantic-songs': {
    name: 'Romantic Songs',
    description: 'Soulful acoustic & heartwarming love melodies',
    gradient: 'from-[#8E2DE2] to-[#4A00E0]'
  },
  'feel-good': {
    name: 'Feel Good & Chill',
    description: 'Uplifting beats, breezy rhythms & relaxing vibes',
    gradient: 'from-[#11998e] to-[#38ef7d]'
  }
};

const MoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleFavorite } = useLibrary();
  const { playContext } = usePlayer();
  const [modalSongId, setModalSongId] = useState(null);

  const [playlist, setPlaylist] = useState(() => DEFAULT_PLAYLISTS[id] || {
    name: id ? id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Drive Playlist',
    description: 'Google Drive Playlist',
    gradient: 'from-pink-500 to-purple-600'
  });
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchPlaylistDetail = () => {
    setIsLoading(true);
    CloudMusicService.getFeaturedPlaylist(id)
      .then((data) => {
        if (data?.playlist) {
          setPlaylist(data.playlist);
        }
        if (data?.songs) {
          setSongs(data.songs);
        }
      })
      .catch((err) => {
        console.warn('Error fetching playlist detail:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPlaylistDetail();
  }, [id]);

  const handleSyncFolder = async () => {
    if (!playlist?.id) return;
    try {
      setIsSyncing(true);
      await CloudMusicService.syncFeaturedPlaylist(playlist.id);
      fetchPlaylistDetail();
    } catch (err) {
      alert('Sync failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playContext(songs, 0);
    }
  };

  const handlePlaySong = (index) => {
    playContext(songs, index);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-24 md:pb-8">
      {/* Top Back Action Bar */}
      <div>
        <button 
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white/90 hover:text-white transition-all text-xs font-semibold shadow-sm"
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Header section */}
      <div className="flex items-start md:items-end gap-6 relative flex-col md:flex-row">

        <div className={`w-36 h-36 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br ${playlist.gradient || 'from-pink-500 to-purple-600'} flex items-center justify-center shadow-2xl shadow-black/50 mt-8 md:mt-0 flex-shrink-0 border border-white/10 relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
          <ListMusic size={64} className="text-white opacity-90 drop-shadow-lg relative z-10" />
        </div>
        
        <div className="flex-1 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles size={11} /> Google Drive Playlist
            </span>
            {playlist.folderId && (
              <span className="text-[10px] text-zinc-400 font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                Folder: {playlist.folderId.substring(0, 10)}...
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black text-white mb-2 tracking-tight drop-shadow-md">
            {playlist.name}
          </h1>
          <p className="text-white/80 font-medium mb-4 max-w-xl text-sm sm:text-base">
            {playlist.description || 'Playlist synced directly from Google Drive'}
          </p>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePlayAll}
              disabled={songs.length === 0}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-500/30 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
              title="Play All"
            >
              <Play size={24} className="fill-current ml-1" />
            </button>
            <p className="text-sonora-text-muted font-medium text-sm">
              {songs.length} {songs.length === 1 ? 'song' : 'songs'}
            </p>

            {user?.role === 'admin' && playlist.folderId && (
              <button
                onClick={handleSyncFolder}
                disabled={isSyncing}
                className="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors ml-auto md:ml-2 disabled:opacity-50"
                title="Sync songs from this Drive folder"
              >
                <FolderSync size={13} className={isSyncing ? "animate-spin text-pink-400" : "text-pink-400"} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Folder'}</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/settings"
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors ml-2"
              >
                <Settings size={13} /> Edit Folder
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="mt-6 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-sonora-text-muted font-outfit">
            Loading playlist songs from Google Drive...
          </div>
        ) : songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-sonora-border rounded-3xl bg-sonora-surface/40 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-sonora-text-muted mb-4 border border-white/5">
              <FolderSync size={28} />
            </div>
            <h4 className="font-outfit font-semibold text-lg text-white mb-2">
              No songs in this Drive folder yet
            </h4>
            <p className="text-sonora-text-muted text-sm max-w-md mb-6 leading-relaxed">
              {playlist.folderId
                ? 'Songs have not been synced from this Google Drive folder into the library yet.'
                : 'The Google Drive folder ID for this playlist has not been assigned yet.'}
            </p>

            {playlist.folderId && user?.role === 'admin' && (
              <button
                onClick={handleSyncFolder}
                disabled={isSyncing}
                className="btn-primary px-5 py-2.5 text-sm rounded-xl flex items-center gap-2 mb-3 shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <FolderSync size={16} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing ? 'Syncing Drive Songs...' : 'Sync Songs from Drive Now'}
              </button>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/settings"
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-2 underline underline-offset-4"
              >
                <Settings size={14} /> Configure Playlist Folder in Settings
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {songs.map((song, index) => (
              <SongRow 
                key={song.id} 
                song={song} 
                index={index} 
                onPlay={() => handlePlaySong(index)} 
                onToggleFavorite={toggleFavorite} 
                onAddToPlaylist={setModalSongId} 
              />
            ))}
          </div>
        )}
      </div>

      {modalSongId && (
        <AddToPlaylistModal 
          songId={modalSongId} 
          onClose={() => setModalSongId(null)} 
        />
      )}
    </div>
  );
};

export default MoodDetail;
