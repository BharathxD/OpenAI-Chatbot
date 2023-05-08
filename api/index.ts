import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_ENDPOINT;

const chatBase = `${base}/api/message`;

interface sendMessagePayload {
    id: string,
    isUserInput: boolean,
    text: string
}

export const sendMessage = async (payload: sendMessagePayload) => {
    const response = await axios.post(chatBase, payload, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.data;
    return data;
}
