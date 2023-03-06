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
const SIGNUP_WRONG_MESSAGE = document.querySelector(".signup-WrongMessage");
const SIGNUP_CORRECT_MESSAGE = document.querySelector(".signup-CorrectMessage");
const SIGNIN_WRONG_MESSAGE = document.querySelector(".signin-WrongMessage");
const SIGNIN_CORRECT_MESSAGE = document.querySelector(".signin-CorrectMessage");

const SIGNUP_NAME_HINT = document.querySelector(".signup-name-hint");
const SIGNUP_EMAIL_HINT = document.querySelector(".signup-email-hint");
const SIGNUP_PASSWORD_HINT = document.querySelector(".signup-password-hint");

let emailREGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
let passwordREGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

TURN_TO_SIGNIN.addEventListener("click", function () {
  SIGNUP_NAME.value = "";
  SIGNUP_EMAIL.value = "";
  SIGNUP_PASSWORD.value = "";
  SIGNUP_CONTAINER.style.display = "none";
  SIGNIN_CONTAINER.style.display = "block";
  SIGNUP_WRONG_MESSAGE.style.display = "none";
  SIGNUP_CORRECT_MESSAGE.style.display = "none";
});

TURN_TO_SIGNUP.addEventListener("click", function () {
  SIGNIN_EMAIL.value = "";
  SIGNIN_PASSWORD.value = "";
  SIGNIN_CONTAINER.style.display = "none";
  SIGNUP_CONTAINER.style.display = "block";
  SIGNIN_WRONG_MESSAGE.style.display = "none";
  SIGNIN_CORRECT_MESSAGE.style.display = "none";
});

SIGNUP_NAME.addEventListener("focus", function () {
  SIGNUP_NAME_HINT.style.display = "block";
});
SIGNUP_NAME.addEventListener("focusout", function () {
  SIGNUP_NAME_HINT.style.display = "none";
});
SIGNUP_EMAIL.addEventListener("focus", function () {
  SIGNUP_EMAIL_HINT.style.display = "block";
});
SIGNUP_EMAIL.addEventListener("focusout", function () {
  SIGNUP_EMAIL_HINT.style.display = "none";
});
SIGNUP_PASSWORD.addEventListener("focus", function () {
  SIGNUP_PASSWORD_HINT.style.display = "block";
});
SIGNUP_PASSWORD.addEventListener("focusout", function () {
  SIGNUP_PASSWORD_HINT.style.display = "none";
});

// signup

SIGNUP_BUTTON.addEventListener("click", function () {
  SIGNUP_WRONG_MESSAGE.style.display = "none";
  SIGNUP_CORRECT_MESSAGE.style.display = "none";

  if (
    SIGNUP_NAME.value == "" ||
    SIGNUP_EMAIL.value == "" ||
    SIGNUP_PASSWORD.value == ""
  ) {
    SIGNUP_WRONG_MESSAGE.style.display = "block";
    SIGNUP_WRONG_MESSAGE.innerHTML = "Please fill all blanks";
  } else if (emailREGEX.exec(SIGNUP_EMAIL.value) == null) {
    SIGNUP_WRONG_MESSAGE.style.display = "block";
    SIGNUP_WRONG_MESSAGE.innerHTML = "Wrong Email format";
  } else if (passwordREGEX.exec(SIGNUP_PASSWORD.value) == null) {
    SIGNUP_WRONG_MESSAGE.style.display = "block";
    SIGNUP_WRONG_MESSAGE.innerHTML = "Wrong Password format";
  } else {
    fetch("/insertMember", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: SIGNUP_NAME.value,
        email: SIGNUP_EMAIL.value,
        password: SIGNUP_PASSWORD.value,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.ok == true) {
          SIGNUP_CORRECT_MESSAGE.style.display = "block";
        } else {
          SIGNUP_WRONG_MESSAGE.style.display = "block";
          SIGNUP_WRONG_MESSAGE.innerHTML = "Signup failed";
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }
});

// signin

SIGNIN_BUTTON.addEventListener("click", function () {
  SIGNIN_WRONG_MESSAGE.style.display = "none";
  SIGNIN_CORRECT_MESSAGE.style.display = "none";

  if (SIGNIN_EMAIL.value == "" || SIGNIN_PASSWORD.value == "") {
    SIGNIN_WRONG_MESSAGE.style.display = "block";
    SIGNIN_WRONG_MESSAGE.innerHTML = "Please fill all blanks";
  } else if (emailREGEX.exec(SIGNIN_EMAIL.value) == null) {
    SIGNIN_WRONG_MESSAGE.style.display = "block";
    SIGNIN_WRONG_MESSAGE.innerHTML = "Wrong Email format";
  } else if (passwordREGEX.exec(SIGNIN_PASSWORD.value) == null) {
    SIGNIN_WRONG_MESSAGE.style.display = "block";
    SIGNIN_WRONG_MESSAGE.innerHTML = "Wrong Password format";
  } else {
    fetch("/signin", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: SIGNIN_EMAIL.value,
        password: SIGNIN_PASSWORD.value,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response["ok"]) {
          userName = response.name;
          SIGNIN_CORRECT_MESSAGE.style.display = "block";
          location.href = "/member";
        } else {
          SIGNIN_WRONG_MESSAGE.style.display = "block";
          SIGNIN_WRONG_MESSAGE.innerHTML = "Signin failed";
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }
});
