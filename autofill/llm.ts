import { ChatOpenAI } from "langchain/chat_models/openai";

export const chatModel = new ChatOpenAI({openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0});
