import axios, { AxiosResponse } from "axios";

const OPENAI_COMPLETIONS_API_ENDPOINT = `https://api.openai.com/v1/chat/completions`;

export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessage {
    role: ChatGPTAgent;
    content: string;
}

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

export const getOpenAICompletion = async (payload: OpenAIStreamPayload): Promise<any> => {
    try {
        const response: AxiosResponse = await axios.post(OPENAI_COMPLETIONS_API_ENDPOINT, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error getting OpenAI completion:", error);
        throw error;
    }
};

const OpenAIStream = async (payload: OpenAIStreamPayload): Promise<ReadableStream<any>> => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let counter = 0;
    try {
        const response = await getOpenAICompletion(payload);
        const stream = new ReadableStream({
            
        });

        return stream;
    } catch (error) {
        console.error("Error creating OpenAI stream:", error);
        throw error;
    }
}

export default OpenAIStream;