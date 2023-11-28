import {
  answerCheckbox,
  answerDate,
  answerDropdown,
  answerField,
  answerFile,
  fieldType,
} from './llm';
import { FieldInfo, UserInfo, FilePaths, inputElements } from './types';

let dates: inputElements[] = [];
console.log("autofilling");
async function simulateUserInput(
  inputElement: HTMLInputElement | HTMLSelectElement,
  value: string,
  i = 0,
) {
  // Set the value of the input field

  inputElement.value = value;

  let eventType: string = '';
  if (inputElement instanceof HTMLSelectElement) {
    eventType = 'change';
  } else if (inputElement instanceof HTMLInputElement) {
    eventType = 'input';
  }
  // Create a new event for the 'input' event type
  const event = new Event(eventType, {
    // change the drop down value
  });

  // Dispatch the 'input' event
  inputElement.dispatchEvent(event);
}

// Helper function to load all data from chrome storage
export const loadAllFormData = async () => {
  console.log("loading data");
  // Create an object to hold the form data
  let formDataObject: any = {};

  // Promise to handle asynchronous storage access
  let promise = new Promise((resolve, reject) => {
    // Retrieve all keys at once
    chrome.storage.sync.get(null, function (items) {
      if (chrome.runtime.lastError) {
        // Handle errors here
        reject(chrome.runtime.lastError);
      }
      // Loop through all items in storage
      for (const [key, value] of Object.entries(items)) {
        // Add each item to formDataObject
        formDataObject[key] = value;
      }
      resolve(formDataObject);
    });
  });

  // Wait for the promise to resolve with the form data object
  try {
    return await promise;
  } catch (error) {
    console.error('Failed to load form data from storage:', error);
    return {}; // Return an empty object in case of error
  }
};

/*// A simple function to clean up the response from the AI. The AI will often return a string containing "AI: " at the beginning
function cleanUp(input: string): string {
  while (input[0] != ':') {
    input = input.slice(1);
  }
  input = input.slice(1);
  return input;
}*/

function callCorrect(input: inputElements) {
  /*if (input.type == "file") {
    fileFields(input)
  }*/
  if (input.type == 'text' || input.type == 'email' || input.type == 'tel') {
    normalFields(input);
  }
  if (input.type == 'date') {
    dates.push(input);
  }
  if (input.type == 'checkbox') {
    checkboxes(input);
    //normalFields(input)
  }
}

