import React from 'react';
import { Play, Heart, Plus, MoreVertical } from 'lucide-react';

const SongRow = ({ song, index, onPlay, onToggleFavorite, onAddToPlaylist }) => {
  return (
    <div 
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-sonora-surface-hover transition-colors group cursor-pointer"
      onClick={() => onPlay(index)}
    >
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img src="/default-cover.jpg" alt={song.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play size={16} className="text-white ml-1" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-outfit font-semibold text-sonora-text truncate text-sm md:text-base">{song.title}</h4>
        <p className="text-xs md:text-sm text-sonora-text-muted truncate">{song.artist || 'Unknown Artist'}</p>
      </div>
      
      <div className="flex items-center gap-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(song.id); }}
          className="p-2 text-sonora-text-muted hover:text-red-500 transition-colors"
        >
          <Heart size={18} className={song.favorite ? 'fill-red-500 text-red-500' : ''} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song.id); }}
          className="p-2 text-sonora-text-muted hover:text-blue-400 transition-colors hidden md:block"
        >
          <Plus size={18} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); /* Future feature: open action menu */ }}
          className="p-2 text-sonora-text-muted hover:text-white transition-colors md:hidden"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default SongRow;
