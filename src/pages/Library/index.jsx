import React, { useState } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { Play, ListMusic, Plus, Search, Loader2, Music, Filter } from 'lucide-react';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';
import SongRow from '../../components/common/SongRow';

const Library = () => {
  const { songs, isLoading, importing, syncDrive, toggleFavorite } = useLibrary();
  const { playContext } = usePlayer();
  const [modalSongId, setModalSongId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');

  const handlePlaySong = (index, filteredSongs) => {
    // We pass the filtered list to the player queue
    playContext(filteredSongs, index);
  };

  const handlePlayAll = () => {
    if (displayedSongs.length > 0) {
      playContext(displayedSongs, 0);
    }
  };

  const artists = [...new Set(songs.map(s => s.artist).filter(Boolean))].sort();
  const albums = [...new Set(songs.map(s => s.album).filter(Boolean))].sort();

  const displayedSongs = songs.filter(song => {
    if (selectedArtist && song.artist !== selectedArtist) return false;
    if (selectedAlbum && song.album !== selectedAlbum) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!song.title?.toLowerCase().includes(q) && !song.artist?.toLowerCase().includes(q) && !song.album?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-24 md:pb-8">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-4 md:pt-8">
        
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#00c6ff] to-[#0072ff] flex items-center justify-center shadow-xl shadow-blue-500/20 flex-shrink-0">
            <Music size={48} className="text-white opacity-90 drop-shadow-md" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-sonora-text-muted mb-1">Collection</p>
            <h1 className="text-4xl md:text-5xl font-outfit font-black text-white mb-2 tracking-tight drop-shadow-sm">Your Library</h1>
            <p className="text-white/70 font-medium">{songs.length} songs synced</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={syncDrive} 
            disabled={importing} 
            className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {importing ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            {importing ? 'Syncing...' : 'Sync Drive'}
          </button>
          <button 
            onClick={handlePlayAll}
            disabled={displayedSongs.length === 0}
            className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 rounded-full shadow-lg hover:shadow-sonora-primary/20 transition-all disabled:opacity-50"
          >
            <Play size={18} className="fill-current" />
            <span className="font-bold tracking-wide">Play All</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-sonora-surface/50 p-3 rounded-2xl border border-sonora-border flex flex-wrap items-center gap-3 mt-4">
        <div className="flex items-center gap-2 text-sonora-text-muted px-2">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <select 
          value={selectedArtist} 
          onChange={e => setSelectedArtist(e.target.value)}
          className="bg-black/40 border border-white/10 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-sonora-primary/50 text-sm w-36 sm:w-48 truncate cursor-pointer hover:bg-black/60 transition-colors"
        >
          <option value="">All Artists</option>
          {artists.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        
        <select 
          value={selectedAlbum} 
          onChange={e => setSelectedAlbum(e.target.value)}
          className="bg-black/40 border border-white/10 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-sonora-primary/50 text-sm w-36 sm:w-48 truncate cursor-pointer hover:bg-black/60 transition-colors"
        >
          <option value="">All Albums</option>
          {albums.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sonora-text-muted" />
          <input 
            type="text" 
            placeholder="Search songs, artists, albums..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-sonora-primary/50 transition-colors text-sm placeholder:text-sonora-text-muted/60"
          />
        </div>
      </div>

      {/* List */}
      <div className="mt-2 flex-1">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl animate-pulse">
                <div className="w-12 h-12 bg-sonora-surface rounded-lg flex-shrink-0 border border-sonora-border"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-sonora-surface rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-sonora-surface/50 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed border-sonora-border/50 rounded-3xl bg-sonora-surface/20">
            <div className="w-20 h-20 rounded-full bg-sonora-surface flex items-center justify-center mb-6 shadow-inner">
              <ListMusic size={36} className="text-sonora-text-muted" />
            </div>
            <h4 className="font-outfit font-bold text-2xl text-white mb-3">No songs found</h4>
            <p className="text-sonora-text-muted text-base mb-6 max-w-md text-center">
              Try adjusting your filters or syncing your Drive to find more music.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {displayedSongs.map((song, index) => (
              <SongRow 
                key={song.id} 
                song={song} 
                index={index} 
                onPlay={(idx) => handlePlaySong(idx, displayedSongs)} 
                onToggleFavorite={toggleFavorite} 
                onAddToPlaylist={setModalSongId} 
              />
            ))}
          </div>
        )}
      </div>
      
      {modalSongId && (
        <AddToPlaylistModal songId={modalSongId} onClose={() => setModalSongId(null)} />
      )}
    </div>
  );
};

export default Library;
