const ACCOUNT_CONTAINER = document.querySelector(".account-container");
const ACCOUNT_CLOSE = document.querySelector(".account-close");
const ACCOUNT_EDIT_NAME_BUTTON = document.querySelector(
  ".account-edit-name-button"
);
const ACCOUNT_EDIT_PHOTO_BUTTON = document.querySelector(
  ".account-edit-photo-button"
);
const ACCOUNT_LOG_OUT_BUTTON = document.querySelector(
  ".account-log-out-button"
);
const ACCOUNT_FINISH_NAME_BUTTON = document.querySelector(
  ".account-finish-name-button"
);
const ACCOUNT_FINISH_PHOTO_BUTTON = document.querySelector(
  ".account-finish-photo-button"
);
const ACCOUNT_EDIT_NAME = document.querySelector(".account-edit-name");
const ACCOUNT_FILE_UPLOADER = document.querySelector("#file-uploader");
const ACCOUNT_WRONG_Message = document.querySelector(".account-wrongMessage");
const ACCOUNT_CORRECT_Message = document.querySelector(
  ".account-correctMessage"
);
ACCOUNT_NAME.innerHTML = userName;

USER_PHOTO_CONTAINER.addEventListener("click", function () {
  ACCOUNT_CONTAINER.style.display = "block";
  OVERLAY.style.display = "block";
});

ACCOUNT_CLOSE.addEventListener("click", function () {
  ACCOUNT_WRONG_Message.style.display = "none";
  ACCOUNT_CORRECT_Message.style.display = "none";
  ACCOUNT_CONTAINER.style.display = "none";
  OVERLAY.style.display = "none";
  ACCOUNT_FILE_UPLOADER.style.display = "none";
  ACCOUNT_EDIT_NAME.style.display = "none";
  ACCOUNT_FINISH_NAME_BUTTON.style.display = "none";
  ACCOUNT_FINISH_PHOTO_BUTTON.style.display = "none";
  ACCOUNT_EDIT_NAME_BUTTON.style.display = "block";
  ACCOUNT_EDIT_PHOTO_BUTTON.style.display = "block";
  ACCOUNT_LOG_OUT_BUTTON.style.display = "block";
  ACCOUNT_NAME.style.display = "flex";
  ACCOUNT_EMAIL.style.display = "flex";
});

ACCOUNT_EDIT_NAME_BUTTON.addEventListener("click", function () {
  ACCOUNT_WRONG_Message.style.display = "none";
  ACCOUNT_CORRECT_Message.style.display = "none";
  ACCOUNT_FILE_UPLOADER.style.display = "none";
  ACCOUNT_EDIT_NAME.style.display = "block";
  ACCOUNT_FINISH_NAME_BUTTON.style.display = "block";
  ACCOUNT_FINISH_PHOTO_BUTTON.style.display = "none";
  ACCOUNT_WRONG_Message.style.display = "none";
  ACCOUNT_CORRECT_Message.style.display = "none";
  ACCOUNT_NAME.style.display = "none";
  ACCOUNT_EMAIL.style.display = "flex";
  ACCOUNT_EDIT_NAME_BUTTON.style.display = "none";
  ACCOUNT_EDIT_PHOTO_BUTTON.style.display = "none";
  ACCOUNT_LOG_OUT_BUTTON.style.display = "none";
  ACCOUNT_EDIT_NAME.value = ACCOUNT_NAME.innerHTML;
  ACCOUNT_EDIT_NAME.focus();
});

ACCOUNT_EDIT_PHOTO_BUTTON.addEventListener("click", function () {
  ACCOUNT_WRONG_Message.style.display = "none";
  ACCOUNT_CORRECT_Message.style.display = "none";
  ACCOUNT_FILE_UPLOADER.style.display = "block";
  ACCOUNT_FINISH_PHOTO_BUTTON.style.display = "block";
  ACCOUNT_NAME.style.display = "none";
  ACCOUNT_EDIT_NAME_BUTTON.style.display = "none";
  ACCOUNT_EDIT_PHOTO_BUTTON.style.display = "none";
  ACCOUNT_LOG_OUT_BUTTON.style.display = "none";
});

ACCOUNT_FINISH_NAME_BUTTON.addEventListener("click", async function () {
  let name = ACCOUNT_EDIT_NAME.value;
  if (name == "") {
    ACCOUNT_WRONG_Message.innerHTML = "Please fill the blank";
    ACCOUNT_WRONG_Message.style.display = "block";
  } else if (name == userName) {
    ACCOUNT_EDIT_NAME.style.display = "none";
    ACCOUNT_NAME.style.display = "flex";
    ACCOUNT_EDIT_NAME_BUTTON.style.display = "block";
    ACCOUNT_EDIT_PHOTO_BUTTON.style.display = "block";
    ACCOUNT_FINISH_NAME_BUTTON.style.display = "none";
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
        ACCOUNT_WRONG_Message.style.display = "none";
        ACCOUNT_NAME.style.display = "flex";
        ACCOUNT_EMAIL.style.display = "flex";
        ACCOUNT_EDIT_NAME_BUTTON.style.display = "block";
        ACCOUNT_EDIT_PHOTO_BUTTON.style.display = "block";
        ACCOUNT_FINISH_NAME_BUTTON.style.display = "none";
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

ACCOUNT_FINISH_PHOTO_BUTTON.addEventListener("click", async function () {
  ACCOUNT_WRONG_Message.style.display = "none";
  ACCOUNT_CORRECT_Message.style.display = "none";
  ACCOUNT_FINISH_PHOTO_BUTTON.style.display = "none";
  ACCOUNT_NAME.style.display = "flex";
  ACCOUNT_EDIT_NAME_BUTTON.style.display = "block";
  ACCOUNT_EDIT_PHOTO_BUTTON.style.display = "block";
  ACCOUNT_LOG_OUT_BUTTON.style.display = "block";

  const file = ACCOUNT_FILE_UPLOADER.files[0];
  ACCOUNT_FILE_UPLOADER.value = "";
  ACCOUNT_FILE_UPLOADER.style.display = "none";

  if (file == undefined) {
    ACCOUNT_WRONG_Message.innerHTML = "Please upload the photo";
    ACCOUNT_WRONG_Message.style.display = "block";
  } else {
    // get secure url from server

    const { url } = await fetch("/imgStorage").then((res) => res.json());
    console.log(url);

    // post the image directly to the s3 bucket

    await fetch(url, {
      method: "PUT",
      headers: { "Content-type": "image/png" },
      body: file,
    });

    const imageURL = url.split("?")[0];
    console.log(imageURL);
    const imageHex = imageURL.split("/");
    const image = imageHex[imageHex.length - 1];

    // delete old photo

    await fetch("/deletePhoto", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });

    // add new photo

    await fetch("/createPhoto", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email: userEmail, image: image }),
    });

    // revise DOM photo

    let photo = "http://d1v357yavrduf9.cloudfront.net/" + image;
    ACCOUNT_PHOTO.style.backgroundImage = `url(${photo})`;
    USER_PHOTO.style.backgroundImage = `url(${photo})`;
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
