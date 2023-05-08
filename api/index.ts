import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_ENDPOINT;

const chatBase = `${base}/api/message`;

export const sendMessage = async (payload: {
    messages: string
}) => {
    const response = await axios.post(chatBase, payload, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.data;
    return data;
}
