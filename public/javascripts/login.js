const LOGIN_CONTAINER = document.querySelector(".login-container");
const LOGIN_EMAIL_INPUT = document.querySelector(".login-email-input");
const LOGIN_PASSWORD_INPUT = document.querySelector(".login-password-input");
const LOGIN_BUTTON = document.querySelector(".login-button");
const LOGIN_WRONG_MESSAGE = document.querySelector(".login-WrongMessage");
const LOGIN_CORRECT_MESSAGE = document.querySelector(".login-CorrectMessage");

const REGISTER_CONTAINER = document.querySelector(".register-container");
const REGISTER_NAME_INPUT = document.querySelector(".register-name-input");
const REGISTER_EMAIL_INPUT = document.querySelector(".register-email-input");
const REGISTER_PASSWORD_INPUT = document.querySelector(
  ".register-password-input"
);
const REGISTER_BUTTON = document.querySelector(".register-button");
const REGISTER_WRONG_MESSAGE = document.querySelector(".register-WrongMessage");
const REGISTER_CORRECT_MESSAGE = document.querySelector(
  ".register-CorrectMessage"
);

const TURN_TO_LOGIN = document.querySelector(".turnToLogin");
const TURN_TO_REGISTER = document.querySelector(".turnToRegister");

let emailREGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
let passwordREGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

// Default login information

LOGIN_EMAIL_INPUT.value = "test@test.com";
LOGIN_PASSWORD_INPUT.value = "Test1234";

TURN_TO_LOGIN.addEventListener("click", function () {
  REGISTER_NAME_INPUT.value = "";
  REGISTER_EMAIL_INPUT.value = "";
  REGISTER_PASSWORD_INPUT.value = "";
  REGISTER_CONTAINER.style.display = "none";
  LOGIN_CONTAINER.style.display = "block";
  REGISTER_WRONG_MESSAGE.style.display = "none";
  REGISTER_CORRECT_MESSAGE.style.display = "none";
});

TURN_TO_REGISTER.addEventListener("click", function () {
  LOGIN_EMAIL_INPUT.value = "";
  LOGIN_PASSWORD_INPUT.value = "";
  LOGIN_CONTAINER.style.display = "none";
  REGISTER_CONTAINER.style.display = "block";
  LOGIN_WRONG_MESSAGE.style.display = "none";
  LOGIN_CORRECT_MESSAGE.style.display = "none";
});

// Register

REGISTER_BUTTON.addEventListener("click", function () {
  REGISTER_WRONG_MESSAGE.style.display = "none";
  REGISTER_CORRECT_MESSAGE.style.display = "none";

  if (
    REGISTER_NAME_INPUT.value == "" ||
    REGISTER_EMAIL_INPUT.value == "" ||
    REGISTER_PASSWORD_INPUT.value == ""
  ) {
    REGISTER_WRONG_MESSAGE.style.display = "block";
    REGISTER_WRONG_MESSAGE.innerHTML = "Please fill all blanks";
  } else if (emailREGEX.exec(REGISTER_EMAIL_INPUT.value) == null) {
    REGISTER_WRONG_MESSAGE.style.display = "block";
    REGISTER_WRONG_MESSAGE.innerHTML = "Wrong Email format";
  } else if (passwordREGEX.exec(REGISTER_PASSWORD_INPUT.value) == null) {
    REGISTER_WRONG_MESSAGE.style.display = "block";
    REGISTER_WRONG_MESSAGE.innerHTML = "Wrong Password format";
  } else {
    fetch("/insertMember", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: REGISTER_NAME_INPUT.value,
        email: REGISTER_EMAIL_INPUT.value,
        password: REGISTER_PASSWORD_INPUT.value,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.ok == true) {
          REGISTER_CORRECT_MESSAGE.style.display = "block";
        } else {
          REGISTER_WRONG_MESSAGE.style.display = "block";
          REGISTER_WRONG_MESSAGE.innerHTML = "Register failed";
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }
});

// Login

LOGIN_BUTTON.addEventListener("click", function () {
  LOGIN_WRONG_MESSAGE.style.display = "none";
  LOGIN_CORRECT_MESSAGE.style.display = "none";

  if (LOGIN_EMAIL_INPUT.value == "" || LOGIN_PASSWORD_INPUT.value == "") {
    LOGIN_WRONG_MESSAGE.style.display = "block";
    LOGIN_WRONG_MESSAGE.innerHTML = "Please fill all blanks";
  } else if (emailREGEX.exec(LOGIN_EMAIL_INPUT.value) == null) {
    LOGIN_WRONG_MESSAGE.style.display = "block";
    LOGIN_WRONG_MESSAGE.innerHTML = "Wrong Email format";
  } else if (passwordREGEX.exec(LOGIN_PASSWORD_INPUT.value) == null) {
    LOGIN_WRONG_MESSAGE.style.display = "block";
    LOGIN_WRONG_MESSAGE.innerHTML = "Wrong Password format";
  } else {
    fetch("/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: LOGIN_EMAIL_INPUT.value,
        password: LOGIN_PASSWORD_INPUT.value,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response["ok"]) {
          userName = response.name;
          LOGIN_CORRECT_MESSAGE.style.display = "block";
          location.href = "/shared-calendar";
        } else {
          LOGIN_WRONG_MESSAGE.style.display = "block";
          LOGIN_WRONG_MESSAGE.innerHTML = "Login failed";
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }
});
