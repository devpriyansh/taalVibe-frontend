import React, { useState } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { Search as SearchIcon, Play, Heart, ListMusic } from 'lucide-react';

const Search = () => {
  const { songs, toggleFavorite } = useLibrary();
  const { playContext } = usePlayer();
  const [query, setQuery] = useState('');

  const searchResults = query.trim() === '' ? [] : songs.filter(song => {
    const q = query.toLowerCase();
    return (song.title?.toLowerCase().includes(q) || 
            song.artist?.toLowerCase().includes(q) || 
            song.album?.toLowerCase().includes(q));
  });

  const handlePlaySong = (index) => {
    playContext(searchResults, index);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="sticky top-0 bg-sonora-base/90 backdrop-blur-md z-10 pt-safe pb-4 -mx-4 px-4 md:-mx-10 md:px-10">
        <h1 className="text-3xl font-outfit font-bold text-sonora-text mb-4">Search</h1>
        <div className="relative">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-sonora-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Artists, songs, or albums"
            className="w-full bg-sonora-surface border border-sonora-border text-sonora-text pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-sonora-primary transition-colors text-lg"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {query.trim() === '' ? (
          <div className="grid grid-cols-2 gap-4 mt-2 px-4 md:px-0">
            {/* Quick Browse Categories */}
            {['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic', 'Classical'].map((genre, i) => {
              const gradients = [
                'from-pink-500 to-rose-500',
                'from-purple-500 to-indigo-500',
                'from-blue-500 to-cyan-500',
                'from-emerald-500 to-teal-500',
                'from-amber-500 to-orange-500',
                'from-red-500 to-pink-500'
              ];
              return (
                <div key={genre} className={`aspect-[2/1.2] rounded-xl flex items-center justify-center p-4 font-outfit font-bold text-xl text-white shadow-lg bg-gradient-to-br ${gradients[i % gradients.length]} hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer relative overflow-hidden`}>
                  <span className="relative z-10">{genre}</span>
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {searchResults.length === 0 ? (
              <div className="text-center py-10 text-sonora-text-muted">
                No results found for "{query}"
              </div>
            ) : (
              searchResults.map((song, index) => (
                <div 
                  key={song.id} 
                  className="flex items-center gap-4 p-2 md:p-3 rounded-xl hover:bg-sonora-surface-hover transition-colors group cursor-pointer"
                  onClick={() => handlePlaySong(index)}
                >
                  <img src="/default-cover.jpg" alt={song.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-outfit font-semibold text-sonora-text truncate">{song.title}</h4>
                    <p className="text-sm text-sonora-text-muted truncate">{song.artist || 'Unknown Artist'}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                    className="p-2 text-sonora-text-muted hover:text-red-500 transition-colors"
                  >
                    <Heart size={20} className={song.favorite ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
