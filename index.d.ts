declare module 'songpt' {
  export function generatePlaylistBasedOnSongs(openAiApiKey: string, spotifyCredentials: string, spotifyRefreshToken: string, spotifyAccountId: string, playlistName: string, playlistDescription: string, songTitles: string[]): Promise<string>;
  export function generatePlaylistBasedOnKeywords(openAiApiKey: string, spotifyCredentials: string, spotifyRefreshToken: string, spotifyAccountId: string, playlistName: string, playlistDescription: string, keywords: string): Promise<string>;
  export function generateSuggestionsBasedOnKeywords(openAiApiKey: string, keywords: string): Promise<string[]>;
  export function generateSuggestionsBasedOnKeywords(openAiApiKey: string, keywords: string, numberOfSuggestions: number): Promise<string[]>;
  export function generateSuggestionsBasedOnKeywords(openAiApiKey: string, keywords: string, numberOfSuggestions: number, gptModel: string): Promise<string[]>;
  export function generateSuggestionsBasedOnSongs(openAiApiKey: string, songTitles: string[]): Promise<string[]>;
  export function generateSuggestionsBasedOnSongs(openAiApiKey: string, songTitles: string[], numberOfSuggestions: number): Promise<string[]>;
  export function generateSuggestionsBasedOnSongs(openAiApiKey: string, songTitles: string[], numberOfSuggestions: number, gptModel: string): Promise<string[]>;
  export function getSpotifyAccessToken(spotifyCredentials: string): Promise<any>;
  export function getSpotifyAccountAccessToken(spotifyCredentials: string, spotifyRefreshToken: string): Promise<any>;
  export function searchSpotifyTracks(searchText: string, accessToken: string): Promise<any>;
  export function getSpotifyTrackForTitle(title: string, accessToken: string): Promise<any>;
  export function createSpotifyPlaylist(name: string, description: string, trackIds: string[], publicPlaylist: boolean, spotifyAccountId: string, spotifyAccountAccessToken: string): Promise<string>;
}
