const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
// const { Server } = require("socket.io");
// const io = new Server(server);

// routes
const pageRoute = require("./routes/page");
const adminRoute = require("./routes/admin");
const eventRoute = require("./routes/event");
const categoryRoute = require("./routes/category");
const memberRoute = require("./routes/member");

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(pageRoute);
app.use(adminRoute);
app.use(eventRoute);
app.use(categoryRoute);
app.use(memberRoute);

let onlineUsersCount = 0;

// socket.io 連線
io.on("connection", (socket) => {
  console.log("a user connected");
  onlineUsersCount++;
  io.emit("change-onlineUsersCount", onlineUsersCount);

  socket.on("disconnect", () => {
    console.log("user disconnected");
    onlineUsersCount--;
    io.emit("change-onlineUsersCount", onlineUsersCount);
  });

  // socket: server 傳送給所有 client
  socket.on("insert-event", (msg) => {
    io.emit("insert-event", msg);
  });

  socket.on("edit-event", (msg) => {
    io.emit("edit-event", msg);
  });

  socket.on("delete-event", (msg) => {
    io.emit("delete-event", msg);
  });

  socket.on("insert-category", (msg) => {
    io.emit("insert-category", msg);
  });

  socket.on("edit-category", (msg) => {
    io.emit("edit-category", msg);
  });

  socket.on("delete-category", (msg) => {
    io.emit("delete-category", msg);
  });
});

server.listen(3000, () => {
  console.log("run on port 3000, url: http://127.0.0.1:3000/");
});
