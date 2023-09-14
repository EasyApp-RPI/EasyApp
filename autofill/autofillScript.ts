// This file will be run on the content page, and should include all the logic for inserting text into form items.
const usernameField = document.querySelector('input[name="username"]');
const passwordField = document.querySelector('input[name="password"]');

if (usernameField) (usernameField as HTMLInputElement).value = "yourUsername";
if (passwordField) (passwordField as HTMLInputElement).value = "yourPassword";

export {}
