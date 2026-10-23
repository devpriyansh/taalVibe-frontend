import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
// Removed LocalMusicStorage import

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    const handleError = (e) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [queue, queueIndex]); // rebind if queue logic needs it, though standard audio events don't strictly need it

  // Sync volume
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (audioRef.current) seek(Math.min(audioRef.current.duration, audioRef.current.currentTime + 5));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (audioRef.current) seek(Math.max(0, audioRef.current.currentTime - 5));
          break;
        case 'KeyN':
          e.preventDefault();
          playNext();
          break;
        case 'KeyP':
          e.preventDefault();
          playPrevious();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSong, isPlaying, queue, queueIndex]);

  const loadAndPlaySong = async (song) => {
    try {
      if (currentSong && currentSong.id === song.id) {
        // Toggle play/pause if it's the same song
        togglePlay();
        return;
      }
      
      const { API_BASE_URL } = await import('../services/api');
      const CloudMusicService = (await import('../services/CloudMusicService')).default;
      
      const token = localStorage.getItem('token');
      const audioUrl = `${API_BASE_URL}/music/songs/${song.id}/stream?token=${token}`;

      audioRef.current.src = audioUrl;
      setCurrentSong(song);
      audioRef.current.play();

      // Record play event for history
      CloudMusicService.recordPlayEvent(song.id).catch(console.error);
    } catch (error) {
      console.error("Failed to load and play song", error);
    }
  };

  const playContext = (songs, startIndex = 0) => {
    setQueue(songs);
    setQueueIndex(startIndex);
    loadAndPlaySong(songs[startIndex]);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const nextIndex = (queueIndex + 1) % queue.length;
    setQueueIndex(nextIndex);
    loadAndPlaySong(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    
    // If we are more than 3 seconds in, just restart the song
    if (currentTime > 3) {
      seek(0);
      return;
    }

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;
    setQueueIndex(prevIndex);
    loadAndPlaySong(queue[prevIndex]);
  };

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    playContext,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    formatTime,
    queue
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
