import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CloudMusicService from '../services/CloudMusicService';
import { useAuth } from './AuthContext';

const LibraryContext = createContext();

export const useLibrary = () => {
  return useContext(LibraryContext);
};

export const LibraryProvider = ({ children }) => {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null);

  const [playlists, setPlaylists] = useState([]);
  const [recentPlays, setRecentPlays] = useState([]);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

  const loadSongs = useCallback(async (force = false) => {
    if (!user) {
      setSongs([]);
      setPlaylists([]);
      setRecentPlays([]);
      setIsLibraryLoaded(false);
      return;
    }
    
    // Prevent duplicate loading if already loaded (unless forced, like during sync)
    if (isLibraryLoaded && !force) return;
    
    setIsLoading(true);
    try {
      const [allSongs, allPlaylists, allRecentPlays] = await Promise.all([
        CloudMusicService.getSongs(),
        CloudMusicService.getPlaylists(),
        CloudMusicService.getRecentlyPlayed()
      ]);
      setSongs(allSongs);
      setPlaylists(allPlaylists);
      setRecentPlays(allRecentPlays);
      setIsLibraryLoaded(true);
    } catch (error) {
      console.error("Failed to load library data from Cloud API", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLibraryLoaded]);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  const syncDrive = async () => {
    setImporting(true);
    try {
      const result = await CloudMusicService.syncDrive();
      setImportProgress({ total: result.totalFound, imported: result.newlySynced, failed: 0 });
      await loadSongs(); // Refresh the list
    } catch (err) {
      console.error("Failed to sync drive", err);
    } finally {
      setImporting(false);
      setTimeout(() => setImportProgress(null), 3000);
    }
  };

  const toggleFavorite = async (songId) => {
    try {
      const updatedSong = await CloudMusicService.toggleFavorite(songId);
      setSongs((prev) => prev.map(s => s.id === songId ? updatedSong : s));
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  const createPlaylist = async (name, description) => {
    try {
      const playlist = await CloudMusicService.createPlaylist(name, description);
      setPlaylists(prev => [...prev, playlist]);
      return playlist;
    } catch (error) {
      console.error("Failed to create playlist", error);
    }
  };

  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      await CloudMusicService.addSongToPlaylist(playlistId, songId);
    } catch (error) {
      console.error("Failed to add song to playlist", error);
    }
  };

  const deleteSong = async (songId) => {
    // API needed later
    setSongs((prev) => prev.filter(s => s.id !== songId));
  }

  const value = {
    songs,
    playlists,
    recentPlays,
    isLoading,
    importing,
    importProgress,
    syncDrive,
    toggleFavorite,
    deleteSong,
    loadSongs,
    createPlaylist,
    addSongToPlaylist,
    deletePlaylist: async (id) => {
      await CloudMusicService.deletePlaylist(id);
      setPlaylists(prev => prev.filter(p => p.id !== id));
    },
    renamePlaylist: async (id, name, desc) => {
      const updated = await CloudMusicService.renamePlaylist(id, name, desc);
      setPlaylists(prev => prev.map(p => p.id === id ? updated : p));
    },
    removeSongFromPlaylist: async (playlistId, songId) => {
      await CloudMusicService.removeSongFromPlaylist(playlistId, songId);
    },
    reorderPlaylistSong: async (playlistId, songId, position) => {
      await CloudMusicService.reorderPlaylistSong(playlistId, songId, position);
    },
    recordPlayEvent: async (songId) => {
      await CloudMusicService.recordPlayEvent(songId);
      // Optimistically update recent plays if needed, or just let next refresh handle it
    },
    getRecentlyPlayed: async () => {
      return recentPlays;
    },
    getFavoriteSongs: async () => {
      return songs.filter(s => s.favorite);
    }
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};
