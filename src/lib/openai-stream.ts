import {
    ParsedEvent,
    ReconnectInterval,
    createParser,
} from "eventsource-parser";
import { getOpenAICompletion } from "./openai";
import { CreateChatCompletionRequest, CreateChatCompletionResponse } from "openai";

// Define function to create OpenAI stream
const OpenAIStream = async (
    payload: CreateChatCompletionRequest
): Promise<ReadableStream<any>> => {
    // Initialize encoder and decoder for text encoding/decoding
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let counter = 0;

    // Get OpenAI completion response
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    /**
     * This code is creating a new `ReadableStream` object with an `async start` function that will be
     * called when the stream is started.
     * The `start` function takes a `controller` parameter, which is used to control the stream.
     */
    const stream = new ReadableStream({
        async start(controller) {
            /**
             * The function processes incoming data events, skips messages with newline characters if
             * fewer than two messages have been sent, encodes the text and enqueues it in the stream,
             * and logs any errors encountered.
             * @param {ParsedEvent | ReconnectInterval} event - The `event` parameter is an object that
             * represents an event that has been parsed from a stream of data. It can be of type
             * `ParsedEvent` or `ReconnectInterval`. The function checks if the type of the event is
             * "event" and then proceeds to parse the data.
             * @returns If the `event` type is "event" and the `data` is "[DONE]", the function will
             * return `controller.close()`. Otherwise, it will either skip the message or enqueue the
             * encoded text in the stream, depending on certain conditions. If there is an error, the
             * function will log it and return `controller.error(error)`.
             */
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if (event.type === "event") {
                    const data = event.data;
                    /**
                     * If "[DONE]" message received, close the stream
                     * To know more about the follwing condition
                     * @see https://platform.openai.com/docs/api-reference/completions/create#completions/create-stream
                     */
                    if (data === "[DONE]") {
                        controller.close();
                        return;
                    }
                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta?.content || "";
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            /**
                             * This is a prefix character (i.e., "\n\n"), do nothing
                             * If fewer than 2 messages have been sent and the text contains a newline
                             * character, skip it
                             */
                            return;
                        }
                        // Encode text and enqueue it in the stream
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                        counter++;
                    } catch (error: any) {
                        // Log any errors encountered
                        controller.error(error);
                    }
                }
            }

            //? Create new event parser
            const parser = createParser(onParse);

            /**
             * This code is feeding the response data from the OpenAI API to an event parser as it arrives.
             * The `for await...of` loop is used to iterate over the response data as a stream of chunks and each chunk is decoded using
             * a `TextDecoder` object.
             * The decoded text is then passed to the event parser using the `parser.feed()` method, which parses the text
             * and emits events for each message received.
             * This allows the code to process the OpenAI API response in real-time as it arrives, rather than waiting for the entire
             * response to be received before processing it.
             */
            for await (const chunk of response.body as any) {
                parser.feed(decoder.decode(chunk));
            }
        },
    });
    return stream;
};

export default OpenAIStream;
