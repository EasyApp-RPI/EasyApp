import { answerField, answerFile, fieldType } from "./llm";
import { FieldInfo, UserInfo, FilePaths, inputElements } from "./types";

const user: UserInfo = {
  firstName: "Samir",
  lastName: "Beall",
  email: "montea8@rpi.edu",
  address: "1999 Burdett Ave, Troy, NY 12180",
  phoneNumber: "(123) 456-78910",
  zip: "12180",
  null: "other",
};
const files: FilePaths = {
  resumePath: "C:\\Users\\lordo\\Downloads\\Ariels Resume-1.pdf",
  transcriptPath: "C:\\Users\\lordo\\Downloads\\Academic Transcript.pdf",
  coverLetterPath: "null",
}

function isBefore(element1: Element, element2: Element): boolean {
  return element1.compareDocumentPosition(element2) === Node.DOCUMENT_POSITION_PRECEDING;
}

// A simple function to clean up the response from the AI. The AI will often return a string containing "AI: " at the beginning
function cleanUp(input: string): string {
  while (input[0] != ":") {
    input = input.slice(1);
  }
  input = input.slice(1);
  return input;
}


async function getElements() {
  let data : inputElements[] = [];
  let inputs : HTMLInputElement[] = []
  let stack : Element[] = [document.body]; // Use a stack for DFS
  let isLabelFound = false;
  let visited : Set<Element> = new Set();
  let currentLabel: HTMLLabelElement | null = null;
  let currHeader: string = "";

  // go through html object by object and get all labels and inputs
  while (stack.length > 0) {
    let current = stack.pop(); // Pop a node from the stack

    if (current instanceof HTMLHeadingElement) {
      currHeader = current.textContent || "";
    }

    if (!current || visited.has(current)) continue;
    visited.add(current);

    if (current instanceof HTMLLabelElement) {
      if (isLabelFound && currentLabel && inputs.length > 0){
        let fieldInfo : FieldInfo = {
          inputLabel: currentLabel.textContent || "",
          name: inputs[0].name || "",
          id: inputs[0].id || "",
          placeholder: inputs[0].placeholder || "",
          type: inputs[0].type || null,
          header: currHeader,
        };
        let prev
        if (data.length > 1) prev = data[data.length - 1].label.textContent || "";
        else  prev = "";
        let type = await fieldType(fieldInfo);
        data.push({label: currentLabel, inputs: inputs, type: type, header: currHeader});
        inputs = [];
      }
      currentLabel = current;
      isLabelFound = true;
    } else if (isLabelFound && current instanceof HTMLInputElement) {
      inputs.push(current);
    }

    let child = current.lastElementChild;
    while (child) {
      stack.push(child);
      child = child.previousElementSibling;
    }
  }

  // Add the inputs found after the last label
  if (isLabelFound && currentLabel && inputs.length > 0) {
    let fieldInfo : FieldInfo = {
      inputLabel: currentLabel.textContent || "",
      name: inputs[0].name || "",
      id: inputs[0].id || "",
      placeholder: inputs[0].placeholder || "",
      type: inputs[0].type || null,
      header: currHeader,
    };

    let prev
    if (data.length > 1) prev = data[data.length - 1].label.textContent || "";
    else  prev = "";

    let type = await fieldType(fieldInfo);

    data.push({label: currentLabel, inputs: inputs, type: type, header: currHeader});
  }

  for (let i of data){
    console.log("Label: \n" + i.label.textContent);
    console.log("Inputs:" + i.inputs.length);
    console.log("Type: " + i.type);
  }

  return data;
  
}
      





// Uses AI to fill in standard text fields.
// Standard text fields assume that both the input field and label are wrapped exclusively in a div.
async function normalFields(data: inputElements[]) {
  
  // get all inputElemets with a type of basic
  let basicFields = data.filter((i) => i.type == "basic");
  // for each input element get the label and input
  for (let i of basicFields) {
    let fieldInfo: FieldInfo = {
      inputLabel: i.label.textContent || "",
      name: i.inputs[0].name || "",
      id: i.inputs[0].id || "",
      placeholder: i.inputs[0].placeholder || "",
      type: i.inputs[0].type || null,
      header: i.header,
    };

    // get ai response
    let response = await answerField(user, fieldInfo);
    // set input value to response
    console.log("result (normal): " + response);
    if (response.trim() != "null") i.inputs[0].value = response.trim();
  }
}

async function fileFields(data: inputElements[]) {
  // get all inputElemets with a type of file
  let fileFields = data.filter((i) => i.type == "file");
  for (let i of fileFields) {
    let fieldInfo: FieldInfo = {
      inputLabel: i.label.textContent || "",
      name: i.inputs[0].name || "",
      id: i.inputs[0].id || "",
      placeholder: i.inputs[0].placeholder || "",
      type: i.inputs[0].type || null,
      header: i.header,
    };
   let file = await answerFile(files, fieldInfo);
   if (file == "null") continue;

   // get text after last '\\' in file path. This is the file name
   let fileName = file.split("\\").pop();
   // create a file object with the file name
   const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
   dataTransfer.items.add(new File(["file"], fileName || ""));
   // set input files to the file object, then clear the data transfer and continue to next field
   i.inputs[0].files = dataTransfer.files;
   dataTransfer.items.clear();
  }
}

// Uses AI to fill in dropdown fields. Dropdown fields are similar to input fields, but instead of an input, they have
// a select element with a number of options. The options are treated similarly to an array
// This array is passed to the AI which then chooses the best response.
async function dropdownFields() {
  // get dropdowns from page using jquery
  let dropdowns = document.querySelectorAll("select");
  // for each dropdown get the option value field as an array
  for (let i of dropdowns) {
    let options = i.querySelectorAll("option");

    //covert options to array. Potentially may need to be changed to a Map to account for ambiguous labeling
    let dropdownOptions: string[] = [];
    for (let j of options) {
      let option = j as HTMLOptionElement;
      dropdownOptions.push(option.value);
    }
    console.log(dropdownOptions);
    let fieldInfo: FieldInfo = {
      inputLabel: i.ariaLabel || "",
      id: i.id || "",
      name: "",
      placeholder: dropdownOptions[0] || "",
      type: i.type || null,
      header: "",
  
    };

    // get ai response
    let response = await answerField(user, fieldInfo, dropdownOptions);
    // set dropdown value to response
    console.log("result (dropdown): " + response);
      if (response.trim() != "null") (i as HTMLSelectElement).value = response.trim();
  }
}


getElements().then((data) => {
  normalFields(data);
  fileFields(data);
});

export {}
