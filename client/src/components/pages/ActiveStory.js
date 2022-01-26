import React, {useState, useEffect} from "react";
import Card from "./Card.js";
import "./ActiveStory.css";
import { get, post } from "../../utilities";


const ActiveStory = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    get("/api/myfinishedstories").then((stories) => {
      const reversedStories = stories.reverse();
      setFeed(reversedStories);
    })
  }, []);

  let storiesList = null;
  const hasStories = feed.length !== 0;
  if (hasStories) {
    storiesList = feed.map((storyObj) => (
      <Card content={storyObj.content} storyId={storyObj._id} title={storyObj.title} code={storyObj.code} />
    ))
  } else {
    storiesList = <div className="no-my-stories"> No stories so far! </div>
  }

  return (
    <div>
      <div className="MyStories-title">My Stories</div>
      {storiesList}
    </div>
  );
};

export default ActiveStory;
