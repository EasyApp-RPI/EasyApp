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
function labelDist(labels: Element[], input: Element): Element {
    let minDist = Number.MAX_VALUE;
    let minLabel = labels[0];
    for (let i of labels) {
        let dist = Math.abs(i.getBoundingClientRect().top - input.getBoundingClientRect().top);
        if (dist < minDist) {
            minDist = dist;
            minLabel = i;
        }
    }
    return minLabel;
}

function inputDist(inputs: Element[], label: Element): Element {
    let minDist = Number.MAX_VALUE;
    let minInput = inputs[0];
    for (let i of inputs) {
        let dist = Math.abs(i.getBoundingClientRect().top - label.getBoundingClientRect().top);
        if (dist < minDist) {
            minDist = dist;
            minInput = i;
        }
    }
    return minInput;
}


function labelDict(labels: Element[], fields: Element[], map: Map<Element, Element | undefined>, set: Set<Element>){
    for (let i of fields){
        let label = labelDist(labels, i);
        if(!set.has(label) && i == inputDist(fields, label)) {
            map.set(i, label);
            set.add(label);
            console.log("new label found " + label.textContent);
        }
        else{
            let newLabel = label.cloneNode(true);
            newLabel.textContent = label.textContent + " 2";
            console.log("duplicate label found " + newLabel.textContent);
        }
    }
}

let labelMap = new Map<Element, Element | undefined>();
// remove dupe labels

let labels = Array.from(document.querySelectorAll('label'));

let labelSet = new Set<Element>();
labelDict(labels, Array.from(document.querySelectorAll('input')), labelMap, labelSet);

