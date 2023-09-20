// This file will be run on the content page, and should include all the logic for inserting text into form items.
const firstNameField = document.querySelector('input[name="First Name"]');
const lastNameField = document.querySelector('input[name="Last Name"]');
const emailField = document.querySelector('input[name="Email"]');
//Figure out how to do a phone number field

if (firstNameField) (firstNameField as HTMLInputElement).value = "yourFirstName";
if (lastNameField) (lastNameField as HTMLInputElement).value = "yourLastName";
if (emailField) (emailField as HTMLInputElement).value = "yourEmail";
//Figure out how to do a phone number field

export {}
