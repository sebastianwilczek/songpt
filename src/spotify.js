/**
 * Attempts to retrieve a Spotify access token.
 * Calls the Spotify API to retrieve a token with the given credentials.
 * @param {string} spotifyCredentials The Spotify Basic credentials to use.
 * @return {Promise} The Spotify access token.
 */
exports.getSpotifyAccessToken = async (spotifyCredentials) => {
  if (!spotifyCredentials || spotifyCredentials.length === 0) {
    throw new Error("No Spotify credentials supplied.");
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${spotifyCredentials}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    const responseData = await response.json();
    return responseData?.access_token;
  } catch (e) {
    throw new Error("Could not call Spotify API. Make sure your credentials are valid." + e);
  }
};

/**
 * Retrieves an access token for the account associated with the given refresh token.
 * The token is retrieved via the account refresh token.
 * @param {string} spotifyCredentials The Spotify Basic credentials to use.
 * @param {string} spotifyRefreshToken The Spotify refresh token to use.
 * @return {Promise} The Spotify account access token.
 */
exports.getSpotifyAccountAccessToken = async (spotifyCredentials, spotifyRefreshToken) => {
  if (!spotifyCredentials || spotifyCredentials.length === 0) {
    throw new Error("No Spotify credentials supplied.");
  }

  if (!spotifyRefreshToken || spotifyRefreshToken.length === 0) {
    throw new Error("No Spotify refresh token supplied.");
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${spotifyCredentials}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: spotifyRefreshToken,
      }),
    });

    const responseData = await response.json();
    return responseData?.access_token;
  } catch (e) {
    throw new Error("Could not call Spotify API. Make sure your credentials are valid." + e);
  }
};

/**
 * Calls the Spotify API to retrieve the data for a search query.
 * @param {string} searchText The text to search for.
 * @param {string} accessToken The Spotify access token.
 * @return {Promise} The found Spotify tracks.
 */
const searchSpotifyTracks = async (searchText, accessToken) => {
  if (!accessToken || accessToken.length === 0) {
    throw new Error("No Spotify access token supplied.");
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=track`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const responseData = await response.json();
  
    if (responseData.tracks?.items?.length === 0) {
      return [];
    }
  
    return responseData.tracks.items;
  } catch (e) {
    throw new Error("Could not call Spotify API. Make sure you have supplied a valid Spotify Access Token." + e);
  }
};

exports.searchSpotifyTracks = searchSpotifyTracks;

/**
 * Retrieves a Spotify track for the given title, if one exists.
 * @param {string} title The title of the song to search for.
 * @param {string} accessToken The Spotify access token.
 * @return {Promise} The found Spotify track.
 */
exports.getSpotifyTrackForTitle = async (title, accessToken) => {
  if (!accessToken || accessToken.length === 0) {
    throw new Error("No Spotify access token supplied.");
  }

  let items = [];
  try {
    items = await searchSpotifyTracks(title, accessToken);
  } catch (e) {
    throw new Error("Could not call Spotify API. Make sure you have supplied a valid Spotify Access Token." + e);
  }

  if (items.length === 0) {
    throw new Error("Could not find a Spotify track for the given title.");
  }

  return items[0];
};

/**
 * Creates a new playlist in the Spotify account belonging to the given Spotify account access token.
 * @param {string} name The name of the playlist.
 * @param {string} description The description of the playlist.
 * @param {string[]} trackIds The Spotify IDs of the tracks to add to the playlist.
 * @param {boolean} publicPlaylist Whether the playlist should be public or not.
 * @param {string} spotifyAccountId The Spotify account ID to create the playlist for.
 * @param {string} spotifyAccountAccessToken The Spotify account access token.
 * @return {Promise} The Spotify playlist ID.
 */
exports.createSpotifyPlaylist = async (name, description, trackIds, publicPlaylist, spotifyAccountId, spotifyAccountAccessToken) => {
  if (!name || name.length === 0) {
    throw new Error("No playlist name supplied.");
  }

  if (name.length > 100) {
    throw new Error("Playlist name must be 100 characters or less.");
  }

  if (!description || description.length === 0) {
    throw new Error("No playlist description supplied.");
  }

  if (description.length > 280) {
    throw new Error("Playlist description must be 280 characters or less.");
  }

  if (!trackIds || trackIds.length === 0) {
    throw new Error("No track IDs supplied.");
  }

  if (!spotifyAccountAccessToken || spotifyAccountAccessToken.length === 0) {
    throw new Error("No Spotify account access token supplied.");
  }

  let playlistId;
  try {
    const response = await fetch(`https://api.spotify.com/v1/users/${spotifyAccountId}/playlists`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${spotifyAccountAccessToken}`,
      },
      body: JSON.stringify({
        name,
        description: `${description} Powered by songpt.`,
        public: publicPlaylist,
      }),
    });

    const responseData = await response.json();
    playlistId = responseData?.id;
  } catch (e) {
    throw new Error("Could not call Spotify API. Make sure you have supplied a valid Spotify Account Access Token." + e);
  }

  if (!playlistId) {
    throw new Error("Spotify API did not return a playlist ID.");
  }

  let addTracksResponse;
  try {
    addTracksResponse = await fetch(`https://api.spotify.com/v1/users/${spotifyAccountId}/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${spotifyAccountAccessToken}`,
      },
      body: JSON.stringify({
        uris: trackIds.map((trackId) => `spotify:track:${trackId}`),
      }),
    });
  } catch (e) {
    throw new Error("Could not call Spotify API. Make sure you have supplied a valid Spotify Account Access Token." + e);
  }

  if (!addTracksResponse) {
    throw new Error("Spotify API did not return a response when adding tracks to the playlist.");
  }

  return playlistId;
};
