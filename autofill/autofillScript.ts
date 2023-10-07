
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

function normalFields(){
    
    let template = 'From the following data, pick a single best response for the field: \n' + JSON.stringify(user)
    
    console.log("template: " + template);
    
    let messages = [new SystemMessage({ content: template })];
    
    messages.push(new HumanMessage({content: "First Name"}));
    messages.push(new AIMessage({content: "Samir"}));
    messages.push(new HumanMessage({content: "Street Address"}));
    messages.push(new AIMessage({content: "1999 Burdette Ave"}));
    messages.push(new HumanMessage({content: "Middle Name"}));
    messages.push(new AIMessage({content: "Sam"}));
    
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
            let label_text = label[0].textContent;
            console.log("label: " + label_text);
            messages[7] = (new HumanMessage({content: label_text}));
            // get ai response
            let response = chatModel.predictMessages(messages);
            // set input value to response
            response.then((res: BaseMessage) => {
                if (res instanceof AIMessage){
                    console.log("\tAI response: " + res.content);
                    if (input[0]) (input[0] as HTMLInputElement).value = res.content;
                }
            })
        }
    }
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
    console.log("dropdowns: " + dropdowns.length);
    // for each dropdown get the options as an array
    for (let i of dropdowns){
        let options = $(i).find('option');
        console.log("options: " + options.length);

        let dropdownOptions = [];
        for (let j of options){
            let option = j as HTMLOptionElement;
            dropdownOptions.push(option.text);
        }
        // give ai the dropdown options
        messages[3] = (new HumanMessage({content: JSON.stringify(dropdownOptions)}));
        // get ai response
        let response = chatModel.predictMessages(messages);
        // set dropdown value to response
        response.then((res: BaseMessage) => {
            if (res instanceof AIMessage){
                console.log("AI response: " + res.content);
                if (i) (i as HTMLSelectElement).value = res.content.trim();
            }
        })
    }
}

normalFields();
//dropdownFields();

export {}