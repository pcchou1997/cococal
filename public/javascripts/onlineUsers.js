let socket = io();

socket.on("change-onlineUsersCount", function (onlineUsersCount) {
  const onlineUser_num = document.querySelector(".onlineUser-num");
  onlineUser_num.innerHTML = onlineUsersCount;
});
