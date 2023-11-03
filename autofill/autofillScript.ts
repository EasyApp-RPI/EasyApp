import { answerField, answerFile } from "./llm";
import { FieldInfo, UserInfo, FilePaths } from "./types";

// Helper function to load all data from chrome storage
const loadAllFormData = async () => {
  // Create an object to hold the form data
  let formDataObject: any = {};

  // Promise to handle asynchronous storage access
  let promise = new Promise((resolve, reject) => {
    // Retrieve all keys at once
    chrome.storage.sync.get(null, function(items) {
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

// const user: UserInfo = {
//   firstName: "Samir",
//   lastName: "Beall",
//   email: "montea8@rpi.edu",
//   address: "1999 Burdett Ave, Troy, NY 12180",
//   phoneNumber: "(123) 456-78910",
//   zip: "12180",
//   null: "other",
// };
const files: FilePaths = {
  resumePath: "C:\\Users\\lordo\\Downloads\\Ariels Resume-1.pdf",
  transcriptPath: "C:\\Users\\lordo\\Downloads\\Academic Transcript.pdf",
  coverLetterPath: "null",
}

// A simple function to clean up the response from the AI. The AI will often return a string containing "AI: " at the beginning
function cleanUp(input: string): string {
  while (input[0] != ":") {
    input = input.slice(1);
  }
  input = input.slice(1);
  return input;
}

// Uses AI to fill in standard text fields.
// Standard text fields assume that both the input field and label are wrapped exclusively in a div.
async function normalFields() {



// Example usage:
loadAllFormData().then(formData => {
  console.log('Loaded form data:', formData);
});

  
  const user = await loadAllFormData() as UserInfo;
  // get all divs
  let divs = document.querySelectorAll("div");

  // for each div, get labels and inputs contained by the div
  for (let i of divs) {
    // get all divs with one label and one input
    let label = i.querySelectorAll("label");
    let input = i.querySelectorAll("input");
    if (label.length == 1 && input.length == 1) {
      // give ai the information including the label text, input id, and input name.
      // This helps it be more accurate when presented with ambiguous fields
      let fieldInfo : FieldInfo = {
        inputLabel: label[0].textContent || "",
        name: input[0].name || "",
        id: input[0].id || "",
        placeholder: input[0].placeholder || "",
      };

      // if the input is a file input, use the answerFile function
      if(input[0].type == "file") {

        // get AI response for file path
        let file = await answerFile(files, fieldInfo);
        console.log("result (file): " + file);
        // if there is no file to upload, continue to next field
        if (file == "null") continue;

        // get text after last '\\' in file path. This is the file name
        let fileName = file.split("\\").pop();
        // create a file object with the file name
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
        dataTransfer.items.add(new File(["file"], fileName || ""));
        // set input files to the file object, then clear the data transfer and continue to next field
        input[0].files = dataTransfer.files;
        dataTransfer.items.clear();
        continue;
      }

      // get ai response
      let response = await answerField(user, fieldInfo);
      console.log("result: " + response);
      if (input[0] && response.trim() != "null") (input[0] as HTMLInputElement).value = response;
    }
  }
}

// Uses AI to fill in dropdown fields. Dropdown fields are similar to input fields, but instead of an input, they have
// a select element with a number of options. The options are treated similarly to an array
// This array is passed to the AI which then chooses the best response.
async function dropdownFields() {

  const user = await loadAllFormData() as UserInfo;
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
  
    };

    // get ai response
    let response = await answerField(user, fieldInfo, dropdownOptions);
    // set dropdown value to response
    console.log("result (dropdown): " + response);
      if (response.trim() != "null") (i as HTMLSelectElement).value = response.trim();
  }
}

normalFields();
dropdownFields();

export {};
