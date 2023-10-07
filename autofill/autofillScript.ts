
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { chatModel } from "./llm";
const $ = require('jquery');

const user = {
    name: "samir sam beall",
    email: "samir.beall@gmail.com",
    address: "1999 Burdett Ave, Troy, NY 12180",
    phone_number: "(123) 456-78910",
    zip: "12180",
    null: "other"
};

function cleanUp(input: string): string{
    while (input[0] != ':'){
        input = input.slice(1);
    }
    input = input.slice(1);
    return input;
}

function normalFields(){
    
    let template = 'From the following data, pick a single best response for the field: \n' + JSON.stringify(user)
    
    console.log("template: " + template);
    
    let messages = [new SystemMessage({ content: template })];
    
    messages.push(new HumanMessage({content: "Field text: Name, Field ID: name, Field name: name"}));
    messages.push(new AIMessage({content: "Samir"}));
    messages.push(new HumanMessage({content: "Field text: Street Address, Field ID: street_address, Field name: street_address"}));
    messages.push(new AIMessage({content: "1999 Burdette Ave"}));
    messages.push(new HumanMessage({content: "Field text: Confirm Address, Field ID: confirm_address, Field name: confirm_address"}));
    messages.push(new AIMessage({content: "1999 Burdette Ave"}));
    messages.push(new HumanMessage({content: "Field text: Email, Field ID: email, Field name: email"}));
    messages.push(new AIMessage({content: "samir.beall@gmail.com"}));
    messages.push(new HumanMessage({content: "Field text: Confirm Address, Field ID: confirm_email, Field name: confirm_email"}));
    messages.push(new AIMessage({content: "samir.beall@gmail.com"}));
    
    let divs = document.querySelectorAll('div');
    
    console.log("divs found: " + divs.length);

    messages.push(new HumanMessage({content: "placeholder"}));
    
    for (let i of divs){
        // get all divs with one label and one input using jquery
        let label = $(i).find('label');
        let input = $(i).find('input');
        if(label.length == 1 && input.length == 1){
           // if (input[0]) (input[0] as HTMLInputElement).value = label[0].textContent;
            // give ai the label
            let label_text = "Field Text: " + label[0].textContent + ", Field ID: " + input[0].id + ", Field Name: " + input[0].name;
            messages[11] = (new HumanMessage({content: label_text}));
            // get ai response
            let response = chatModel.predictMessages(messages);
            // set input value to response
            response.then((res: BaseMessage) => {
                if (res instanceof AIMessage){
                    console.log("label: " + label_text + " input: " + cleanUp(res.content));
                    if (input[0]) (input[0] as HTMLInputElement).value = cleanUp(res.content).trim();
                }
            })
        }
    }
    console.log(JSON.stringify(messages));

}

function dropdownFields(){

    let template = 'This is the users data: ' + JSON.stringify(user) + '\n' + 'Pick the best option for each dropdown.';

    let messages = [new SystemMessage({ content: template })];

    let genderOptions = ["male", "femiale", "other"];

    messages.push(new HumanMessage({content: JSON.stringify(genderOptions)}));
    messages.push(new AIMessage({content: "male"}));

    messages.push(new HumanMessage({content: "placeholder"}));

    // get dropdowns from page using jquery
    let dropdowns = $('select');
    // for each dropdown get the option value field as an array
    for (let i of dropdowns){
        let options = $(i).find('option');

        let dropdownOptions = [];
        for (let j of options){
            let option = j as HTMLOptionElement;
            dropdownOptions.push(option.value);
        }
        // give ai the dropdown options
        messages[3] = (new HumanMessage({content: JSON.stringify(dropdownOptions)}));
        // get ai response
        let response = chatModel.predictMessages(messages);
        // set dropdown value to response
        response.then((res: BaseMessage) => {
            if (res instanceof AIMessage){
                if (i) (i as HTMLSelectElement).value = cleanUp(res.content).trim();
            }
        })
    }
}

normalFields();
dropdownFields();

export {}