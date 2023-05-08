"use client";

import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC, HTMLAttributes, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { sendMessage } from "../../api";

/**
 *  The `interface ChatInputProps` is defining the props that can be passed to the `ChatInput` component.
 * It extends the `HTMLAttributes<HTMLDivElement>` interface, which means that it inherits all the props that can be passed to a
 * `div` element, such as `className`, `style`, `onClick`, etc.
 * This allows the `ChatInput` component to accept any props that a `div` element can accept, in addition to any custom props that may be defined specifically for the `ChatInput` component.
 */
interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>("");
  const { mutate, isLoading } = useMutation<
    string,
    AxiosError,
    Parameters<typeof sendMessage>["0"]
  >(sendMessage, {});
  return (
    <div {...props} className={cn("border-t border-zinc-300", className)}>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
        <TextareaAutosize
          rows={2}
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
