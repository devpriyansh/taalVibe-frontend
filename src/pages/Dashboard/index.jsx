import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { Play, Heart, Clock, ListMusic, Settings, MoreVertical, Plus, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePWAInstall } from '../../contexts/PWAInstallContext';
import SongRow from '../../components/common/SongRow';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { isStandalone, promptInstall } = usePWAInstall();
  const { songs, recentPlays, toggleFavorite } = useLibrary();
  const { playContext } = usePlayer();
  const [modalSongId, setModalSongId] = React.useState(null);
  const navigate = useNavigate();

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 flex items-center justify-start overflow-hidden">
          <img 
            src="/taalvibe-logo.jpg" 
            alt="TaalVibe" 
            className="w-48 sm:w-64 md:w-72 h-16 md:h-20 object-cover object-left mix-blend-screen scale-[1.3] origin-left -ml-2" 
          />
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          {!isStandalone && (
            <button
              onClick={promptInstall}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30 hover:border-pink-500/60 text-white transition-all text-xs sm:text-sm font-semibold shadow-md hover:shadow-pink-500/20 hover:scale-105 active:scale-95"
              title="Download & Install TaalVibe App"
            >
              <Download size={15} className="text-pink-400" />
              <span>Download App</span>
            </button>
          )}
          <Link to="/settings" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all shadow-sm">
            <Settings size={20} />
          </Link>
          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 font-bold text-white shadow-lg border border-white/10">
            {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Moods & Moments (Driving, Party, Sad, Chill) */}
      <section className="mb-4">
        <h2 className="text-2xl font-outfit font-bold text-white mb-4 tracking-tight">Moods & Moments</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          
          {/* Party Playlist */}
          <button
            onClick={() => navigate('/mood/party')}
            className="relative overflow-hidden rounded-2xl h-28 md:h-36 group text-left shadow-lg hover:shadow-2xl border border-white/10 hover:border-white/25 transition-all duration-300"
          >
            <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
              <img src="/moods/party.jpg" alt="Party Vibes" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            </div>
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
              <h3 className="font-outfit font-bold text-lg md:text-xl text-white drop-shadow-md">Party Vibes</h3>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <Play size={18} className="text-white fill-white ml-1" />
              </div>
            </div>
          </button>

          {/* Driving Playlist */}
          <button
            onClick={() => navigate('/mood/driving')}
            className="relative overflow-hidden rounded-2xl h-28 md:h-36 group text-left shadow-lg hover:shadow-2xl border border-white/10 hover:border-white/25 transition-all duration-300"
          >
            <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
              <img src="/moods/driving.jpg" alt="Driving" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            </div>
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
              <h3 className="font-outfit font-bold text-lg md:text-xl text-white drop-shadow-md">Driving</h3>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <Play size={18} className="text-white fill-white ml-1" />
              </div>
            </div>
          </button>

          {/* Sad/Chill Playlist */}
          <button
            onClick={() => navigate('/mood/sad')}
            className="relative overflow-hidden rounded-2xl h-28 md:h-36 group text-left shadow-lg hover:shadow-2xl border border-white/10 hover:border-white/25 transition-all duration-300"
          >
            <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
              <img src="/moods/sad.jpg" alt="Late Night Sad" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            </div>
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
              <h3 className="font-outfit font-bold text-lg md:text-xl text-white drop-shadow-md">Late Night Sad</h3>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <Play size={18} className="text-white fill-white ml-1" />
              </div>
            </div>
          </button>

          {/* Focus/Travel Playlist */}
          <button
            onClick={() => navigate('/mood/chill')}
            className="relative overflow-hidden rounded-2xl h-28 md:h-36 group text-left shadow-lg hover:shadow-2xl border border-white/10 hover:border-white/25 transition-all duration-300"
          >
            <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
              <img src="/moods/chill.jpg" alt="Travel & Focus" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            </div>
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
              <h3 className="font-outfit font-bold text-lg md:text-xl text-white drop-shadow-md">Travel & Focus</h3>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <Play size={18} className="text-white fill-white ml-1" />
              </div>
            </div>
          </button>

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
                    src={song.coverUrl || '/default-cover.jpg'} 
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