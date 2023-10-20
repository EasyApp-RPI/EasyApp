import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { UserInfo, FieldInfo, FilePaths} from "./types";
import { LLMChain } from "langchain/chains";

export const model = new OpenAI(
  {openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo-instruct",
    temperature: 0,
    stop: ["\n, input label:"]
  });


const normPrompt = PromptTemplate.fromTemplate(`
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

const dropdownPrompt = PromptTemplate.fromTemplate(`
{userInfo}

Given this user information, respond to the drop down field with the best out of the given options

dropDownOptions: 
male
female
other

input text: male

dropDownOptions: {dropDown}

input text:
`);

const filePrompt = PromptTemplate.fromTemplate(`
{filePaths}
which file should be uploaded based on the field info?

input label: resume
name: 
id: resume

input text:
{resumePath}

input label: {inputLabel}
name: {name}
id: {id}

input text:
`);


export const answerField = async (userInfo: UserInfo, fieldInfo: FieldInfo, dropDown: string[] = [] ) => {
  if (dropDown.length > 0) {

    const chain = new LLMChain({ llm: model, prompt: dropdownPrompt });
    let result = await chain.call({
      userInfo: JSON.stringify(userInfo),
      dropDown: dropDown.join("\n")
    });
    console.log(result.text);
    return result.text as string;

  } else {

    const chain = new LLMChain({ llm: model, prompt: normPrompt });
    let result = await chain.call({
      userInfo: JSON.stringify(userInfo),
      firstName: userInfo.firstName,
      phoneNumber: userInfo.phoneNumber,
      inputLabel: fieldInfo.inputLabel,
      name: fieldInfo.name,
      id: fieldInfo.id,
      placeholder: fieldInfo.placeholder,
    });

    return result.text as string;

  }

  
}

// Speacial case for file inputs. The AI will return the file path of the file to upload
export const answerFile = async (filePaths: FilePaths, fieldInfo: FieldInfo) => {
  const chain = new LLMChain({ llm: model, prompt: filePrompt });
  let result = await chain.call({
    filePaths: JSON.stringify(filePaths),
    inputLabel: fieldInfo.inputLabel,
    name: fieldInfo.name,
    id: fieldInfo.id,
    resumePath: filePaths.resumePath,
  });
 return result.text as string;
}