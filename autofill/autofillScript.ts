import { AIMessage, ChatMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { chatModel } from "./llm";
const user = {
  name: "samir s beall",
  email: "samir.beall@gmail.com",
  address: "1999 Burdett Ave, Troy, NY 12180",
  phone_number: "(123) 456-78910",
};

async function main (){

  let template_text = "You are a helpful assistant that uses the given information to answer simple fields for a form. \
    When prompted with a message, simply respond with the relevant information concisely. Here is all the information formatted in a json format that you can respond with: ";

  template_text += JSON.stringify(user)

  console.log(template_text);

  let messages = [new SystemMessage({ content: template_text })];

  messages.push(new HumanMessage({content: "First Name"}));
  messages.push(new AIMessage({content: "Samir"}));

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

  for (const qf of questionsAndFields){

    console.log("querying chat")
    messages.push(new HumanMessage({content: qf.question}))

    let chatModelResult = await chatModel.predictMessages(messages);
    messages.push(chatModelResult);

    console.log("chat result: ")
    console.log(chatModelResult);
    

    qf.field.value = chatModelResult.content;
  }

  console.log(messages);
}

main();

export {}
