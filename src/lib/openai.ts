import { ChatCompletionResponseMessage, CreateChatCompletionRequest } from "openai";


const OPENAI_COMPLETIONS_API_ENDPOINT = `https://api.openai.com/v1/chat/completions`;

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatCompletionResponseMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export const getOpenAICompletion = async (
  payload: CreateChatCompletionRequest
): Promise<ReadableStream<Uint8Array> | undefined> => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
  };
  try {
    const response = await fetch(OPENAI_COMPLETIONS_API_ENDPOINT, {
      headers,
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (response.body) {
      return response.body;
    }
  } catch (error: any) {
    console.error("Error getting OpenAI completion:", error.message);
  }
};
