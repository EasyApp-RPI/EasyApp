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


// This file will be run on the content page, and should include all the logic for inserting text into form items.
const firstNameField = document.querySelector('input[name="First Name"]');
const lastNameField = document.querySelector('input[name="Last Name"]');

// Gets all input fields that contain keyword "email"
const emailField = document.querySelectorAll('input[id*="email"]');

if (firstNameField) (firstNameField as HTMLInputElement).value = "yourFirstName";
if (lastNameField) (lastNameField as HTMLInputElement).value = "yourLastName";

// Sets all email fields to "yourEmail" as long as field ID contains "email"
/*for (let i = 0; i < emailField.length; i++)
    if (emailField[i]) (emailField[i] as HTMLInputElement).value = "yourEmail";
    */

// Trigger agree to terms and conditions. Tested on "https://store.steampowered.com/join" but should work on any site with a checkbox with the word "agree" in the name. Proof of concept for checkboxes
const agreeToTerms = document.querySelector('input[name*="agree"]');
if (agreeToTerms) (agreeToTerms as HTMLInputElement).checked = true;

// Dropdown test. Sets to Albania on "https://www.globalsqa.com/demo-site/select-dropdown-menu/" proof of concept for dropdowns
const dropdown = document.querySelector('select');;
if (dropdown) (dropdown as HTMLSelectElement).value = "ALB";



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
