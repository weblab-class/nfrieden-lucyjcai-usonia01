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

const Vote = async (id) => {
  const user = await User.findOne({ _id: id });
  console.log(user.voteEnd);
  return user.voteEnd;
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

// let checker = true;
router.post("/writer", (req, res) => {
  // console.log(">>><<<<");
  // console.log(checker);
  // console.log(">>><<<");
  // if (checker) {
  GameStory.findOne({ code: req.body.code }).then((story) => {
    socketManager.Write(story);
  });
  // }
  // checker = false;
});
// Change 2: router for the home page/stories page
// TODO: Style this such that the display is based on the status of the story
router.get("/stories", (req, res) => {
  GameStory.find({}).then((stories) => res.send(stories));
});

router.post("/set-title", auth.ensureLoggedIn, (req, res) => {
  console.log("at least set-title is running");
  console.log(req.body.code, req.body.title);
  GameStory.findOne({ code: req.body.code }).then((story) => {
    story.title = req.body.title;
    story.save();
  });
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
    if (!story.likes.includes(req.user._id)) {
      story.likes = [...story.likes, req.user._id];
    }
    story.save().then((newStory) => {
      socketManager.Like(newStory);
    });
    console.log("story saved!");
  });
});

router.post("/withdraw-likes", auth.ensureLoggedIn, (req, res) => {
  GameStory.findOne({ code: req.body.code }).then((story) => {
    story.likes.pop();
    story.markModified("likes");
    story.save().then(() => {
      socketManager.Dislike(story);
    });
  });
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
  console.log("updating story....");
  GameStory.findOne({ code: req.body.code }).then((story) => {
    if (!story.author_ids.includes(req.user._id)) {
      story.author_ids.push(req.user._id);
      story.author_names.push(req.user.name);
    }
    story.content = req.body.content;
    story.save().then(() => {
      socketManager.Game(story);
    });
  });
});

// checking for existance of a story
router.get("/search", auth.ensureLoggedIn, (req, res) => {
  GameStory.find({ code: req.query.code }).then((story) => res.send(story));
});

router.get("/get-likes", (req, res) => {
  GameStory.findOne({ code: req.query.code }).then((story) => {
    let hearts = (story.likes.length || 0).toString();
    console.log(hearts);
    // console.log(typeof hearts);
    res.send(hearts);
  });
});

router.get("/get-liked", auth.ensureLoggedIn, (req, res) => {
  GameStory.findOne({ code: req.query.code }).then((story) => {
    if (story.likes.includes(req.user._id)) {
      console.log("this story has been liked by user!");
      res.send(true);
    } else {
      console.log("this story has not yet been liked");
      res.send(false);
    }
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

  newStory.save().then((story) => {
    socketManager.Game(newStory);
    res.send(newStory);
  });
  // newStory.save();

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

router.get("/contributors-list", (req, res) => {
  GameStory.findOne({ code: req.query.code }).then((story) => {
    const authors = story.author_ids;
    const Toreturn = authors.map((id) => Name(id));
    Promise.all(Toreturn).then((result) => {
      res.send(result);
    });
  });
});

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
