import { CreateChatCompletionRequest } from "openai";

const OPENAI_COMPLETIONS_API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export const getOpenAICompletion = async (
  payload: CreateChatCompletionRequest
): Promise<ReadableStream<Uint8Array> | undefined> => {
  try {
    const response = await fetch(OPENAI_COMPLETIONS_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      body: JSON.stringify(payload),
    });
    if (response.ok && response.body) {
      return response.body;
    }
    console.error(`Error getting OpenAI completion. Status: ${response.status}`);
  } catch (error: any) {
    console.error(`Error getting OpenAI completion: ${error.message}`);
  }
};
