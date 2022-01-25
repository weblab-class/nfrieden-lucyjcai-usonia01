let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object
// maps users to their ID
let counter = 0;
// let ticks = 0;

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

// Socket logic

const Game = (story) => {
  console.log("mygame:", story);
  const IdtoUsername = {};

  const player_ids = story.author_ids;
  const n_players = story.author_ids.length;

  for (let i = 0; i < n_players; i++) {
    IdtoUsername[player_ids[i]] = story.author_names[i];
  }

  // let writer = story.author_ids[counter];

  setTimeout(() => {
    // socket emit to people in this game
    io.emit("content", story.content);
    io.emit("contributors", story.author_names);
    io.emit("IdToName", IdtoUsername);
    // io.emit("writer", writer);
  }, 1000 / 10);

  // setTimeout(() => {
  //   counter = (counter + 1) % player_ids.length;
  //   // console.log("counter:", counter);
  //   writer = story.author_ids[counter];

  //   //   // io.emit("writer", writer);
  //   //   // emit the writer
  // }, 10000);
};

const Write = (story) => {
  let writer = story.author_ids[counter];
  let ticks = 0;
  setInterval(() => {
    io.emit("writer", writer);

    if (ticks % 10 === 0) {
      counter = (counter + 1) % story.author_ids.length;

      writer = story.author_ids[counter];
    }

    ticks += 1;
  }, 10000);
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,
  Game: Game,
  Write: Write,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
