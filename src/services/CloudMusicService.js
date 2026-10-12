import { api } from './api';

class CloudMusicService {
  async getAuthUrl() {
    const res = await api.get('/music/auth/google');
    return res.data.result.url;
  }

  async getDriveStatus() {
    const res = await api.get('/music/drive/status');
    return res.data.result;
  }

  async setDriveFolder(folderId) {
    const res = await api.post('/music/drive/folder', { folderId });
    return res.data.result;
  }

  async syncDrive() {
    const res = await api.post('/music/sync');
    return res.data.result;
  }

  async getSongs() {
    const res = await api.get('/music/songs');
    return res.data.result.songs;
  }

  async toggleFavorite(songId) {
    const res = await api.patch(`/music/songs/${songId}/favorite`);
    return res.data.result.song;
  }

  async getPlaylists() {
    const res = await api.get('/music/playlists');
    return res.data.result.playlists;
  }

  async createPlaylist(name, description = '') {
    const res = await api.post('/music/playlists', { name, description });
    return res.data.result.playlist;
  }

  async getPlaylistSongs(playlistId) {
    const res = await api.get(`/music/playlists/${playlistId}/songs`);
    return res.data.result.songs;
  }

  async addSongToPlaylist(playlistId, songId) {
    const res = await api.post(`/music/playlists/${playlistId}/songs`, { songId });
    return res.data.result;
  }

  async deletePlaylist(playlistId) {
    const res = await api.delete(`/music/playlists/${playlistId}`);
    return res.data.result;
  }

  async renamePlaylist(playlistId, name, description) {
    const res = await api.patch(`/music/playlists/${playlistId}`, { name, description });
    return res.data.result.playlist;
  }

  async removeSongFromPlaylist(playlistId, songId) {
    const res = await api.delete(`/music/playlists/${playlistId}/songs/${songId}`);
    return res.data.result;
  }

  async reorderPlaylistSong(playlistId, songId, position) {
    const res = await api.patch(`/music/playlists/${playlistId}/songs/${songId}/reorder`, { position });
    return res.data.result;
  }

  async recordPlayEvent(songId) {
    const res = await api.post(`/music/songs/${songId}/play`);
    return res.data.result;
  }

  async getRecentlyPlayed() {
    const res = await api.get('/music/history/recently-played');
    return res.data.result.songs;
  }

  // --- FEATURED / DRIVE PLAYLISTS ---

  async getFeaturedPlaylists() {
    const res = await api.get('/music/featured-playlists');
    return res.data.result.playlists;
  }

  async getFeaturedPlaylist(idOrSlug) {
    const res = await api.get(`/music/featured-playlists/${idOrSlug}`);
    return res.data.result;
  }

  async getAdminDriveFolders() {
    const res = await api.get('/music/admin/drive-folders');
    return res.data.result.folders;
  }

  async createFeaturedPlaylist(data) {
    const res = await api.post('/music/admin/featured-playlists', data);
    return res.data.result.playlist;
  }

  async updateFeaturedPlaylist(id, data) {
    const res = await api.put(`/music/admin/featured-playlists/${id}`, data);
    return res.data.result.playlist;
  }

  async deleteFeaturedPlaylist(id) {
    const res = await api.delete(`/music/admin/featured-playlists/${id}`);
    return res.data.result;
  }

  async syncFeaturedPlaylist(id) {
    const res = await api.post(`/music/admin/featured-playlists/${id}/sync`);
    return res.data.result;
  }
}

export default new CloudMusicService();
