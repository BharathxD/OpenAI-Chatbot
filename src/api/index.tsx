"use client";

import { Message } from "@/lib/validators/message";

const base = process.env.NEXT_PUBLIC_API_ENDPOINT;

const CHAT_API_ENDPOINT = `${base}/api/message`;

const ERROR_MESSAGE = {
  INVALID_ACCESS_KEY:
    "Invalid Access Key, Please visit this [link](https://github.com/BharathxD/OpenAI-Chatbot#get-your-key-httpsplatformopenaicomaccountapi-keys) for more information.",
};

export const sendMessage = async (
  payload: Message
): Promise<ReadableStream<Uint8Array> | null | string> => {
  try {
    const response = await fetch(CHAT_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ messages: [payload] }),
    });

    if (response.status === 401) {
      throw new Error(ERROR_MESSAGE.INVALID_ACCESS_KEY);
    }

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
    return response.body;
  } catch (error: any) {
    return error.message;
  }
};
