const SIGNUP_CONTAINER = document.querySelector(".signup-container");
const SIGNIN_CONTAINER = document.querySelector(".signin-container");
const TURN_TO_SIGNIN = document.querySelector(".turnToSignIn");
const TURN_TO_SIGNUP = document.querySelector(".turnToSignUp");
const SIGNIN_EMAIL = document.querySelector(".signin-email");
const SIGNIN_PASSWORD = document.querySelector(".signin-password");
const SIGNUP_NAME = document.querySelector(".signup-name");
const SIGNUP_EMAIL = document.querySelector(".signup-email");
const SIGNUP_PASSWORD = document.querySelector(".signup-password");
const SIGNUP_BUTTON = document.querySelector(".signup-button");
const SIGNIN_BUTTON = document.querySelector(".signin-button");

TURN_TO_SIGNIN.addEventListener("click", function () {
  SIGNUP_NAME.value = "";
  SIGNUP_EMAIL.value = "";
  SIGNUP_PASSWORD.value = "";
  SIGNUP_CONTAINER.style.display = "none";
  SIGNIN_CONTAINER.style.display = "block";
});

TURN_TO_SIGNUP.addEventListener("click", function () {
  SIGNIN_EMAIL.value = "";
  SIGNIN_PASSWORD.value = "";
  SIGNIN_CONTAINER.style.display = "none";
  SIGNUP_CONTAINER.style.display = "block";
});
