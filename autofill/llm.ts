import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { UserInfo, FieldInfo} from "./types";
import { LLMChain } from "langchain/chains";

export const model = new OpenAI(
  {openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo-instruct",
    temperature: 0,
    stop: ["\n, input label:"]
  });


const prompt= PromptTemplate.fromTemplate(`
{userInfo}

Given this user information, respond to the input field label and name

input label: First Name
name: FirstName
id: first-name
placeholder: Enter First Name

input text: {firstName}

input label: null
name: phoneNumber
id: null
placeholder: Enter your mobile number here

input text: {phoneNumber}

input label: {inputLabel}
name: {name}
id: {id}
placeholder: {placeholder}

input text:
`);


export const answerField = async (userInfo: UserInfo, fieldInfo: FieldInfo) => {
  const chain = new LLMChain({ llm: model, prompt });

  let result = chain.call({
    userInfo: JSON.stringify(userInfo),
    firstName: userInfo.firstName,
    phoneNumber: userInfo.phoneNumber,
    inputLabel: fieldInfo.inputLabel,
    name: fieldInfo.name,
    id: fieldInfo.id,
    placeholder: fieldInfo.placeholder,
  });


  result = result.then((value) => (value.res.text));

  return result
}

