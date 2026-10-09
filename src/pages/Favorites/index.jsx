import React, { useState } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { Play, Heart, ListMusic } from 'lucide-react';
import SongRow from '../../components/common/SongRow';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';

const Favorites = () => {
  const { songs, toggleFavorite } = useLibrary();
  const { playContext } = usePlayer();
  const [modalSongId, setModalSongId] = useState(null);

  const favoriteSongs = songs.filter(song => song.favorite);

  const handlePlaySong = (index) => {
    playContext(favoriteSongs, index);
  };

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      playContext(favoriteSongs, 0);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-24 md:pb-8">
      {/* Header section */}
      <div className="flex items-start md:items-end gap-6 relative flex-col md:flex-row pt-4 md:pt-8">
        
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-[#ff0f7b] to-[#f89b29] flex items-center justify-center shadow-2xl shadow-black/40 flex-shrink-0">
          <Heart size={64} className="text-white fill-white opacity-90 drop-shadow-md" />
        </div>
        
        <div className="flex-1 pb-2">
          <p className="text-xs uppercase tracking-widest font-bold text-sonora-text-muted mb-2">Playlist</p>
          <h1 className="text-4xl md:text-6xl font-outfit font-black text-white mb-4 tracking-tight drop-shadow-md">
            Favorites
          </h1>
          <p className="text-white/80 font-medium mb-4 max-w-xl">
            All your loved tracks in one place.
          </p>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePlayAll}
              disabled={favoriteSongs.length === 0}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-sonora-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sonora-primary/30 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Play size={24} className="fill-current ml-1" />
            </button>
            <p className="text-sonora-text-muted font-medium text-sm">
              {favoriteSongs.length} {favoriteSongs.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex-1">
        {favoriteSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-sonora-border rounded-2xl bg-sonora-surface/50">
            <Heart size={48} className="text-sonora-text-muted mb-4" />
            <h4 className="font-outfit font-medium text-lg text-white mb-2">No favorites yet</h4>
            <p className="text-sonora-text-muted text-sm text-center">
              Heart songs from your library to add them to your favorites.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {favoriteSongs.map((song, index) => (
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

export default Favorites;
