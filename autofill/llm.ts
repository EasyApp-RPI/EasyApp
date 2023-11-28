import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import {
  UserInfo,
  FieldInfo,
  FilePaths,
  JobInfo,
  inputElements,
} from './types';
import { LLMChain } from 'langchain/chains';
import { loadAllFormData } from './autofillScript';

let userJob = `Developer - EasyApp Aug. 2023 – Present
Rensselaer Center for Open Source Troy, NY
Reduce job application time to mere minutes, providing an increase in speed of nearly 1000% over non-AI assisted capabilities on average
Spearhead development of an AI powered text generative backend designed to automatically adapt to and fill out various online job applications
Develop a connected frontend in the form of a Google Chrome and Firefox extension for ease of use`;

async function initializeModel() {

  const user = (await loadAllFormData()) as UserInfo;

  return new OpenAI({
    openAIApiKey: user["apikey"],
    modelName: 'gpt-3.5-turbo-instruct',
    temperature: 0,
    stop: ['\n, input label:'],
  });
}

let model = initializeModel();

// Call the async function to initialize the model
export const modelPromise = initializeModel();

const normPrompt = PromptTemplate.fromTemplate(`
{userInfo}

Given this user information, respond to the input field label and name

field data: <input aria-describedby="firstNameDescription" ng-required="true" title="First Name" ng-if="!form.fieldAddonLeft &amp;&amp; !form.fieldAddonRight" ng-show="form.key" type="text" step="any" sf-changed="form" autocomplete="on" placeholder="Input text" class="form-control  ng-touched ng-dirty ng-valid-parse ng-empty ng-invalid ng-invalid-tv4-302 ng-invalid-required ng-invalid-schema-form" id="firstName" ng-model-options="form.ngModelOptions" ng-model="model['firstName']" ng-disabled="form.readonly" schema-validate="form" name="firstName" required="required">

input text: {firstName}

field data: <input aria-describedby="unameDescription" ng-required="true" title="Primary Email" ng-if="!form.fieldAddonLeft &amp;&amp; !form.fieldAddonRight" ng-show="form.key" type="text" step="any" sf-changed="form" autocomplete="on" placeholder="Input text" class="form-control  ng-empty ng-invalid ng-invalid-required ng-valid-invalid-email ng-invalid-schema-form" id="uname" ng-model-options="form.ngModelOptions" ng-model="model['uname']" ng-disabled="form.readonly" schema-validate="form" name="uname" required="required">

input text: {email}

field data: {fieldData}

input text:
`);

const dropdownPrompt = PromptTemplate.fromTemplate(`
{userInfo}

Given this user information, respond to the drop down field with the best out of the given options. Do not modify the options.

dropDownOptions: 
string::male
female
other

input text: string::male

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

const datePrompt = PromptTemplate.fromTemplate(`
{userJobs}

Start Date: March 1 2022
End Date: August 1 2022

Choose the best date for the following input in the format the date field expects. If no format can be found assum the format is YYYY-MM-DD

date: <input name="startDate" type="date" class="form-control" value="">
input: 2022-03-01


date: {date}
input:
`);

const fieldTypePrompt = PromptTemplate.fromTemplate(`
What kind of field is this? 
Use its information as well as the previous field's information to determine the kind.
The options are: basic, date, file, previousEmployment

input label: startDate
name: startDate
id: startDate
type: date
header: Employment

input text:
date

input label: {inputLabel}
name: {name}
id: {id}
type: {type}
header: {header}

input text:
`);

const checkboxesPrompt = PromptTemplate.fromTemplate(`
{userInfo}
Based on the user information, should the checkbox be checked or unchecked?

input label: "I am a verteran"

input text: unchecked

input label {inputLabel}

input text:
`);

export const answerField = async (
  userInfo: UserInfo,
  fieldData: inputElements,
) => {
  const chain = new LLMChain({ llm: await model, prompt: normPrompt });
  let result = await chain.call({
    userInfo: JSON.stringify(userInfo),
    firstName: userInfo.firstName,
    email: userInfo.email,
    fieldData: fieldData.inputs[0].outerHTML,
  });

  return result.text as string;
};

export const answerCheckbox = async (
  userInfo: UserInfo,
  fieldData: inputElements,
) => {
  const chain = new LLMChain({ llm: await model, prompt: checkboxesPrompt });
  let result = await chain.call({
    userInfo: JSON.stringify(userInfo),
    inputLabel: fieldData.label.textContent,
  });

  return result.text as string;
};

export const answerDropdown = async (
  userInfo: UserInfo,
  dropDown: string[],
) => {
  const chain = new LLMChain({ llm: await model, prompt: dropdownPrompt });
  let result = await chain.call({
    userInfo: JSON.stringify(userInfo),
    dropDown: dropDown.join('\n'),
  });
  console.log(result.text);
  return result.text as string;
};

// Speacial case for file inputs. The AI will return the file path of the file to upload
export const answerFile = async (
  filePaths: FilePaths,
  fieldInfo: FieldInfo,
) => {
  const chain = new LLMChain({ llm: await model, prompt: filePrompt });
  let result = await chain.call({
    filePaths: JSON.stringify(filePaths),
    inputLabel: fieldInfo.inputLabel,
    name: fieldInfo.name,
    id: fieldInfo.id,
    resumePath: filePaths.resumePath,
  });
  return result.text as string;
};

export const answerDate = async (date: inputElements) => {
  const chain = new LLMChain({ llm: await model, prompt: datePrompt });
  let result = await chain.call({
    userJobs: userJob,
    date: JSON.stringify(date),
  });
  return result.text as string;
};

export const fieldType = async (fieldInfo: FieldInfo) => {
  const chain = new LLMChain({ llm: await model, prompt: fieldTypePrompt });
  let result = await chain.call({
    inputLabel: fieldInfo.inputLabel,
    name: fieldInfo.name,
    id: fieldInfo.id,
    type: fieldInfo.type,
    header: fieldInfo.header,
  });
  return result.text as string;
};
