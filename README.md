# songpt

<p align="center">
  <img src="https://songpt-ai.web.app/songpt.webp" alt="songpt" height="128"/>
</p>

[![npm version](https://img.shields.io/npm/v/songpt.svg?style=flat-square)](https://www.npmjs.org/package/songpt)

songpt is a Node.js package that generates tracks for music playlists fitting input prompts.

Input prompts may either be string prompts ("keywords") or a list of already present songs. songpt attempts to extract a common category among the given songs. Additionally, the package has functions to query the returned song title names against Spotify and to create playlists based on the generated suggestions.

## Try it out

To try out the package, clone this repository. songpt comes preloaded with a script to try out the functionality. You can find it at `test/tryout.js`.
To run the script, fill in the parameters in `package.json`:
```
"scripts": {
  "tryout": "node test/tryout.js <openai-api-key> <spotify-credentials> <spotify-refresh-token> <spotify-account-id>"
},
```
Legend: 
- `<openai-api-key>` - Your key to use the OpenAI API. Can be found [here](https://platform.openai.com/account/api-keys). Required for generation of song suggestions.
- `<spotify-credentials>` - The Base64 encoded credentials to your Spotify application. To use Spotify features, you will need to create a Spotify application and retrieve a client ID and secret. Can be found on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
- `<spotify-refresh-token>` - The refresh token to use to access the account that playlists should be created for. To generate this, log in to the Spotify application you created, and capture the refresh token. Make sure that the scopes given include [playlist-modify-private](https://developer.spotify.com/documentation/web-api/concepts/scopes#playlist-modify-private) and [playlist-modify-public](https://developer.spotify.com/documentation/web-api/concepts/scopes#playlist-modify-public).
- `<spotify-account-id>` - The account ID of your Spotify account. Make sure it is the same account as the one you used to generate a refresh token, as playlist will be generated using this account.

To try out the module, fill in the values above and run the following:
```
npm tryout
```
If the input you provided was valid, it will return the following (including your inputs):
```
> node test/tryout.js <openai-api-key> <spotify-credentials> <spotify-refresh-token> <spotify-account-id>

Created a Spotify playlist:
https://open.spotify.com/playlist/3XHZbb4kigkRugbatTukPP
Created a Spotify playlist:
https://open.spotify.com/playlist/3zKef1uHMd1BPCJLIddYJw
```
The playlist links generated are playlists in the account given generated based on the `tryout.js` script.

## Installation

To use songpt in your Node.js application, run the following in your root project directory:
```
npm install songpt
```

## Usage

The package exports multiple different functions to interact with OpenAI and Spotify to generate and store playlists.

### Complete Process
These function represent the whole flow from start to finish to generate and store playlists based on certain inputs. Use these if you only want to generate Spotify playlists without worrying about the underlying logic.

- generatePlaylistBasedOnKeywords
Generates a new Spotify playlist based on the given keyword string.
```
generatePlaylistBasedOnKeywords("openAiApiKey", "spotifyCredentials", "spotifyRefreshToken", "spotifyAccountId", "A good playlist name", "A good playlist description", "Jazz music, but fast")
```

- generatePlaylistBasedOnSongs
Generates a new Spotify playlist based on the given list of song titles and artist names
```
generatePlaylistBasedOnSongs("openAiApiKey", "spotifyCredentials", "spotifyRefreshToken", "spotifyAccountId", "A good playlist name", "A good playlist description", ["Circles Post Malone", "Humble Kendrick Lamar", "Congratulation Post Malone"]) => {
```

### Suggestion Generation
These functions return the names of songs and artists based on given inputs. This is the part of songpt that interacts with OpenAI and is used only for generating suggestions, without translating them to Spotify playlists or tracks.

- generateSuggestionsBasedOnKeywords
Generates a list of songs based on the given keyword string.
```
generateSuggestionsBasedOnKeywords("openAiApiKey", "Jazz music, but fast", 10, "gpt-3.5-turbo",)
```

- generateSuggestionsBasedOnSongs
Generates a list of songs based on the given keyword string.
```
generateSuggestionsBasedOnSongs("openAiApiKey", ["Circles Post Malone", "Humble Kendrick Lamar", "Congratulation Post Malone"], 10, "gpt-3.5-turbo",)
```

### Spotify Interaction
The following functions interact with Spotify, to query for generated tracks or to create playlists. The first two functions generate access tokens that are required for the usage of the latter functions.

- getSpotifyAccessToken
Generates an access token fitting the Spotify application created by you.
```
getSpotifyAccessToken("spotifyCredentials")
```

- getSpotifyAccountAccessToken
Generates an account access token fitting the Spotify application created by you, based on the account belonging to the given refresh token.
```
getSpotifyAccountAccessToken("spotifyCredentials", "spotifyRefreshToken")
```

- searchSpotifyTracks
Queries the Spotify tracks for songs fitting the given search term, for example, a song title, and returns all found tracks.
```
searchSpotifyTracks("Circles Post Malone", "accessToken")
```

- getSpotifyTrackForTitle
Queries the Spotify tracks for a given song title, and returns the most fitting result.
```
getSpotifyTrackForTitle("Circles Post Malone", "accessToken")
```

- createSpotifyPlaylist
Creates a Spotify playlist based on the inputs provided, including the Spotify songs carrying the given track IDs.
```
createSpotifyPlaylist("A good playlist name", "A good playlist description", ["1bM6X2PZUVCJvUGlSXaaqE", "3FtQes77xlbS9QTVts7p2u"], false, "spotifyAccountId", "spotifyAccountAccessToken")
```
