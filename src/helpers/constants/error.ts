interface ErrorMessages {
  [key: number]: string;
}

export const ERROR_MESSAGES: ErrorMessages = {
  401: "Invalid Access Key. Please visit [this](https://github.com/BharathxD/OpenAI-Chatbot) for more information.",
  429: "Slow down, huh? Got it. 🐌",
  500: "OpenAI API error",
};