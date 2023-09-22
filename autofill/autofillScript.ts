// This file will be run on the content page, and should include all the logic for inserting text into form items.
const firstNameField = document.querySelector('input[name="First Name"]');
const lastNameField = document.querySelector('input[name="Last Name"]');

// Gets all input fields that contain keyword "email"
const emailField = document.querySelectorAll('input[id*="email"]');

//Figure out how to do a phone number field
if (firstNameField) (firstNameField as HTMLInputElement).value = "yourFirstName";
if (lastNameField) (lastNameField as HTMLInputElement).value = "yourLastName";

// Sets all email fields to "yourEmail" as long as field ID contains "email"
for (let i = 0; i < emailField.length; i++)
    if (emailField[i]) (emailField[i] as HTMLInputElement).value = "yourEmail";
//Figure out how to do a phone number field

// Trigger agree to terms and conditions. Tested on "https://store.steampowered.com/join" but should work on any site with a checkbox with the word "agree" in the name. Proof of concept for checkboxes
const agreeToTerms = document.querySelector('input[name*="agree"]');
if (agreeToTerms) (agreeToTerms as HTMLInputElement).checked = true;

// Dropdown test. Sets to Albania on "https://www.globalsqa.com/demo-site/select-dropdown-menu/" proof of concept for dropdowns
const dropdown = document.querySelector('select');;
if (dropdown) (dropdown as HTMLSelectElement).value = "ALB";

export {}
