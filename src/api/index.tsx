"use client";

import { Message } from "@/lib/validators/message";

const base = process.env.NEXT_PUBLIC_API_ENDPOINT;

const CHAT_API_ENDPOINT = `${base}/api/message`;

export const sendMessage = async (
  payload: Message
): Promise<ReadableStream<Uint8Array> | null> => {
  const response = await fetch(CHAT_API_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ messages: [payload] }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
  if (response.body) {
    return response.body;
  } else {
    throw new Error("No response body found.");
  }
};
