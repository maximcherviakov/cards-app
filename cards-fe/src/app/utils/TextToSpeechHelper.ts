import axios from "axios";
import agent from "../api/agent";

const supportedLanguages = ["en", "uk"];

const uninterceptedAxiosInstance = axios.create();

export async function textToSpeech(text: string) {
  getLanguageCode(text).then((languageCode: string) => {
    console.log(languageCode);
    playTextAudio(text, languageCode);
  });
}

function playTextAudio(text: string, lang: string) {
  const params = new URLSearchParams();

  params.append("text", text);
  params.append("lang", lang);

  const audioContext = new window.AudioContext();
  agent.Proxy.textToSpeech(params)
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      source.start(0);
    })
    .catch((error) => {
      console.error("Error loading audio:", error);
    });
}

async function getLanguageCode(text: string) {
  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODg2MmQyYWUtMjYzYy00NDEyLTlhZTctYmY3ZmIwZTBmZGNkIiwidHlwZSI6ImFwaV90b2tlbiJ9.kC4uvYBlCe2FCjuIcNN5KNvbkoNIygBpsSbNZdT-HTM",
  };
  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/translation/language_detection",
    headers: headers,
    data: {
      providers: "google",
      text: text,
    },
    withCredentials: false,
  };

  return uninterceptedAxiosInstance
    .request(options)
    .then((response) => response.data.google.items[0].language)
    .then((lang) => {
      if (supportedLanguages.includes(lang)) {
        return lang;
      } else {
        return "en";
      }
    })
    .catch(() => "en");
}
