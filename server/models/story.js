const mongoose = require("mongoose");

// defining the schema for the story database

const GameStorySchema = new mongoose.Schema({
  author_ids: Array,
  content: String,
  author_names: Array,
  // date_created: String,
  active: Boolean,
  code: String,
  title: String,
  likes: Array,
});

// create and export a story model
module.exports = mongoose.model("story", GameStorySchema);
