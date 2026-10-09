/**
 * JourneyEngine.js
 * 
 * Generates intelligent listening journeys based on user library and preferences.
 */

export class JourneyEngine {
  /**
   * Generates a sequenced array of songs for a journey.
   * @param {Array} librarySongs - All available songs in the local library
   * @param {Object} options - Configuration for the journey
   * @param {number} options.durationMinutes - Target duration in minutes
   * @param {string} options.mood - Desired mood (e.g. 'Nostalgic', 'Calm')
   * @param {string} options.decade - Era filter (e.g. '1990s', 'All')
   * @param {string} options.genre - Genre filter
   * @param {boolean} options.favoritesOnly - Restrict to favorites
   * @returns {Array} Sequenced list of songs
   */
  static generateJourney(librarySongs, options = {}) {
    let pool = [...librarySongs];

    // 1. Initial Filtering
    if (options.favoritesOnly) {
      pool = pool.filter(song => song.favorite);
    }
    
    if (options.decade && options.decade !== 'All') {
      pool = pool.filter(song => song.decade === options.decade);
    }
    
    if (options.genre && options.genre !== 'All') {
      pool = pool.filter(song => song.genre === options.genre);
    }
    
    // Fallback if pool is too small (e.g. fewer than 3 songs)
    if (pool.length < 3) {
      console.warn("JourneyEngine: Not enough songs match criteria. Expanding pool.");
      pool = [...librarySongs];
      if (options.favoritesOnly) {
        pool = pool.filter(song => song.favorite);
      }
    }

    if (pool.length === 0) {
      return [];
    }

    // 2. Journey Sequencing Logic
    // Start with familiar -> nostalgic -> lesser known -> peak -> calm down
    // Since we don't have real "mood" or "intensity" AI yet, we use heuristics:
    // Familiar = High playcount or favorite
    // Nostalgic = Older decades
    // Peak = High playcount
    
    // Sort pool by play count
    pool.sort((a, b) => b.playCount - a.playCount);
    
    const favorites = pool.filter(s => s.favorite);
    const familiar = pool.slice(0, Math.floor(pool.length / 3));
    const lesserKnown = pool.slice(Math.floor(pool.length / 3));

    const journey = [];
    let currentDurationSeconds = 0;
    const targetSeconds = (options.durationMinutes || 60) * 60;
    const usedIds = new Set();
    const usedArtists = new Set();

    const addSong = (songList) => {
      // Find a song in songList we haven't used recently, and ideally not the same artist consecutively
      for (let song of songList) {
        if (!usedIds.has(song.id)) {
          // Avoid consecutive artists if possible
          if (journey.length > 0 && journey[journey.length - 1].artist === song.artist) {
            continue; // Skip for now
          }
          
          journey.push(song);
          usedIds.add(song.id);
          usedArtists.add(song.artist);
          currentDurationSeconds += (song.duration || 180); // Default 3 mins if unknown
          return true;
        }
      }
      // If we couldn't find one without consecutive artist, just take the first unused
      for (let song of songList) {
        if (!usedIds.has(song.id)) {
          journey.push(song);
          usedIds.add(song.id);
          currentDurationSeconds += (song.duration || 180);
          return true;
        }
      }
      return false;
    };

    // Construct the sequence
    // Step 1: START (Familiar / Favorite)
    addSong(favorites.length > 0 ? favorites : familiar);

    // Loop until we reach target duration
    let step = 1;
    while (currentDurationSeconds < targetSeconds && pool.length > usedIds.size) {
      if (step % 4 === 1) {
        // Nostalgic / Older if available
        const older = pool.filter(s => parseInt(s.year || 2020) < 2010);
        if (!addSong(older.length > 0 ? older : pool)) break;
      } else if (step % 4 === 2) {
        // Lesser known
        if (!addSong(lesserKnown.length > 0 ? lesserKnown : pool)) break;
      } else if (step % 4 === 3) {
        // Peak favorite
        if (!addSong(favorites.length > 0 ? favorites : familiar)) break;
      } else {
        // General pool
        // Shuffle general pool slightly to avoid deterministic loops
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        if (!addSong(shuffled)) break;
      }
      step++;
    }

    return journey;
  }
}