async function getElements() {
  let data: inputElements[] = [];
  let inputs: HTMLInputElement[] = [];
  let stack: Element[] = [document.body]; // Use a stack for DFS
  let isLabelFound = false;
  let visited: Set<Element> = new Set();
  let currentLabel: HTMLLabelElement | null = null;
  let currHeader: string = '';

  // go through html using DFS
  while (stack.length > 0) {
    let current = stack.pop(); // Pop a node from the stack

    if (current instanceof HTMLHeadingElement) {
      currHeader = current.textContent || '';
    }

    if (!current || visited.has(current)) continue;
    visited.add(current);

    if (current instanceof HTMLLabelElement) {
      if (isLabelFound && currentLabel && inputs.length > 0) {
        let prev;
        if (data.length > 1)
          prev = data[data.length - 1].label.textContent || '';
        else prev = '';
        //let type = await fieldType(fieldInfo);
        data.push({
          label: currentLabel,
          inputs: inputs,
          type: inputs[0].type,
          header: currHeader,
        });
        callCorrect(data[data.length - 1]);
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
    let fieldInfo: FieldInfo = {
      inputLabel: currentLabel.textContent || '',
      name: inputs[0].name || '',
      id: inputs[0].id || '',
      placeholder: inputs[0].placeholder || '',
      type: inputs[0].type || null,
      header: currHeader,
    };

    let prev;
    if (data.length > 1) prev = data[data.length - 1].label.textContent || '';
    else prev = '';

    let type = await fieldType(fieldInfo);

    data.push({
      label: currentLabel,
      inputs: inputs,
      type: type,
      header: currHeader,
    });
  }

  for (let i of data) {
    //console.log("Label: \n" + i.label.textContent);
    //console.log("Inputs:" + i.inputs.length);
    //console.log("Type: " + i.type);
  }

  return data;
}

async function checkboxes(input: inputElements) {
  const user = (await loadAllFormData()) as UserInfo;
  let response = await answerCheckbox(user, input);
  console.log(response);
  if (response == 'checked') {
    input.inputs[0].checked = true;
  }
}

// Uses AI to fill in standard text fields.
// Standard text fields assume that both the input field and label are wrapped exclusively in a div.
async function normalFields(data: inputElements) {
  const user = (await loadAllFormData()) as UserInfo;
  // for each input element get the label and input
  let j = 0;
  for (let i of data.inputs) {
    /*let fieldInfo: FieldInfo = {
      inputLabel: data.label.textContent || "",
      name: data.inputs[0].name + j.toString || "",
      id: data.inputs[0].id || "",
      placeholder: data.inputs[0].placeholder || "",
      type: data.inputs[0].type || null,
      header: data.header,
    };*/

    // get ai response
    let response = await answerField(user, data);
    console.log(response);
    // set input value to response
    //console.log("result (normal): " + response);
    if (response.trim() != 'null') {
      // if field is not hidden, set the value
      if (data.inputs[0].type != 'hidden') {
        simulateUserInput(data.inputs[0], response.trim());
      }
    }
    j++;
  }
}

/*async function fileFields(data: inputElements) {
  // get all inputElemets with a type of file
  for (let i of data.inputs) {
    let fieldInfo: FieldInfo = {
      inputLabel: data.label.textContent || "",
      name: data.inputs[0].name || "",
      id: data.inputs[0].id || "",
      placeholder: data.inputs[0].placeholder || "",
      type: data.inputs[0].type || null,
      header: data.header,
    };
   let file = await answerFile(files, fieldInfo);
   if (file == "null") continue;

   // get text after last '\\' in file path. This is the file name
   let fileName = file.split("\\").pop();
   // create a file object with the file name
   const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
   dataTransfer.items.add(new File(["file"], fileName || ""));
   // set input files to the file object, then clear the data transfer and continue to next field
   i.files = dataTransfer.files;
   dataTransfer.items.clear();
  }
}*/

// Uses AI to fill in dropdown fields. Dropdown fields are similar to input fields, but instead of an input, they have
// a select element with a number of options. The options are treated similarly to an array
// This array is passed to the AI which then chooses the best response.
async function dropdownFields() {
  const user = (await loadAllFormData()) as UserInfo;
  //wait for 3 seconds
  await new Promise((r) => setTimeout(r, 5000));
  // get dropdowns from page using jquery
  let dropdowns = document.querySelectorAll('select');
  // for each dropdown get the option value field as an array
  for (let i of dropdowns) {
    let options = i.querySelectorAll('option');

    //covert options to array. Potentially may need to be changed to a Map to account for ambiguous labeling
    let dropdownOptions: string[] = [];
    for (let j of options) {
      let option = j as HTMLOptionElement;
      dropdownOptions.push(option.value);
    }
    //console.log(dropdownOptions);
    // get ai response
    let response = await answerDropdown(user, dropdownOptions);
    // set dropdown value to response
    console.log('result (dropdown): ' + response);
    if (response.trim() != 'null') simulateUserInput(i, response.trim());
  }
}

function answerDates() {
  for (let i of dates) {
    let result = answerDate(i);
    result.then((res) => {
      console.log(res);
      i.inputs[0].value = res.trim();
      dates.shift();
    });
  }
}

let data = getElements().then((res) => {
  //answerDates();
  console.log(dates);
  for (let i of res) {
    console.log(
      'Label: \n' + i.label.textContent,
      'Inputs:' + i.inputs.length,
      'Type: ' + i.type,
    );
  }
});
dropdownFields();

export {};
