/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

// Step2: defining the schema
const GameStory = require("./models/story");
// const StoryUser = require("./models/StoryUser");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const story = require("./models/story");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// Change 2: router for the home page/stories page
// TODO: Style this such that the display is based on the status of the story
router.get("/stories", (req, res) => {
  GameStory.find({}).then((stories) => res.send(stories));
});

// update existing story

router.post("/Update-story", auth.ensureLoggedIn, (req, res) => {
  GameStory.find({ code: req.body.code }).then((story) => {
    if (!story.author_ids.includes(req.user._id)) {
      story.author_ids = author_ids.push(req.user._id);
    }
    story.content = req.body.content;
    story.save();
  });
});

// checking for existance of a story
router.get("/search", auth.ensureLoggedIn, (req, res) => {
  GameStory.find({ code: req.query.code }).then((story) => res.send(story));
});

//creating new story

router.post("/new_story", auth.ensureLoggedIn, (req, res) => {
  const newStory = newGameStory({
    author_ids: [req.user._id],
    content: req.body.content,
    active: true,
    code: req.body.code,
  });

  newStory.save().then((story) => res.send(newStory));
});

// change 4: router to getting active story
router.get("/Mystories", auth.ensureLoggedIn, (req, res) => {
  GameStory.find().then((story) => {
    // console.log("HEREE");
    if (story.author_ids.includes(req.user._id)) {
      res.send(story);
    } else {
      return res.send({});
    }
  });
});

// get current story

router.get("/CurrentStory", auth.ensureLoggedIn, (req, res) => {
  const input = req.query._id;
  if (typeof input !== "undefined") {
    console.log("checking....");
    console.log(req.query._id);
    console.log("reached here");
    GameStory.findById(req.query._id).then((story) => {
      res.send(story);
    });
  } else {
    return res.send({});
  }
});

// change 5: router for changing the existing story
// TODO: Figure out how to go about routing the edits made on an existing story
// router.post("/edit_story", auth.ensureLoggedIn, (req, res) => {
//   GameStory.findById(req.stories._id).then((gameStory) => {
//     gameStory.content = gameStory.content.concat(req.body.content);
//     gameStory.author_ids = gameStory.author_ids.includes(req.user._id)
//       ? gameStory.author_ids
//       : gameStory.author_ids.push(req.user._id);
//   });
// });

// router.post("/edit_story", auth.ensureLoggedIn, (req, res) => {
// ;
// });

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
