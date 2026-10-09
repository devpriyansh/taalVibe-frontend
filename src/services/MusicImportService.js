import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';
import CloudMusicService from './CloudMusicService';

class MusicImportService {
  
  getDecade(year) {
    if (!year) return 'Unknown Year';
    const numYear = parseInt(year, 10);
    if (isNaN(numYear)) return 'Unknown Year';
    
    if (numYear < 1980) return 'Before 1980';
    if (numYear >= 1980 && numYear <= 1989) return '1980s';
    if (numYear >= 1990 && numYear <= 1999) return '1990s';
    if (numYear >= 2000 && numYear <= 2004) return '2000–2004';
    if (numYear >= 2005 && numYear <= 2009) return '2005–2009';
    if (numYear >= 2010 && numYear <= 2019) return '2010s';
    if (numYear >= 2020) return '2020s';
    
    return 'Unknown Year';
  }

  readTags(file) {
    return new Promise((resolve) => {
      jsmediatags.read(file, {
        onSuccess: function(tag) {
          resolve(tag.tags);
        },
        onError: function(error) {
          console.warn('Error reading tags for', file.name, error);
          resolve({}); 
        }
      });
    });
  }

  getDuration(file) {
    return new Promise((resolve) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
        URL.revokeObjectURL(objectUrl);
      });
      
      audio.addEventListener('error', () => {
        resolve(0);
        URL.revokeObjectURL(objectUrl);
      });

      audio.src = objectUrl;
    });
  }

  async importFile(file) {
    if (!file.type.startsWith('audio/')) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    // 1. Extract metadata locally
    const tags = await this.readTags(file);
    const duration = await this.getDuration(file);

    const title = tags.title || file.name.replace(/\.[^/.]+$/, "");
    const artist = tags.artist || 'Unknown Artist';
    const album = tags.album || 'Unknown Album';
    const year = tags.year || null;
    const genre = tags.genre || 'Unknown Genre';
    const decade = this.getDecade(year);

    const metadata = {
      title,
      artist,
      album,
      albumArtist: artist,
      year,
      decade,
      genre,
      duration,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    };

    // 2. Init Upload (get presigned URL)
    const { uploadUrl, storageKey } = await CloudMusicService.initUpload(file.name, file.type, file.size);

    // 3. Upload to Cloudflare R2
    await CloudMusicService.uploadToCloud(uploadUrl, file, file.type);

    // 4. Complete Upload (save to database)
    const newSong = await CloudMusicService.completeUpload(storageKey, metadata);

    return newSong;
  }

  async importMultipleFiles(files, onProgress = () => {}) {
    let imported = 0;
    let failed = 0;
    const results = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const metadata = await this.importFile(files[i]);
        results.push(metadata);
        imported++;
      } catch (err) {
        console.error(`Failed to import ${files[i].name}`, err);
        failed++;
      }
      
      onProgress({
        total: files.length,
        current: i + 1,
        imported,
        failed
      });
    }

    return { imported, failed, results };
  }
}

export const importService = new MusicImportService();
