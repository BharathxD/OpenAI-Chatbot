import { array, boolean, infer as ZodInfer, object, string } from "zod";

export const MessageSchema = object({
    id: string(),
    isUserMessage: boolean(),
    text: string()
})

//? Array Validator
export const MessageArraySchema = array(MessageSchema);

export type Message = ZodInfer<typeof MessageSchema>;
