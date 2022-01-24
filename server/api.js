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
  // console.log("Usersname: ", user);
  // console.log(user.name);
  return user.name;
};

// const DictConst = (ids, names) => {
//   const IdtoUsername = {};
//   const n_players = ids.length;
//   for (let i = 0; i < n_players; i++) {
//     IdtoUsername[ids[i]] = names[i];
//   }
//   return IdtoUsername;
// };

// const Writer = (ids) => {
//   let counter = 0;
//   let writer = ids[counter];
//   setTimeout(() => {
//     counter = (counter + 1) % ids.length;
//     writer = ids[counter];
//     return writer;
//   }, 60000);
// };

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

// whoamI Name
router.get("/MyName", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user.name);
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
  GameStory.find({ active: false }).then((stories) => res.send(stories));
});

router.post("/post-story", auth.ensureLoggedIn, (req, res) => {
  GameStory.findOne({ code: req.body.code }).then((story) => {
    story.active = false;
    story.save();
  });
});

router.post("/post-likes", auth.ensureLoggedIn, (req, res) => {
  GameStory.findOne({ code: req.body.code }).then((story) => {
    story.likes = story.likes + 1;
    story.save();
  });
});

router.post("/withdraw-likes", auth.ensureLoggedIn, (req, res) => {
  GameStory.findOne({ code: req.body.code }).then((story) => {
    story.likes = story.likes - 1;
    story.save();
  });
});

// update existing story

router.post("/Update-story", auth.ensureLoggedIn, (req, res) => {
  console.log("updating story....");
  GameStory.findOne({ code: req.body.code }).then((story) => {
    if (!story.author_ids.includes(req.user._id)) {
      story.author_ids.push(req.user._id);
      story.author_names.push(req.user.name);
    }
    story.content = req.body.content;
    story.save();

    socketManager.Game(story);
    // socketManager.getIo().emit("content", story.content);
    // socketManager.getIo().emit("contributors", story.author_ids);
    // socketManager.getIo().emit("Writer", Writer(story.author_ids));
  });
});

// checking for existance of a story
router.get("/search", auth.ensureLoggedIn, (req, res) => {
  GameStory.find({ code: req.query.code }).then((story) => res.send(story));
});

router.get("/get-likes", (req, res) => {
  GameStory.findOne({ code: req.query.code }).then((story) => {
    let hearts = story.likes.toString();
    console.log(hearts);
    console.log(typeof(hearts));
    res.send(hearts);
  });
});

//creating new story

router.post("/new_story", auth.ensureLoggedIn, (req, res) => {
  console.log("creating story");
  console.log("this is user-id:", req.user._id);
  const newStory = GameStory({
    author_ids: [req.user._id],
    author_names: [req.user.name],
    content: req.body.content,
    active: true,
    code: req.body.code,
    likes: 0,
  });

  newStory.save().then((story) => res.send(newStory));
  // newStory.save();
  socketManager.Game(newStory);
  // socketManager.getIo().emit("New_Story", newStory);
});

// router to getting all ids people who contributed to a story
router.get("/contributors", auth.ensureLoggedIn, (req, res) => {
  GameStory.findOne({ code: req.query.code }).then((story) => {
    // const authors = story.author_ids;
    const Toreturn = story.author_names;

    // const Toreturn = authors.map((id) => Name(id));

    Promise.all(Toreturn).then((result) => {
      res.send(result);
    });
  });
});

router.get("/contributors-list", (req, res) => {
  GameStory.findOne({ code: req.query.code }).then((story) => {
    const authors = story.author_ids;
    const Toreturn = authors.map((id) => Name(id));
    Promise.all(Toreturn).then((result) => {
      res.send(result);
    });
  });
});

// Suggestion?
// router.get("/myfinishedstories", auth.ensureLoggedIn, (req, res) => {
//   GameStory.find({ active: false }).then((stories) => {
//     const Toreturn = stories.filter((story) => {
//       story.author_ids.includes(req.user._id);
//     });
//     res.send(Toreturn);
//   });
// });

router.get("/myfinishedstories", auth.ensureLoggedIn, (req, res) => {
  let activeStories = [];
  GameStory.find({ active: false }).then((stories) => {
    for (let i = 0; i < stories.length; i++) {
      if (stories[i].author_ids.includes(req.user._id)) {
        activeStories.push(stories[i]);
      }
    }
    res.send(activeStories);
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
// Socket stuff

// Socket related API
// router.post("/startGame", (req, res) => {
//   // find the story
//   socketManager.startGame(req.body._id);
// });

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
