import React, { useState, useEffect } from "react";
import "./Homepage.css";
import Card from "./Card.js";
import { get, post } from "../../utilities";

const HomePage = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    get("/api/finishedstories").then((stories) => {
      const reversedStories = stories.reverse();
      setFeed(reversedStories);
      console.log("setFeed to existing stories");
      console.log(feed);
    });
  }, []);

  let storiesList = null;
  const hasStories = feed.length !== 0;
  if (hasStories) {
    storiesList = feed.map((storyObj) => (
      <Card content={storyObj.content} storyId={storyObj._id} />
    ));
  } else {
    storiesList = <div> No stories so far! </div>;
  }

  return (
    <>
      <div className="Homepage-title">Welcome to StoryCollab!</div>
      <div className="Homepage-feedtitle">feed</div>
      <div className="Homepage-feed">{storiesList}</div>
    </>
  );
};

export default HomePage;
