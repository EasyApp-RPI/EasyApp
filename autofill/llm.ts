import { OpenAI } from "langchain/llms/openai";

export const chatModel = new OpenAI({openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0, modelName: "gpt-3.5-turbo-instruct"});