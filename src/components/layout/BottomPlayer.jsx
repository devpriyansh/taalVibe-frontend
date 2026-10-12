import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart, ChevronDown } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { useLibrary } from '../../contexts/LibraryContext';

const BottomPlayer = () => {
  const { toggleFavorite } = useLibrary();
  const { 
    currentSong, isPlaying, currentTime, duration, volume, setVolume,
    togglePlay, playNext, playPrevious, seek, formatTime
  } = usePlayer();

  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);

  useEffect(() => {
    if (isNowPlayingOpen) {
      window.history.pushState({ modal: 'now-playing' }, '');
      const handlePopState = () => {
        setIsNowPlayingOpen(false);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isNowPlayingOpen]);

  const handleCloseNowPlaying = () => {
    if (window.history.state?.modal === 'now-playing') {
      window.history.back();
    } else {
      setIsNowPlayingOpen(false);
    }
  };

  // Setup Media Session API
  useEffect(() => {
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist || 'Unknown Artist',
        album: currentSong.album || '',
        artwork: [
          { src: '/default-cover.jpg', sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', togglePlay);
      navigator.mediaSession.setActionHandler('pause', togglePlay);
      navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
    }
  }, [currentSong, togglePlay, playPrevious, playNext]);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  const handleVolume = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(percent);
  };

  if (!currentSong) {
    return (
      <div className="hidden md:flex w-full h-24 bg-sonora-surface border-t border-sonora-border items-center justify-between px-6 z-50">
        <div className="text-sonora-text-muted text-sm">Select a song to start listening.</div>
      </div>
    );
  }

  const coverSrc = '/default-cover.jpg'; // Hardcoded default cover per user request

  return (
    <>
      {/* Mobile Mini Player & Desktop Full Player */}
      <div 
        className="w-full bg-sonora-surface border-t border-sonora-border flex items-center justify-between px-3 md:px-6 z-50 h-16 md:h-24 cursor-pointer md:cursor-default"
        onClick={() => { if (window.innerWidth < 768) setIsNowPlayingOpen(true); }}
      >
        
        {/* Track Info (Clickable on Mobile) */}
        <div className="flex-1 min-w-0 md:w-1/3 flex items-center gap-3 md:gap-4 overflow-hidden">
          <img 
            src={coverSrc} 
            alt="Cover" 
            className="w-10 h-10 md:w-14 md:h-14 rounded-md object-cover flex-shrink-0 border border-sonora-border" 
          />
          <div className="overflow-hidden min-w-0 flex-1">
            <h4 className="font-outfit font-medium text-sonora-text truncate text-sm md:text-base">{currentSong.title}</h4>
            <p className="text-xs md:text-sm text-sonora-text-muted truncate">{currentSong.artist}</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(currentSong.id); }}
            className="hidden md:flex ml-2 text-sonora-text-muted hover:text-red-500 hover:scale-110 transition-all flex-shrink-0"
          >
            <Heart size={20} className={currentSong.favorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
        </div>

        {/* Mobile Quick Controls */}
        <div className="md:hidden flex items-center gap-1 sm:gap-2 flex-shrink-0 pl-2">
          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(currentSong.id); }} className="text-sonora-text-muted p-1.5 -mr-1">
            <Heart size={20} className={currentSong.favorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); playPrevious(); }} className="text-sonora-text p-1.5">
            <SkipBack size={20} className="fill-current" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-sonora-text p-1.5">
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="ml-0.5 fill-current" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); playNext(); }} className="text-sonora-text p-1.5 -mr-1">
            <SkipForward size={20} className="fill-current" />
          </button>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex w-1/3 flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button className="text-sonora-text-muted hover:text-sonora-text transition-colors">
              <Shuffle size={20} />
            </button>
            <button onClick={playPrevious} className="text-sonora-text-muted hover:text-sonora-text transition-colors">
              <SkipBack size={24} />
            </button>
            <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-sonora-primary text-sonora-base flex items-center justify-center hover:scale-105 transition-transform">
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            <button onClick={playNext} className="text-sonora-text-muted hover:text-sonora-text transition-colors">
              <SkipForward size={24} />
            </button>
            <button className="text-sonora-text-muted hover:text-sonora-text transition-colors">
              <Repeat size={20} />
            </button>
          </div>
          <div className="w-full flex items-center gap-2 max-w-md text-xs text-sonora-text-muted">
            <span>{formatTime(currentTime)}</span>
            <div className="h-1 flex-1 bg-sonora-border rounded-full overflow-hidden cursor-pointer group py-2 flex items-center relative" onClick={handleSeek}>
               <div className="absolute inset-0 z-10" />
               <div className="h-1 w-full bg-sonora-border rounded-full overflow-hidden pointer-events-none">
                 <div 
                   className="h-full bg-sonora-primary rounded-full"
                   style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                 ></div>
               </div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Desktop Volume */}
        <div className="hidden md:flex w-1/3 items-center justify-end gap-3">
          <Volume2 size={20} className="text-sonora-text-muted" />
          <div className="w-24 h-1 flex items-center relative cursor-pointer py-2 group" onClick={handleVolume}>
             <div className="absolute inset-0 z-10" />
             <div className="w-full h-1 bg-sonora-border rounded-full overflow-hidden pointer-events-none">
               <div 
                 className="h-full bg-sonora-text-muted rounded-full"
                 style={{ width: `${volume * 100}%` }}
               ></div>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Now Playing Full Screen Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-sonora-base flex flex-col transition-transform duration-300 md:hidden ${
          isNowPlayingOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 pt-safe">
          <button onClick={handleCloseNowPlaying} className="p-3 -ml-3 text-sonora-text active:scale-95 transition-transform" aria-label="Close now playing">
            <ChevronDown size={32} />
          </button>
          <span className="text-xs font-outfit uppercase tracking-widest text-sonora-text-muted font-medium">Now Playing</span>
          <div className="w-10"></div> {/* Spacer for center alignment */}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 pb-12">
          {/* Artwork */}
          <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl mb-10 border border-sonora-border/50 bg-sonora-surface">
            <img src={coverSrc} alt={currentSong.title} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="w-full max-w-sm flex items-center justify-between mb-8">
            <div className="overflow-hidden min-w-0 pr-4">
              <h2 className="text-2xl font-outfit font-bold text-sonora-text truncate">{currentSong.title}</h2>
              <p className="text-sonora-text-muted text-lg truncate">{currentSong.artist || 'Unknown Artist'}</p>
            </div>
            <button onClick={() => toggleFavorite(currentSong.id)} className="p-2 flex-shrink-0">
              <Heart size={28} className={currentSong.favorite ? 'fill-red-500 text-red-500' : 'text-sonora-text-muted'} />
            </button>
          </div>

          {/* Progress */}
          <div className="w-full max-w-sm mb-8">
            <div className="h-1.5 w-full bg-sonora-border rounded-full overflow-hidden cursor-pointer relative py-3" onClick={handleSeek}>
               <div className="absolute inset-0 z-10" />
               <div className="h-1.5 w-full bg-sonora-border rounded-full overflow-hidden pointer-events-none">
                 <div 
                   className="h-full bg-sonora-primary rounded-full relative"
                   style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                 >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                 </div>
               </div>
            </div>
            <div className="flex justify-between text-xs text-sonora-text-muted mt-2 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="w-full max-w-sm flex items-center justify-between px-2">
            <button className="text-sonora-text-muted hover:text-white transition-colors p-2">
              <Shuffle size={24} />
            </button>
            <button onClick={playPrevious} className="text-sonora-text hover:text-white transition-colors p-2">
              <SkipBack size={36} className="fill-current" />
            </button>
            <button onClick={togglePlay} className="w-20 h-20 rounded-full bg-sonora-primary text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl shadow-sonora-primary/20">
              {isPlaying ? <Pause size={32} className="fill-current" /> : <Play size={32} className="ml-2 fill-current" />}
            </button>
            <button onClick={playNext} className="text-sonora-text hover:text-white transition-colors p-2">
              <SkipForward size={36} className="fill-current" />
            </button>
            <button className="text-sonora-text-muted hover:text-white transition-colors p-2">
              <Repeat size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomPlayer;
