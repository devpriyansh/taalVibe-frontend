import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '../../contexts/LibraryContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { Play, ListMusic, Trash2, Edit2, X } from 'lucide-react';
import CloudMusicService from '../../services/CloudMusicService';
import SongRow from '../../components/common/SongRow';

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, deletePlaylist, renamePlaylist, removeSongFromPlaylist, reorderPlaylistSong, toggleFavorite } = useLibrary();
  const { playContext } = usePlayer();

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    const pl = playlists.find(p => p.id.toString() === id);
    if (pl) {
      setPlaylist(pl);
      setEditName(pl.name);
      setEditDesc(pl.description || '');
      
      CloudMusicService.getPlaylistSongs(id)
        .then(data => {
          setSongs(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [id, playlists]);

  const handleDeletePlaylist = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      await deletePlaylist(playlist.id);
      navigate('/playlists');
    }
  };

  const handleSaveEdit = async () => {
    await renamePlaylist(playlist.id, editName, editDesc);
    setIsEditing(false);
  };

  const handleRemoveSong = async (songId) => {
    await removeSongFromPlaylist(playlist.id, songId);
    setSongs(prev => prev.filter(s => s.id !== songId));
  };

  const handlePlaySong = (index) => {
    playContext(songs, index);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!playlist) return <div>Playlist not found</div>;

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex items-end gap-4 relative">
        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
          {playlist.cover_art_url ? (
            <img src={playlist.cover_art_url} alt="Cover" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <ListMusic size={48} className="text-white opacity-80" />
          )}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-2 mb-2">
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="bg-sonora-surface border border-sonora-border rounded p-2 text-sonora-text"
                placeholder="Playlist Name"
              />
              <textarea 
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="bg-sonora-surface border border-sonora-border rounded p-2 text-sonora-text text-sm"
                placeholder="Description"
                rows={2}
              />
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} className="btn-primary py-1 px-3 text-sm">Save</button>
                <button onClick={() => setIsEditing(false)} className="btn-secondary py-1 px-3 text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-outfit font-bold text-sonora-text mb-2">{playlist.name}</h1>
              <p className="text-sonora-text-muted mb-2">{playlist.description}</p>
              <p className="text-sonora-text-muted">{songs.length} songs</p>
            </>
          )}
        </div>
        
        {!isEditing && (
          <div className="absolute top-0 right-0 flex gap-2">
            <button onClick={() => setIsEditing(true)} className="p-2 text-sonora-text-muted hover:text-sonora-text">
              <Edit2 size={20} />
            </button>
            <button onClick={handleDeletePlaylist} className="p-2 text-red-500 hover:text-red-400">
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex-1">
        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-sonora-border rounded-2xl bg-sonora-surface/50">
            <ListMusic size={48} className="text-sonora-text-muted mb-4" />
            <h4 className="font-outfit font-medium text-lg text-sonora-text mb-2">No songs yet</h4>
            <p className="text-sonora-text-muted text-sm text-center">
              Add songs from the library to this playlist.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {songs.map((song, index) => (
              <div key={song.id} className="relative group">
                <SongRow 
                  song={song} 
                  index={index} 
                  onPlay={() => handlePlaySong(index)} 
                  onToggleFavorite={toggleFavorite} 
                  onAddToPlaylist={() => {}} 
                />
                <button 
                  onClick={() => handleRemoveSong(song.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from playlist"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
