"use server"

import { chatbotPrompt } from "@/helpers/constants/chatbot-prompt";
import { ChatGPTMessage, OpenAIStreamPayload } from "@/lib/openai-stream";
import { MessageArraySchema } from "@/lib/validators/message";
import OpenAIStream from "@/lib/openai-stream";

export async function POST(req: Request) {
    const { messages } = await req.json();
    /**
     * `MessageArraySchema.parse(message)` is parsing the `message` object received in the request body using the 
     * `MessageArraySchema` validator. 
     * If the `message` object does not conform to the schema, an error will be thrown. 
    */
    const parsedMessages = MessageArraySchema.parse(messages);
    /** 
     * This code is creating an array of `ChatGPTMessage` objects called `outbountMessage`. 
     * It is using the `map()` method to iterate over each message in the `parsedMessages` array and create a new `ChatGPTMessage` object
     * for each one. 
    */
    const outbountMessages: ChatGPTMessage[] = parsedMessages.map((message) => ({
        role: message.isUserMessage ? "user" : "system",
        content: message.text
    }));
    /**
     * `outbountMessages.unshift()` is adding a new `ChatGPTMessage` object to the beginning of the `outbountMessages` array.
     * This new message has a `role` of "system" and a `content` of `chatbotPrompt`, which is a constant that likely contains a prompt or
     * greeting for the chatbot.
     * This ensures that the chatbot's initial message is always the first message in the conversation. 
    */
    outbountMessages.unshift({
        role: "system",
        content: chatbotPrompt,
    })
    /**
     * This contains various properties used to configure and send a request to the OpenAI API. 
    */
    const payload: OpenAIStreamPayload = {
        model: 'gpt-3.5-turbo',
        messages: outbountMessages,
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 150,
        stream: true,
        n: 1
    }
    const stream = await OpenAIStream(payload);
    return new Response(stream);
}