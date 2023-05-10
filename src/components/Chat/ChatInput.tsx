"use client";

import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  FC,
  HTMLAttributes,
  KeyboardEvent,
  useContext,
  useRef,
  useState,
} from "react";
import { nanoid } from "nanoid";
import TextareaAutosize from "react-textarea-autosize";
import { sendMessage } from "@/api";
import { MessagesContext } from "@/context/messages";
import { Message } from "@/lib/validators/message";

/**
 *  The `interface ChatInputProps` is defining the props that can be passed to the `ChatInput` component.
 * It extends the `HTMLAttributes<HTMLDivElement>` interface, which means that it inherits all the props that can be passed to a
 * `div` element, such as `className`, `style`, `onClick`, etc.
 * This allows the `ChatInput` component to accept any props that a `div` element can accept, in addition to any custom props that may be defined specifically for the `ChatInput` component.
 */

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    messages,
    addMessage,
    updateMessage,
    removeMessage,
    setIsMessageUpdating,
  } = useContext(MessagesContext);
  const { mutate, isLoading } = useMutation(sendMessage, {
    onSuccess: async (stream) => {
      if (!stream) throw new Error("No Stream Found");
      setIsMessageUpdating(true);
      const messageId = `message_${nanoid()}`;
      const responseMessage: Message = {
        id: messageId,
        isUserMessage: false,
        text: "",
      };
      addMessage(responseMessage);
      const decoder = new TextDecoder();
      const reader = stream.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunkValue = decoder.decode(value);
        updateMessage(messageId, (prevMessage) => prevMessage + chunkValue);
      }
      setIsMessageUpdating(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
    },
    onMutate: (message) => {
      setInput("");
      addMessage(message);
    },
    onError: () => {
      console.error("Error sending the message!");
    },
  });
  const handleMessageInput = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    //? Triggers if users performs `Enter` Keyboard event. but not `Shift` and `Enter` Event
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const message = {
        id: `message_${nanoid()}`,
        isUserMessage: true,
        text: input,
      };
      mutate(message);
    }
  };
  return (
    <div {...props} className={cn("border-t border-zinc-300", className)}>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
        <TextareaAutosize
          onKeyDown={(event) => handleMessageInput(event)}
          rows={2}
          ref={textareaRef}
          maxRows={4}
          placeholder={"Write a message..."}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="peer disabled:opacity-50 pr-14 text-black resize-none block w-full border-0 bg-zinc-100 py-1.5 tex-grey-900 focus:ring-0 text-sm sm:leading-6"
          autoFocus
        />
      </div>
    </div>
  );
};

export default ChatInput;
