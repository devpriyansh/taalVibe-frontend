import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '../../contexts/LibraryContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { Play, ArrowLeft, HeartPulse, Car, Moon, Coffee } from 'lucide-react';
import SongRow from '../../components/common/SongRow';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';

const MOODS = {
  party: {
    title: 'Party Vibes',
    desc: 'Upbeat pop, dance, and electronic tracks to keep the energy high.',
    gradient: 'from-[#ff0f7b] to-[#f89b29]',
    icon: HeartPulse,
    filter: (s) => {
      const g = (s.genre || '').toLowerCase();
      return g.includes('pop') || g.includes('dance') || g.includes('electronic') || g.includes('hip hop') || g.includes('remix');
    },
    fallbackSeed: 1
  },
  driving: {
    title: 'Driving',
    desc: 'Rock, metal, and alternative anthems for the open road.',
    gradient: 'from-[#4facfe] to-[#00f2fe]',
    icon: Car,
    filter: (s) => {
      const g = (s.genre || '').toLowerCase();
      return g.includes('rock') || g.includes('metal') || g.includes('rap') || g.includes('alternative');
    },
    fallbackSeed: 2
  },
  sad: {
    title: 'Late Night Sad',
    desc: 'Acoustic, R&B, and soulful tracks for those deep thoughts.',
    gradient: 'from-[#8E2DE2] to-[#4A00E0]',
    icon: Moon,
    filter: (s) => {
      const g = (s.genre || '').toLowerCase();
      return g.includes('acoustic') || g.includes('r&b') || g.includes('soul') || g.includes('blues');
    },
    fallbackSeed: 3
  },
  chill: {
    title: 'Travel & Focus',
    desc: 'Jazz, classical, and lo-fi beats to keep you centered.',
    gradient: 'from-[#11998e] to-[#38ef7d]',
    icon: Coffee,
    filter: (s) => {
      const g = (s.genre || '').toLowerCase();
      return g.includes('jazz') || g.includes('classical') || g.includes('lo-fi') || g.includes('ambient');
    },
    fallbackSeed: 4
  }
};

const MoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { songs, toggleFavorite } = useLibrary();
  const { playContext } = usePlayer();
  const [modalSongId, setModalSongId] = useState(null);

  const moodConfig = MOODS[id];

  const moodSongs = useMemo(() => {
    if (!moodConfig) return [];
    
    // 1. Try to find actual matches via genre
    const matches = songs.filter(moodConfig.filter);
    if (matches.length >= 3) return matches;
    
    // 2. Fallback to a deterministic playlist if library doesn't have exact genres
    return songs.filter(s => (s.id.charCodeAt(0) + moodConfig.fallbackSeed) % 2 === 0);
  }, [songs, moodConfig]);

  if (!moodConfig) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl text-white font-bold mb-4">Mood not found</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">Go Home</button>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (moodSongs.length > 0) {
      playContext(moodSongs, 0);
    }
  };

  const handlePlaySong = (index) => {
    playContext(moodSongs, index);
  };

  const Icon = moodConfig.icon;

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-24 md:pb-8">
      
      {/* Header section */}
      <div className="flex items-start md:items-end gap-6 relative flex-col md:flex-row pt-4 md:pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-0 left-0 md:-top-4 p-2 text-sonora-text-muted hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className={`w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br ${moodConfig.gradient} flex items-center justify-center shadow-2xl shadow-black/40 mt-8 md:mt-0 flex-shrink-0`}>
          <Icon size={64} className="text-white opacity-90 drop-shadow-md" />
        </div>
        
        <div className="flex-1 pb-2">
          <p className="text-xs uppercase tracking-widest font-bold text-sonora-text-muted mb-2">Mood Playlist</p>
          <h1 className="text-4xl md:text-6xl font-outfit font-black text-white mb-4 tracking-tight drop-shadow-md">
            {moodConfig.title}
          </h1>
          <p className="text-white/80 font-medium mb-4 max-w-xl">{moodConfig.desc}</p>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePlayAll}
              disabled={moodSongs.length === 0}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-sonora-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sonora-primary/30 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Play size={24} className="fill-current ml-1" />
            </button>
            <p className="text-sonora-text-muted font-medium text-sm">
              {moodSongs.length} {moodSongs.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="mt-8 flex-1">
        {moodSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-sonora-border rounded-2xl bg-sonora-surface/50">
            <Icon size={48} className="text-sonora-text-muted mb-4" />
            <h4 className="font-outfit font-medium text-lg text-white mb-2">No matching songs</h4>
            <p className="text-sonora-text-muted text-sm text-center">
              Add more songs to your library to build this mood.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {moodSongs.map((song, index) => (
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
