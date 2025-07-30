import { GoogleGenAI } from "@google/genai";

function initializeApiKey() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("apiKey")) {
    const apiKey = urlParams.get("apiKey");
    if (apiKey) {
      localStorage.setItem("googleApiKey", apiKey.trim());
      // clear the apiKey from the URL to avoid reusing it
      window.history.replaceState(null, "", window.location.pathname);
      return new GoogleGenAI({ apiKey: apiKey.trim() });
    } else {
      alert("API key is required to use this feature.");
      throw new Error("API key is required");
    }
  }
  let apiKey = localStorage.getItem("googleApiKey");
  if (apiKey) {
    apiKey = apiKey.trim();
    if (apiKey) {
      return new GoogleGenAI({ apiKey });
    }
  } else {
    const apiKey = window.prompt("Please enter your Google GenAI API key.", "");
    if (apiKey) {
      localStorage.setItem("googleApiKey", apiKey.trim());
      return new GoogleGenAI({ apiKey: apiKey.trim() });
    } else {
      alert("API key is required to use this feature.");
      throw new Error("API key is required");
    }
  }
}
export const ai = initializeApiKey();