const user = {
  name: "Ariel Ricardo Montero",
  email: "ariel.montmaj@gmail.com",
  address: "1999 Burdett Ave, Troy, NY 12180",
  phone_number: "(123) 456-78910",
  zip: "12180",
  resume: ` Ariel Montero
  (845) 413-6766 | montea8@rpi.edu | linkedin.com/in/ariel-montero | github.com/timelord1102
  
   Education
  Rensselaer Polytechnic Institute		            Troy, NY
  Bachelor of Science in Computer Science (ABET-Accredited) 	     Aug. 2021– May 2025
  Relevant Coursework: Data Structures, Foundations of Computer Science, Principles of Software, Introduction to Algorithms
  
  Experience
  Developer - EasyApp                                                                                                                Aug. 2023 – Present
  Rensselaer Center for Open Source 		               Troy, NY
  Reduce job application time to mere minutes, providing an increase in speed of nearly 1000% over non-AI assisted capabilities on average
  Spearhead development of an AI powered text generative backend designed to automatically adapt to and fill out various online job applications
  Develop a connected frontend in the form of a Google Chrome and Firefox extension for easy of use 
  
  Sales Associate	 May 2023 – Present
  Follett Corporation			Troy, NY
  Lead projects dedicated to improving store efficiency and appearance
  Balance various tasks with greeting and assisting over 100 customers daily
  Adapt skills to non-normal work environments such as events and after hours projects
  
  Cashier and Maintenance Tech                                                                                      Jan. 2023 – Mar. 2023
  Sodexo	               Troy, NY
  Balanced customer assistance with maintenance of dining hall standards
  Guaranteed smooth operation of all sections of the eatery
  Showed mastery of cashier software by debugging issues with the underlying Windows 7 systems
  
  Projects
  SteamScrape | Python, JSON, Steam API, Git	     May 2023 – Present
  Developed a script to scrape a list of over 90,000 games and DLC on Steam
  Combined Steam’s API and web scraping to gather information regardless of API availability
  Used JSON files to store data and keep track of scanned games for easy data updates with no user intervention
  
  RPIt | Jellyfin, Ubuntu Server, Docker, Tdarr                                                                                               Aug. 2022  – Present
  Created a media server with nearly 12 terabytes of video files sourced from a large Blu-ray collection
  Implemented using a heavily customized Jellyfin software installed as a Docker image for easy maintenance
  Utilized Tdarr to fully automate the transcoding of media for standardization of encodings to x264
  
  Technical Skills
  Programming Languages: Python, Java, C/C++, Typescript
  Developer Tools: Git, GitHub, Docker, VS Code, Visual Studio, Eclipse, WSL, Powershell, LangChain
  Languages: English, Spanish
  `,
  major: "Computer Science", 
  none: "none"
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

async function main (){

  let template_text = "Use the following resume to pull data from and fill out a form:" 
  template_text += `Ariel Montero
  (845) 413-6766 | montea8@rpi.edu | linkedin.com/in/ariel-montero | github.com/timelord1102
  
   Education
  Rensselaer Polytechnic Institute		            Troy, NY
  Bachelor of Science in Computer Science (ABET-Accredited) 	     Aug. 2021– May 2025
  Relevant Coursework: Data Structures, Foundations of Computer Science, Principles of Software, Introduction to Algorithms
  
  Experience
  Developer - EasyApp                                                                                                                Aug. 2023 – Present
  Rensselaer Center for Open Source 		               Troy, NY
  Reduce job application time to mere minutes, providing an increase in speed of nearly 1000% over non-AI assisted capabilities on average
  Spearhead development of an AI powered text generative backend designed to automatically adapt to and fill out various online job applications
  Develop a connected frontend in the form of a Google Chrome and Firefox extension for easy of use 
  
  Sales Associate	 May 2023 – Present
  Follett Corporation			Troy, NY
  Lead projects dedicated to improving store efficiency and appearance
  Balance various tasks with greeting and assisting over 100 customers daily
  Adapt skills to non-normal work environments such as events and after hours projects
  
  Cashier and Maintenance Tech                                                                                      Jan. 2023 – Mar. 2023
  Sodexo	               Troy, NY
  Balanced customer assistance with maintenance of dining hall standards
  Guaranteed smooth operation of all sections of the eatery
  Showed mastery of cashier software by debugging issues with the underlying Windows 7 systems
  
  Projects
  SteamScrape | Python, JSON, Steam API, Git	     May 2023 – Present
  Developed a script to scrape a list of over 90,000 games and DLC on Steam
  Combined Steam’s API and web scraping to gather information regardless of API availability
  Used JSON files to store data and keep track of scanned games for easy data updates with no user intervention
  
  RPIt | Jellyfin, Ubuntu Server, Docker, Tdarr                                                                                               Aug. 2022  – Present
  Created a media server with nearly 12 terabytes of video files sourced from a large Blu-ray collection
  Implemented using a heavily customized Jellyfin software installed as a Docker image for easy maintenance
  Utilized Tdarr to fully automate the transcoding of media for standardization of encodings to x264
  
  Technical Skills
  Programming Languages: Python, Java, C/C++, Typescript
  Developer Tools: Git, GitHub, Docker, VS Code, Visual Studio, Eclipse, WSL, Powershell, LangChain
  Languages: English, Spanish
  `

  console.log(template_text);

  let messages = [new SystemMessage({ content: template_text })];

  messages.push(new HumanMessage({content: "First Name"}));
  messages.push(new AIMessage({content: "Samir"}));

  messages.push(new HumanMessage({content: "Address"}));
  messages.push(new AIMessage({content: "1999 Burdette Ave"}));
  //
  messages.push(new HumanMessage({content: "Middle Name"}));
  messages.push(new AIMessage({content: "Sam"}));

    messages.push(new HumanMessage({content: "City"}));
    messages.push(new AIMessage({content: "Troy"}));

    messages.push(new HumanMessage({content: "City 2"}));
    messages.push(new AIMessage({content: ""}));

    messages.push(new HumanMessage({content: "School"}));
    messages.push(new AIMessage({content: "Rensselear Polytechnic Institute"}));



  const inputFields = document.querySelectorAll('input');
  const questionsAndFields: { question: string, field: HTMLInputElement }[] = [];

  let inputs = Array.from(inputFields);
  for (let [key, value] of labelMap) {

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