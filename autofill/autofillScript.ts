const usernameField = document.querySelector('input[name="username"]');
const passwordField = document.querySelector('input[name="password"]');

if (usernameField) (usernameField as HTMLInputElement).value = "yourUsername";
if (passwordField) (passwordField as HTMLInputElement).value = "yourPassword";

console.log("autofilled page!!");

export {}
