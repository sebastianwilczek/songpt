const MAIN_LIST_PROMPT = "Assume there is a list of songs. The list has a topic. Each song in the list is fitting to that topic. More songs that are similar are needed.";
const EXISTING_SONGS_PROMPT = "These songs have already been added to the list:";
const KEYWORDS_PROMPT = "The category fits these keywords:";
const numberOfSuggestionsPrompt = (numberOfSuggestions) => `Generate a list of ${numberOfSuggestions} songs that fit the same category.`;
const RETURN_PROMPT = `Do not offer any explanation. Do not add any commentary. Format the song names in a JSON array of this format: ["Song Title Artist Name","Song Title Artist Name",...]. Only return this JSON array, filled with the song and artist names. Do not return anything else. Do not include special characters, dashes, colons or similar in the song and artist names. Do not format response as code.`;

/**
 * Generates the suggestion prompt for OpenAI.
 * The prompt is based on the song titles supplied.
 * It instructs OpenAI to generate a list of songs that fit the same category as the already listed songs.
 * @param {string[]} songTitles The song titles to base the suggestions on.
 * @param {number} numberOfSuggestions The number of suggestions to generate.
 * @return {string} The prompt for OpenAI.
 */
 const generateSuggestionPrompBasedOnSongs = (songTitles, numberOfSuggestions) => {
  const songList = songTitles.join(",");
  return `${MAIN_LIST_PROMPT} ${EXISTING_SONGS_PROMPT} ${songList}. ${numberOfSuggestionsPrompt(numberOfSuggestions)} ${RETURN_PROMPT}`;
};

/**
 * Generates the suggestion prompt for OpenAI.
 * The prompt is based on keywords supplied.
 * It instructs OpenAI to generate a list of songs that fit the same category as fitting to the keywords.
 * @param {string} keywords The keywords to base the suggestions on.
 * @param {number} numberOfSuggestions The number of suggestions to generate.
 * @return {string} The prompt for OpenAI.
 */
 const generateSuggestionPromptBasedOnKeywords = (keywords, numberOfSuggestions) => {
  return `${MAIN_LIST_PROMPT} ${KEYWORDS_PROMPT} ${keywords}. ${numberOfSuggestionsPrompt(numberOfSuggestions)} ${RETURN_PROMPT}`;
};

/**
 * Calls the OpenAI API to generate a response to a prompt.
 * @param {string} prompt The prompt to send to OpenAI.
 * @param {string} openAiApiKey The OpenAI API key to use.
 * @param {string} gptModel The GPT model to use.
 * @return {Promise<any>} The response from OpenAI.
 */
const callOpenAI = async (prompt, openAiApiKey, gptModel) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({
      model: gptModel,
      messages: [{
        role: "user",
        content: prompt,
      }],
    }),
  });

  const responseData = await response.json();
  return responseData;
}

/**
 * Calls the OpenAI API to generate a list of song suggestions based on the song titles supplied.
 * @param {string} openAiApiKey The OpenAI API key to use.
 * @param {string} prompt The prompt to send to OpenAI.
 * @param {number} numberOfSuggestions The number of suggestions to generate.
 * @param {string} gptModel The GPT model to use. Defaults to "gpt-3.5-turbo".
 * @return {Promise<string[]>} The list of suggestions.
 */
const generateSuggestions = async (
  openAiApiKey,
  prompt,
  numberOfSuggestions = 10,
  gptModel = "gpt-3.5-turbo",
) => {
  if (!openAiApiKey || openAiApiKey.length === 0) {
    throw new Error("No OpenAI API key supplied.");
  }

  if (!prompt || prompt.length === 0) {
    throw new Error("No prompt supplied.");
  }

  if (!numberOfSuggestions || numberOfSuggestions < 1) {
    throw new Error("Invalid number of suggestions.");
  }

  if (!gptModel || gptModel.length === 0) {
    throw new Error("No GPT model supplied.");
  }

  let response;
  try {
    response = await callOpenAI(prompt, openAiApiKey, gptModel);
  } catch (e) {
    throw new Error("Could not call OpenAI API. Make sure your API key is valid and that you have not exceeded your API usage limits.");
  }

  if (!response?.choices?.[0]?.message?.content) {
    throw new Error("Invalid response from OpenAI. Make sure your API key is valid and that you have not exceeded your API usage limits.");
  }

  const unparsedArray = response.choices[0].message.content;

  try {
    const parsedArray = JSON.parse(unparsedArray);
    return parsedArray.filter((item) => item != null && typeof item === "string" && item.length > 0);
  } catch (e) {
    throw new Error("Could not parse response from OpenAI. GPT may at times return invalid JSON.");
  }
};

/**
 * Calls the OpenAI API to generate a list of song suggestions based on the song titles supplied.
 * @param {string} openAiApiKey The OpenAI API key to use.
 * @param {string[]} songTitles The song titles to base the suggestions on.
 * @param {number} numberOfSuggestions The number of suggestions to generate.
 * @param {string} gptModel The GPT model to use. Defaults to "gpt-3.5-turbo".
 * @return {Promise<string[]>} The list of suggestions.
 */
export const generateSuggestionsBasedOnSongs = async (
  openAiApiKey,
  songTitles,
  numberOfSuggestions = 10,
  gptModel = "gpt-3.5-turbo",
) => {
  if (!songTitles || songTitles.length === 0) {
    throw new Error("No song titles supplied.");
  }

  const prompt = generateSuggestionPrompBasedOnSongs(songTitles, numberOfSuggestions);
  return generateSuggestions(
    openAiApiKey,
    prompt,
    numberOfSuggestions,
    gptModel,
  );
};

/**
 * Calls the OpenAI API to generate a list of song suggestions based on the keywords supplied.
 * @param {string} openAiApiKey The OpenAI API key to use.
 * @param {string} keywords The keywords to base the suggestions on.
 * @param {number} numberOfSuggestions The number of suggestions to generate.
 * @param {string} gptModel The GPT model to use. Defaults to "gpt-3.5-turbo".
 * @return {Promise<string[]>} The list of suggestions.
 */
export const generateSuggestionsBasedOnKeywords = async (
  openAiApiKey,
  keywords,
  numberOfSuggestions = 10,
  gptModel = "gpt-3.5-turbo",
) => {
  if (!keywords || keywords.length === 0) {
    throw new Error("No keywords supplied.");
  }

  const prompt = generateSuggestionPromptBasedOnKeywords(keywords, numberOfSuggestions);
  return generateSuggestions(
    openAiApiKey,
    prompt,
    numberOfSuggestions,
    gptModel,
  );
};
