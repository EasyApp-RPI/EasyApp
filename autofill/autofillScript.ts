/*// Very basic function to find closest label to input field. Used for testing below
function labelDist(labels: Element[], input: Element): Element {
    let minDist = Number.MAX_VALUE;
    let minLabel = labels[0];
    for (let i = 0; i < labels.length; i++) {
        let dist = Math.abs(labels[i].getBoundingClientRect().top - input.getBoundingClientRect().top);
        if (dist < minDist) {
            minDist = dist;
            minLabel = labels[i];
        }
    }
    return minLabel;
}


// This file will be run on the content page, and should include all the logic for inserting text into form items.
const firstNameField = document.querySelector('input[name="First Name"]');
const lastNameField = document.querySelector('input[name="Last Name"]');

// Gets all input fields that contain keyword "email"
const emailField = document.querySelectorAll('input[id*="email"]');

if (firstNameField) (firstNameField as HTMLInputElement).value = "yourFirstName";
if (lastNameField) (lastNameField as HTMLInputElement).value = "yourLastName";

// Sets all email fields to "yourEmail" as long as field ID contains "email"
for (let i = 0; i < emailField.length; i++)
    if (emailField[i]) (emailField[i] as HTMLInputElement).value = "yourEmail";

// Trigger agree to terms and conditions. Tested on "https://store.steampowered.com/join" but should work on any site with a checkbox with the word "agree" in the name. Proof of concept for checkboxes
const agreeToTerms = document.querySelector('input[name*="agree"]');
if (agreeToTerms) (agreeToTerms as HTMLInputElement).checked = true;

// Dropdown test. Sets to Albania on "https://www.globalsqa.com/demo-site/select-dropdown-menu/" proof of concept for dropdowns
const stateField = document.getElementById("address-level1") as HTMLSelectElement;
stateField.value = "AL";

const countryField = document.getElementById("country") as HTMLSelectElement;
countryField.value = "US";



// Testing, fill all input fields with its own label text

// Get all labels, convert to array
const labels = document.querySelectorAll('label');
const labelArray = Array.from(labels);

// Get all input fields
const inputs = document.querySelectorAll('input');

let label;

// For each input field, find closest label and set input field to label text. Currently bugged for non labeled input fields
for (let i = 0; i < inputs.length; i++) {
    label = labelDist(labelArray, inputs[i]);
    label = label?.textContent;
    if (label) (inputs[i] as HTMLInputElement).value = label;

}


export {}
*/

