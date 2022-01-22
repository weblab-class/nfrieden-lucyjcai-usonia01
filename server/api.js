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

// router to get all the names of people who contributed to a story

const Name = async (id) => {
  const user = await User.findOne({ _id: id });
  console.log("Usersname: ", user);
  console.log(user.name);
  return user.name;
};

const Vote = async (id) => {
  const user = await User.findOne({ _id: id });
  console.log(user.voteEnd);
  return user.voteEnd;
};

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

router.get("/finishedstories", (req, res) => {
  GameStory.find({active: false}).then((stories) => res.send(stories));
});


router.post("/post-story", auth.ensureLoggedIn, (req, res) => {
  GameStory.findOne({ code: req.body.code }).then((story) => {
    story.active = false;
    story.save();
  });
});

router.post("/set-title", auth.ensureLoggedIn, (req, res) => {
  console.log("at least set-title is running");
  console.log(req.body.code, req.body.title);
  GameStory.findOne({ code: req.body.code }).then((story) => {
    story.title = req.body.title;
    story.save();
  })
});

router.post("/vote-to-end", auth.ensureLoggedIn, (req, res) => {
  User.findOne({ _id: req.user._id }).then((user) => {
    user.voteEnd = true;
    user.save();
    console.log("this is voteEnd of user:", user.voteEnd);
  });
});

// update existing story

router.post("/Update-story", auth.ensureLoggedIn, (req, res) => {
  GameStory.findOne({ code: req.body.code }).then((story) => {
    if (!story.author_ids.includes(req.user._id)) {
      story.author_ids.push(req.user._id);
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
  console.log("creating story");
  console.log("this is user-id:", req.user._id);
  const newStory = GameStory({
    author_ids: [req.user._id],
    content: req.body.content,
    active: true,
    code: req.body.code,
  });

  newStory.save().then((story) => res.send(newStory));
});

// router to getting all ids people who contributed to a story
router.get("/contributors", (req, res) => {
  GameStory.findOne({ code: req.query.code }).then((story) => {
    const authors = story.author_ids;
    console.log("this is the authors:", authors);
    const Toreturn = authors.map((id) => Name(id));
    console.log("before:", Toreturn);
    Promise.all(Toreturn).then((result) => {
      console.log("toreturn:", Toreturn);
      res.send(result);
    });
    // res.send(Toreturn);
  });
});

router.get("/voters", auth.ensureLoggedIn, (req, res) => {
  GameStory.findOne({ code: req.query.code }).then((story) => {
    const voters = story.author_ids;
    console.log("this is the voters:", voters);
    const Toreturn = voters.map((id) => Vote(id));
    Promise.all(Toreturn).then((result) => {
      res.send(result);
    });
    // res.send(Toreturn);
  });
});

// change 4: router to getting active story
router.get("/Mystories", auth.ensureLoggedIn, (req, res) => {
  GameStory.find().then((story) => {
    if (story.author_ids.includes(req.user._id)) {
      res.send(story);
    } else {
      return res.send({});
    }
  });
});

router.get("/myfinishedstories", auth.ensureLoggedIn, (req, res) => {
  let myStories = [];
  GameStory.findOne({active: false}).then((story) => {
    console.log("story author ids are: ", story.author_ids);
    console.log("req user id is: ", req.user._id);
    if (story.author_ids.includes(req.user._id)) {
      myStories.push(story);
    } 
    res.send(myStories);
  });
});

// get current story

router.get("/CurrentStory", auth.ensureLoggedIn, (req, res) => {
  const input = req.query._id;
  if (typeof input !== "undefined") {
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
