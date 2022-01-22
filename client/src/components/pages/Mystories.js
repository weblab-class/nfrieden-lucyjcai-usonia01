import React, { useState, useEffect } from "react";
import "./Homepage.css";
import Card from "./Card.js";
import { get, post } from "../../utilities";

const MyStory = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    get("/api/Mystories").then((stories) => {
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
    storiesList = <div> You've no stories so far! </div>;
  }

  return (
    <>
      <div className="Homepage-title">My Stories!</div>
      <div className="Homepage-feed">
        <div className="Homepage-storiescontent">{storiesList}</div>
      </div>
    </>
  );
};

export default MyStory;
