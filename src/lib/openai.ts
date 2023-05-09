"use server";

import axios, { AxiosResponse } from "axios";
import { ChatGPTMessage } from "./openai-stream";

const OPENAI_COMPLETIONS_API_ENDPOINT = `https://api.openai.com/v1/chat/completions`;

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export const getOpenAICompletion = async (
  payload: OpenAIStreamPayload
): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(
      OPENAI_COMPLETIONS_API_ENDPOINT,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        },
      }
    );
    return await response.data;
  } catch (error: any) {
    console.error("Error getting OpenAI completion:", error.message);
  }
};