import { AIMessage, BaseMessage, ChatMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { chatModel } from "./llm";



// Very basic function to find closest label to input field. Used for testing below
function labelDist(labels: Element[], input: Element): Element {
    let minDist = Number.MAX_VALUE;
    let minLabel = labels[0];
    for (let i = 0; i < labels.length; i++) {
        let dist = Math.abs(labels[i].getBoundingClientRect().top - input.getBoundingClientRect().top);
        if (dist < minDist) {
            minDist = dist;
            minLabel = labels[i];
        }
    }
    return minLabel;
}

function fieldDist(fields: Element[], input: Element): Element {
    let minDist = Number.MAX_VALUE;
    let minField = fields[0];
    for (let i = 0; i < fields.length; i++) {
        let dist = Math.abs(fields[i].getBoundingClientRect().top - input.getBoundingClientRect().top);
        if (dist < minDist) {
            minDist = dist;
            minField = fields[i];
        }
    }
    return minField;
}

function labelDict(labels: Element[], fields: Element[], map: Map<Element, Element | undefined>){
    let emptyElement = document.createElement("input");
    for (let i = 0; i < fields.length; i++){
        let label = labelDist(labels, fields[i]);
        if(fields[i] == fieldDist(fields, label)){
            map.set(fields[i], label);
        }
        else{
            map.set(fields[i], map.get(fields[i-1] || emptyElement));
        }
    }
}

let labelMap = new Map<Element, Element | undefined>();
labelDict(Array.from(document.querySelectorAll('label')), Array.from(document.querySelectorAll('input')), labelMap);

const user = {
  name: "samir sam beall",
  email: "samir.beall@gmail.com",
  address: "1999 Burdett Ave, Troy, NY 12180",
  phone_number: "(123) 456-78910",
  zip: "12180",
  major: "Computer Science", 
  //school: "RPI", //Even if the school variable is after the major variable, it will autofill the "School", "Company", and "Postion fields with "RPI"
  none: "none",
};

// Dropdown test. Sets to Albania on "https://www.globalsqa.com/demo-site/select-dropdown-menu/" proof of concept for dropdowns
//const stateField = document.getElementById("degree") as HTMLSelectElement;
//stateField.value = "Bachelor's Degree";

/*Possible methods for dropdown?
const dropdownData = [
    { id: 1, name: "Option 1" },
    { id: 2, name: "Option 2" },
    { id: 3, name: "Option 3" }
];

const dropdown = document.getElementById("dropdown") as HTMLSelectElement;

// Function to populate the dropdown
function populateDropdown(data: any[]) {
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = JSON.stringify(item); // Convert the object to a JSON string
        option.text = item.name; // Set the display text
        dropdown.appendChild(option);
    });
}*/

//FUNCTION FOR UPLOADING A PDF
function uploadPDF() {
    document.addEventListener('DOMContentLoaded', () => {
        const uploadForm = document.getElementById('uploadForm') as HTMLFormElement;
        const pdfInput = document.getElementById('pdfInput') as HTMLInputElement;
        const messageDiv = document.getElementById('message');

        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            if (pdfInput.files!=null) {
                formData.append('pdfFile', pdfInput.files[0]);
            }
            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (messageDiv!=null) {
                    if (response.ok) {
                        messageDiv.innerText = 'PDF uploaded successfully!';
                    } else {
                        messageDiv.innerText = 'Failed to upload PDF.';
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (messageDiv!=null) {
                    messageDiv.innerText = 'An error occurred while uploading the PDF.';
                }
            }
        });
    });
}

// main.ts
async function main (){

  let template_text = "I will give you an input field and you choose which response best fits the response} \
  the data you will use is:";

  template_text += JSON.stringify(user)

  console.log(template_text);

  let messages = [new SystemMessage({ content: template_text })];

  messages.push(new HumanMessage({content: "First Name"}));
  messages.push(new AIMessage({content: "Samir"}));

  messages.push(new HumanMessage({content: "Address"}));
  messages.push(new AIMessage({content: "1999 Burdette Ave"}));
  //
  messages.push(new HumanMessage({content: "Middle Name"}));
  messages.push(new AIMessage({content: "Sam"}));

  const inputFields = document.querySelectorAll('input');
  const questionsAndFields: { question: string, field: HTMLInputElement }[] = [];

  inputFields.forEach((inputField: HTMLInputElement) => {
    const label = document.querySelector(`label[for="${inputField.id}"]`);
    if (label) {
      questionsAndFields.push({
        question: label.textContent || '',
        field: inputField
      });
    }
  });

  console.log(questionsAndFields);

  messages.push(new HumanMessage({content: "placeholder"}))


  for (let [key, value] of labelMap){
    messages.push(new HumanMessage({content: value?.textContent || ''}));
    let chatModelResult = chatModel.predictMessages(messages);

    chatModelResult.then((resolvedResponse: BaseMessage) => {
        console.log("chat result: ")
        console.log(chatModelResult);
        if(key) (key as HTMLInputElement).value = resolvedResponse.content;
    })
}

  /*for (const qf of questionsAndFields){

    console.log("querying chat")
    messages[7] = new HumanMessage({content: qf.question});

    let chatModelResult = chatModel.predictMessages(messages);

    chatModelResult.then((resolvedResponse: BaseMessage) => {
      console.log("chat result: ")
      console.log(chatModelResult);

      qf.field.value = resolvedResponse.content;
    })
    // messages.push(chatModelResult);

  }*/

  console.log(messages);
}

main();


export {}