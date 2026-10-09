import React, { useState } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import { Play, Plus, ListMusic, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Playlists = () => {
  const { playlists, createPlaylist } = useLibrary();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const navigate = useNavigate();

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    await createPlaylist(newPlaylistName, '');
    setNewPlaylistName('');
    setIsCreating(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 md:pt-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-outfit font-black text-white mb-2 tracking-tight drop-shadow-sm">Your Playlists</h1>
          <p className="text-sonora-text-muted font-medium">Curate your perfect collections</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 rounded-full shadow-lg hover:shadow-sonora-primary/20 transition-all"
        >
          <Plus size={20} />
          <span className="font-bold tracking-wide">New Playlist</span>
        </button>
      </div>

      {/* Create form */}
      {isCreating && (
        <form onSubmit={handleCreatePlaylist} className="bg-sonora-surface/80 p-5 rounded-2xl border border-sonora-border flex flex-col sm:flex-row gap-4 items-center shadow-lg backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Name your new playlist..."
            className="w-full sm:flex-1 bg-black/50 border border-white/10 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-sonora-primary/50 focus:ring-1 focus:ring-sonora-primary/50 transition-all text-lg"
            autoFocus
          />
          <div className="flex w-full sm:w-auto gap-3">
            <button type="button" onClick={() => setIsCreating(false)} className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white/5 text-sonora-text-muted hover:text-white hover:bg-white/10 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 sm:flex-none btn-primary px-8 py-3 rounded-xl font-bold">
              Create
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mt-4">
        {playlists.map((playlist, idx) => {
          // generate a deterministic gradient based on id
          const gradients = [
            'from-[#4facfe] to-[#00f2fe]',
            'from-[#ff0f7b] to-[#f89b29]',
            'from-[#8E2DE2] to-[#4A00E0]',
            'from-[#11998e] to-[#38ef7d]',
            'from-[#FA709A] to-[#FEE140]',
            'from-[#a18cd1] to-[#fbc2eb]',
            'from-[#fccb90] to-[#d57eeb]'
          ];
          const grad = gradients[playlist.id % gradients.length];
          
          return (
            <div 
              key={playlist.id} 
              className="group cursor-pointer flex flex-col" 
              onClick={() => navigate(`/playlists/${playlist.id}`)}
            >
              <div className="w-full aspect-square bg-sonora-surface rounded-2xl mb-3 overflow-hidden relative shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                {playlist.cover_art_url ? (
                  <img src={playlist.cover_art_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${grad} transition-transform duration-700 group-hover:scale-110`}>
                    <Music size={48} className="text-white opacity-90 drop-shadow-md mb-2" />
                  </div>
                )}
                
                {/* Overlay play button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-14 h-14 rounded-full bg-sonora-primary text-black flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-sonora-primary/30">
                    <Play size={24} className="fill-current ml-1" />
                  </div>
                </div>
              </div>
              <div className="px-1">
                <h4 className="font-outfit font-bold text-white text-base truncate mb-0.5">{playlist.name}</h4>
                <p className="text-xs text-sonora-text-muted font-medium truncate">Playlist • TaalVibe</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {playlists.length === 0 && !isCreating && (
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed border-sonora-border/50 rounded-3xl bg-sonora-surface/20">
          <div className="w-20 h-20 bg-sonora-surface rounded-full flex items-center justify-center mb-6 shadow-inner">
            <ListMusic size={36} className="text-sonora-text-muted" />
          </div>
          <h4 className="font-outfit font-bold text-2xl text-white mb-3">No playlists yet</h4>
          <p className="text-sonora-text-muted text-base text-center mb-8 max-w-sm">
            Create your first playlist to start organizing your favorite tracks.
          </p>
          <button onClick={() => setIsCreating(true)} className="btn-primary px-8 py-3 rounded-full text-base font-bold shadow-lg">
            <Plus size={20} className="mr-2" />
            Create Playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default Playlists;
