const ACCOUNT_ICON = document.querySelector(".account-icon");
const ACCOUNT_CONTAINER = document.querySelector(".account-container");
const ACCOUNT_CLOSE = document.querySelector(".account-close");
const ACCOUNT_EDIT_BUTTON = document.querySelector(".account-edit-button");
const ACCOUNT_LOG_OUT_BUTTON = document.querySelector(
  ".account-log-out-button"
);
const ACCOUNT_FINISH_BUTTON = document.querySelector(".account-finish-button");
const ACCOUNT_EDIT_NAME = document.querySelector(".account-edit-name");
const ACCOUNT_FILE_UPLOADER = document.querySelector("#file-uploader");
const ACCOUNT_WRONG_Message = document.querySelector(".account-wrongMessage");
const ACCOUNT_CORRECT_Message = document.querySelector(
  ".account-correctMessage"
);
ACCOUNT_NAME.innerHTML = userName;

ACCOUNT_ICON.addEventListener("click", function () {
  ACCOUNT_CONTAINER.style.display = "block";
  OVERLAY.style.display = "block";
});

ACCOUNT_CLOSE.addEventListener("click", function () {
  ACCOUNT_CONTAINER.style.display = "none";
  OVERLAY.style.display = "none";
  ACCOUNT_FILE_UPLOADER.style.display = "none";
  ACCOUNT_EDIT_NAME.style.display = "none";
  ACCOUNT_FINISH_BUTTON.style.display = "none";
  ACCOUNT_EDIT_BUTTON.style.display = "block";
  ACCOUNT_LOG_OUT_BUTTON.style.display = "block";
  ACCOUNT_NAME.style.display = "flex";
  ACCOUNT_EMAIL.style.display = "flex";
  ACCOUNT_CORRECT_Message.style.display = "none";
  ACCOUNT_WRONG_Message.style.display = "none";
});

ACCOUNT_EDIT_BUTTON.addEventListener("click", function () {
  ACCOUNT_FILE_UPLOADER.style.display = "block";
  ACCOUNT_EDIT_NAME.style.display = "block";
  ACCOUNT_FINISH_BUTTON.style.display = "block";
  ACCOUNT_WRONG_Message.style.display = "none";
  ACCOUNT_CORRECT_Message.style.display = "none";
  ACCOUNT_NAME.style.display = "none";
  ACCOUNT_EMAIL.style.display = "flex";
  ACCOUNT_EDIT_BUTTON.style.display = "none";
  ACCOUNT_LOG_OUT_BUTTON.style.display = "none";
  ACCOUNT_EDIT_NAME.value = ACCOUNT_NAME.innerHTML;
  ACCOUNT_EDIT_NAME.focus();
});

ACCOUNT_FINISH_BUTTON.addEventListener("click", async function () {
  ACCOUNT_WRONG_Message.style.display = "none";
  ACCOUNT_CORRECT_Message.style.display = "none";

  let name = ACCOUNT_EDIT_NAME.value;
  if (name == "") {
    ACCOUNT_WRONG_Message.innerHTML = "Please fill the blank";
    ACCOUNT_WRONG_Message.style.display = "block";
  } else if (name == userName) {
    ACCOUNT_EDIT_NAME.style.display = "none";
    ACCOUNT_FILE_UPLOADER.style.display = "none";
    ACCOUNT_FINISH_BUTTON.style.display = "none";
    ACCOUNT_WRONG_Message.style.display = "none";
    ACCOUNT_CORRECT_Message.style.display = "none";
    ACCOUNT_NAME.style.display = "flex";
    ACCOUNT_EMAIL.style.display = "flex";
    ACCOUNT_EDIT_BUTTON.style.display = "block";
    ACCOUNT_LOG_OUT_BUTTON.style.display = "block";
  } else {
    fetch("/updateMember", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: name,
        userName: userName,
        email: userEmail,
      }),
    })
      .then((response) => {
        ACCOUNT_CORRECT_Message.style.display = "block";
        ACCOUNT_CORRECT_Message.innerHTML = "Update successfully";
        ACCOUNT_NAME.innerHTML = name;
        userName = name;

        ACCOUNT_EDIT_NAME.style.display = "none";
        ACCOUNT_FILE_UPLOADER.style.display = "none";
        ACCOUNT_FINISH_BUTTON.style.display = "none";
        ACCOUNT_WRONG_Message.style.display = "none";
        ACCOUNT_NAME.style.display = "flex";
        ACCOUNT_EMAIL.style.display = "flex";
        ACCOUNT_EDIT_BUTTON.style.display = "block";
        ACCOUNT_LOG_OUT_BUTTON.style.display = "block";

        // 刪除cookie
        fetch("/logout", { method: "GET" });
      })
      .catch((err) => {
        // handle error
        console.error(err);
      });
  }
});

ACCOUNT_LOG_OUT_BUTTON.addEventListener("click", async function () {
  fetch("/logout", { method: "GET" })
    .then(() => {
      location.href = "/";
    })
    .catch((err) => {
      console.error(err);
    });
});
