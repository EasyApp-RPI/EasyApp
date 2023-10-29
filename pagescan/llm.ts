import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { FieldInfo } from "../autofill/types";
import { LLMChain } from "langchain/chains";

export const model = new OpenAI(
  {openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo-instruct",
    temperature: 0,
    stop: ["\n, input label:"]
  });


const prompt = PromptTemplate.fromTemplate(`
{fieldInfo}
{userResponse}
Given this field info and the users response, which field in user data does this data apply to?

Options:
[
fullName,
firstName,
lastName,
middleName,
email,
phoneNumber,
phoneExtension,
address,
zip,
city,
state,
country,
veteranStatus,
disabilityStatus,
workAuthorization,
needSponsorship,
graduationDate,
genders,
raceAndEthnicitys,
sexualOrientations,
other
]

`);

export async function answerUserdata(fieldInfo: FieldInfo, userResponse: string): Promise<string> {
    const chain = new LLMChain({ llm: model, prompt: prompt });
    let result = await chain.call({
        fieldInfo: fieldInfo,
        userResponse: userResponse,
      });

    return result.text as string;
}