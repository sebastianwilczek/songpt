import { generatePlaylistBasedOnSongs, generatePlaylistBasedOnKeywords } from "../index.js";

const testSuggestionsBasedOnSongs = async () => {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.error("Usage: node index.js <openai-api-key> <spotify-credentials> <spotify-refresh-token> <spotify-account-id>");
    process.exit(1);
  }

  const openAiApiKey = args[0];
  const spotifyCredentials = args[1];
  const spotifyRefreshToken = args[2];
  const spotifyAccountId = args[3];

  const playlistId = await generatePlaylistBasedOnSongs(
    openAiApiKey,
    spotifyCredentials,
    spotifyRefreshToken,
    spotifyAccountId,
    "Test Playlist - Post Malone and Kendrick Lamar",
    "This is an AI-generated playlist based on Post Malone and Kendrick Lamar.",
    ["Circles Post Malone", "Humble Kendrick Lamar", "Congratulation Post Malone"]
  );
  console.log("Created a Spotify playlist:");
  console.log(`https://open.spotify.com/playlist/${playlistId}`);
};

await testSuggestionsBasedOnSongs();

const testSuggestionsBasedOnKeywords = async () => {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.error("Usage: node index.js <openai-api-key> <spotify-credentials> <spotify-refresh-token> <spotify-account-id>");
    process.exit(1);
  }

  const openAiApiKey = args[0];
  const spotifyCredentials = args[1];
  const spotifyRefreshToken = args[2];
  const spotifyAccountId = args[3];

  const playlistId = await generatePlaylistBasedOnKeywords(
    openAiApiKey,
    spotifyCredentials,
    spotifyRefreshToken,
    spotifyAccountId,
    "Test Playlist - Witcher 3",
    "This is an AI-generated playlist based on The Witcher 3.",
    "The video game The Witcher 3"
  );
  console.log("Created a Spotify playlist:");
  console.log(`https://open.spotify.com/playlist/${playlistId}`);
};

await testSuggestionsBasedOnKeywords();
