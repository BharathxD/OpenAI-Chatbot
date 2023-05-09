// Import necessary modules
import axios, { AxiosResponse } from "axios";
import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser";

// Define OpenAI completions endpoint
const OPENAI_COMPLETIONS_API_ENDPOINT = `https://api.openai.com/v1/chat/completions`;

// Define chat agent types
export type ChatGPTAgent = "user" | "system";

// Define chat message interface
export interface ChatGPTMessage {
    role: ChatGPTAgent;
    content: string;
}

// Define OpenAI stream payload interface
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

// Define function to get OpenAI completions
export const getOpenAICompletion = async (payload: OpenAIStreamPayload): Promise<any> => {
    try {
        // Send POST request to OpenAI completions endpoint with provided payload
        const response: AxiosResponse = await axios.post(OPENAI_COMPLETIONS_API_ENDPOINT, payload, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });

        // Log response data and return it
        console.log(`Response Data: ${response.data}`);
        return response.data;
    } catch (error: any) {
        // Log any errors encountered
        console.error("Error getting OpenAI completion:", error.message);
    }
};

// Define function to create OpenAI stream
const OpenAIStream = async (payload: OpenAIStreamPayload): Promise<ReadableStream<any>> => {
    // Initialize encoder and decoder for text encoding/decoding
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let counter = 0;

    // Get OpenAI completion response
    const response = await getOpenAICompletion(payload);
    console.log(`Response Data: ${response}`);

    // Create new ReadableStream object
    const stream = new ReadableStream({
        async start(controller) {
            // Define function to parse incoming events
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if (event.type === "event") {
                    const data = event.data;
                    if (data === "[DONE]") {
                        // If "[DONE]" message received, close the stream
                        return controller.close();
                    }
                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta?.content || "";
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            // If fewer than 2 messages have been sent and the text contains a newline character, skip it
                            return;
                        }
                        // Encode text and enqueue it in the stream
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                        counter++;
                    } catch (error: any) {
                        // Log any errors encountered
                        controller.error(error);
                        console.log("ERROR");
                    }
                }
            }

            // Create new event parser
            const parser = createParser(onParse);

            // Feed response data to parser as it arrives
            for await (const chunk of response as any) {
                parser.feed(decoder.decode(chunk));
            }
        },
    });

    return stream;
};

// Export OpenAIStream function as default
export default OpenAIStream;
