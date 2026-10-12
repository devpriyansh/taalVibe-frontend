import React, { useEffect } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import { X } from 'lucide-react';

const AddToPlaylistModal = ({ songId, onClose }) => {
  const { playlists, addSongToPlaylist } = useLibrary();

  useEffect(() => {
    window.history.pushState({ modal: 'add-to-playlist' }, '');
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  const handleClose = () => {
    if (window.history.state?.modal === 'add-to-playlist') {
      window.history.back();
    } else {
      onClose();
    }
  };

  const handleAdd = async (playlistId) => {
    await addSongToPlaylist(playlistId, songId);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={handleClose}>
      <div 
        className="bg-sonora-base border border-sonora-border p-6 rounded-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-outfit font-bold text-xl text-sonora-text">Add to Playlist</h3>
          <button onClick={handleClose} className="p-2 text-sonora-text-muted hover:text-white" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {playlists.length === 0 ? (
            <p className="text-sonora-text-muted text-center py-4">No playlists available.</p>
          ) : (
            playlists.map(pl => (
              <button 
                key={pl.id}
                className="w-full text-left p-3 rounded-lg hover:bg-sonora-surface text-sonora-text transition-colors"
                onClick={() => handleAdd(pl.id)}
              >
                {pl.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
