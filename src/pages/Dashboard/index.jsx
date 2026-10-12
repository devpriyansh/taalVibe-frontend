import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { Play, Heart, Clock, ListMusic, Settings, MoreVertical, Plus, Download, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CloudMusicService from '../../services/CloudMusicService';
import { usePWAInstall } from '../../contexts/PWAInstallContext';
import SongRow from '../../components/common/SongRow';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { isStandalone, promptInstall } = usePWAInstall();
  const { songs, recentPlays, toggleFavorite } = useLibrary();
  const { playContext } = usePlayer();
  const [modalSongId, setModalSongId] = React.useState(null);
  const [drivePlaylists, setDrivePlaylists] = React.useState(() => {
    try {
      const cached = sessionStorage.getItem('tv_drive_playlists');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [
      { id: 1, name: 'TaalVibe Special', slug: 'taalvibe-special', description: 'Handpicked hits & exclusive tracks', gradient: 'from-[#ff0f7b] to-[#f89b29]' },
      { id: 2, name: 'Old Songs', slug: 'old-songs', description: 'Golden retro hits & evergreen melodies', gradient: 'from-[#4facfe] to-[#00f2fe]', songCount: 99 },
      { id: 3, name: 'Romantic Songs', slug: 'romantic-songs', description: 'Soulful acoustic & love melodies', gradient: 'from-[#8E2DE2] to-[#4A00E0]' },
      { id: 4, name: 'Feel Good & Chill', slug: 'feel-good', description: 'Uplifting beats & pleasant vibes', gradient: 'from-[#11998e] to-[#38ef7d]' },
    ];
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    CloudMusicService.getFeaturedPlaylists()
      .then((data) => {
        if (data && data.length > 0) {
          setDrivePlaylists(data);
          try {
            sessionStorage.setItem('tv_drive_playlists', JSON.stringify(data));
          } catch {}
        }
      })
      .catch((err) => {
        console.warn('Failed to load featured playlists:', err);
      });
  }, []);

  const handlePlaySong = (songsArray, index) => {
    playContext(songsArray, index);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Combine recent plays and songs for a "Jump Back In" quick picks section
  const quickPicks = [...recentPlays, ...songs].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i).slice(0, 6);

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-24 md:pb-8">
      
      {/* Top Header Section */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <div className="flex-1 min-w-0 flex items-center justify-start overflow-hidden">
          <img 
            src="/taalvibe-logo.jpg" 
            alt="TaalVibe" 
            className="w-40 sm:w-64 md:w-72 h-14 sm:h-16 md:h-20 object-cover object-left mix-blend-screen scale-[1.2] sm:scale-[1.3] origin-left -ml-1.5 sm:-ml-2" 
          />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isStandalone && (
            <button
              onClick={promptInstall}
              className="w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30 hover:border-pink-500/60 text-white transition-all text-xs sm:text-sm font-semibold shadow-md hover:shadow-pink-500/20 hover:scale-105 active:scale-95 flex items-center justify-center sm:gap-2 shrink-0"
              title="Download & Install TaalVibe App"
              aria-label="Download App"
            >
              <Download size={18} className="text-pink-400 shrink-0" />
              <span className="hidden sm:inline">Download App</span>
            </button>
          )}
          <Link 
            to="/settings" 
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all shadow-sm shrink-0"
            aria-label="Settings"
          >
            <Settings size={20} />
          </Link>
          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 font-bold text-white shadow-lg border border-white/10 shrink-0">
            {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Featured Playlists from Google Drive */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-outfit font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles size={22} className="text-pink-400" />
              Featured Playlists
            </h2>
            <p className="text-xs sm:text-sm text-sonora-text-muted mt-0.5">
              Curated playlists streamed directly from your Google Drive
            </p>
          </div>
          {user?.role === 'admin' && (
            <Link
              to="/settings"
              className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 bg-pink-500/10 hover:bg-pink-500/20 px-3 py-1.5 rounded-full border border-pink-500/20 transition-colors"
            >
              Manage Folders →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {drivePlaylists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => navigate(`/mood/${pl.slug || pl.id}`)}
              className="relative overflow-hidden rounded-2xl h-32 md:h-40 group text-left shadow-lg hover:shadow-2xl border border-white/10 hover:border-white/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Background gradient & styling */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pl.gradient || 'from-pink-500 to-purple-600'} opacity-80 group-hover:opacity-95 transition-opacity`}></div>
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                <div className="flex items-start justify-between">
                  <span className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm border border-white/20">
                    <ListMusic size={16} />
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/40 text-white/90 border border-white/10 backdrop-blur-sm">
                    {pl.songCount !== undefined ? `${pl.songCount} ${pl.songCount === 1 ? 'song' : 'songs'}` : 'Drive'}
                  </span>
                </div>

                <div>
                  <h3 className="font-outfit font-bold text-base md:text-lg text-white drop-shadow-md leading-snug line-clamp-1">
                    {pl.name}
                  </h3>
                  <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">
                    {pl.description || 'Google Drive Playlist'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recently Added (Horizontal Scrolling Carousel) */}
      {songs.length > 0 && (
        <section className="mb-4">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-outfit font-bold text-white tracking-tight hover:underline cursor-pointer" onClick={() => navigate('/library')}>
              Recently Added
            </h2>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {songs.slice(0, 10).map((song, index) => (
              <div key={song.id} className="flex-shrink-0 w-36 md:w-48 snap-start group text-left flex flex-col relative">
                <div 
                  className="relative mb-3 cursor-pointer"
                  onClick={() => handlePlaySong(songs, index)}
                >
                  <img 
                    src="/default-cover.jpg" 
                    className="w-full aspect-square object-cover rounded-[16px] shadow-lg group-hover:shadow-2xl group-hover:shadow-sonora-primary/20 transition-all duration-300" 
                    alt={song.title} 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[16px] flex items-center justify-center">
                    <div className="w-12 h-12 bg-sonora-primary rounded-full flex items-center justify-center text-black shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <Play size={24} className="fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="text-sm md:text-base font-bold text-white truncate w-full pr-6" title={song.title}>
                  {song.title}
                </h3>
                <p className="text-xs md:text-sm text-sonora-text-muted truncate w-full" title={song.artist}>
                  {song.artist}
                </p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setModalSongId(song.id); }}
                  className="absolute bottom-0 right-0 p-1 text-sonora-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Played List */}
      <section className="flex-1">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-outfit font-bold text-white tracking-tight">Recently Played</h2>
        </div>
        
        {recentPlays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-sonora-border rounded-2xl bg-sonora-surface/50">
            <Clock size={32} className="text-sonora-text-muted mb-4" />
            <h4 className="font-outfit font-medium text-lg text-white mb-2">No Recent Plays</h4>
            <p className="text-sonora-text-muted text-sm mb-6 text-center">
              Start playing some music from your library to see your history here.
            </p>
            <Link to="/library" className="btn-primary flex items-center gap-2">
              <ListMusic size={18} /> Go to Library
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1 pb-4">
            {recentPlays.slice(0, 8).map((song, index) => (
              <SongRow 
                key={song.id} 
                song={song} 
                index={index} 
                onPlay={(idx) => handlePlaySong(recentPlays, idx)} 
                onToggleFavorite={toggleFavorite} 
                onAddToPlaylist={setModalSongId} 
              />
            ))}
          </div>
        )}
      </section>

      {modalSongId && (
        <AddToPlaylistModal 
          songId={modalSongId} 
          onClose={() => setModalSongId(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;