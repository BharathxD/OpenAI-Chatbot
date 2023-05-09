import axios, { AxiosResponse } from "axios";
import { ChatCompletionResponseMessage, CreateChatCompletionRequest, CreateChatCompletionResponse } from "openai";


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
): Promise<CreateChatCompletionResponse | undefined> => {
  try {
    const response: AxiosResponse<CreateChatCompletionResponse> = await axios.post(
      OPENAI_COMPLETIONS_API_ENDPOINT,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        },
      }
    );
    const data = response.data;
    return data;
  } catch (error: any) {
    console.error("Error getting OpenAI completion:", error.message);
  }
};
