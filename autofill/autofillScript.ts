import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "langchain/schema";
import { model, answerField } from "./llm";
import $ from "jquery";
import { FieldInfo, UserInfo } from "./types";

const user: UserInfo = {
  name: "ariel ricardo montero majthenyi",
  email: "montea8@rpi.edu",
  address: "1999 Burdett Ave, Troy, NY 12180",
  phone_number: "(123) 456-78910",
  zip: "12180",
  null: "other",
};

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
  // Set up GPT-3 prompt
  let template =
    "From the following data, pick a single best response for the field: \n" +
    JSON.stringify(user);

  console.log("template: " + template);

  let messages = [new SystemMessage({ content: template })];

  messages.push(
    new HumanMessage({
      content: "Field text: Name, Field ID: name, Field name: name",
    })
  );
  messages.push(new AIMessage({ content: "Ariel" }));
  messages.push(
    new HumanMessage({
      content:
        "Field text: Street Address, Field ID: street_address, Field name: street_address",
    })
  );
  messages.push(new AIMessage({ content: "1999 Burdette Ave" }));
  messages.push(
    new HumanMessage({
      content:
        "Field text: Confirm Address, Field ID: confirm_address, Field name: confirm_address",
    })
  );
  messages.push(new AIMessage({ content: "1999 Burdette Ave" }));
  messages.push(
    new HumanMessage({
      content: "Field text: Email, Field ID: email, Field name: email",
    })
  );
  messages.push(new AIMessage({ content: "montea8@rpi.edu" }));
  messages.push(
    new HumanMessage({
      content:
        "Field text: Confirm Address, Field ID: confirm_email, Field name: confirm_email",
    })
  );
  messages.push(new AIMessage({ content: "montea8@rpi.edu" }));
  // End of GPT-3 prompt setup

  // get all divs
  let divs = document.querySelectorAll("div");

  // Placeholder message to be replaced in each loop iteration
  messages.push(new HumanMessage({ content: "placeholder" }));

  // for each div, get labels and inputs contained by the div. This is done useing jquery
  for (let i of divs) {
    // get all divs with one label and one input using jquery
    let label = $(i).find("label");
    let input = $(i).find("input");
    if (label.length == 1 && input.length == 1) {
      // give ai the information including the label text, input id, and input name.
      // This helps it be more accurate when presented with ambiguous fields
      let fieldInfo : FieldInfo = {
        inputLabel: label[0].textContent,
        name: input[0].name,
        id: input[0].id,
        placeholder: input[0].placeholder,
      };
      // get ai response
      let response = await answerField(user, fieldInfo);
      console.log("result: " + response.textContent);

      if (input[0]) (input[0] as HTMLInputElement).value = cleanUp(response.text).trim();
    }
  }
}

// Uses AI to fill in dropdown fields. Dropdown fields are similar to input fields, but instead of an input, they have
// a select element with a number of options. The options are treated similarly to an array
// This array is passed to the AI which then chooses the best response.
/*function dropdownFields() {
  // Set up GPT-3 prompt
  let template =
    "This is the users data: " +
    JSON.stringify(user) +
    "\n" +
    "Pick the best option for each dropdown.";

  let messages = [new SystemMessage({ content: template })];

  let genderOptions = ["male", "femiale", "other"];

  messages.push(new HumanMessage({ content: JSON.stringify(genderOptions) }));
  messages.push(new AIMessage({ content: "male" }));
  // End of GPT-3 prompt setup

  // Placeholder message to be replaced in each loop iteration
  messages.push(new HumanMessage({ content: "placeholder" }));

  // get dropdowns from page using jquery
  let dropdowns = $("select");
  // for each dropdown get the option value field as an array
  for (let i of dropdowns) {
    let options = $(i).find("option");

    //covert options to array. Potentially may need to be changed to a Map to account for ambiguous labeling
    let dropdownOptions: string[] = [];
    for (let j of options) {
      let option = j as HTMLOptionElement;
      dropdownOptions.push(option.value);
    }

    // give ai the dropdown options
    messages[3] = new HumanMessage({
      content: JSON.stringify(dropdownOptions),
    });

    // get ai response
    let response = answerField(user, { inputLabel: null, name: null, id: null, placeholder: null });

    // set dropdown value to response
    response.then((res: BaseMessage) => {
      if (res instanceof AIMessage) {
        if (i) (i as HTMLSelectElement).value = cleanUp(res.content).trim();
      }
    });
  }
}*/

normalFields();
//dropdownFields();

export {}
