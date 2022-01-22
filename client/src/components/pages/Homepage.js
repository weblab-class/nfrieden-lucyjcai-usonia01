import React, { useState, useEffect } from "react";
import "./Homepage.css";
import Card from "./Card.js";
import { get, post } from "../../utilities";


const HomePage = () => {
  const [feed, setFeed] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    get("/api/finishedstories").then((stories) => {
      const reversedStories = stories.reverse();
      setFeed(reversedStories);
      console.log("setFeed to existing stories");
      console.log(feed);
    })
  }, []);

  let storiesList = null;
  const hasStories = feed.length !== 0;
  if (hasStories) {
    storiesList = feed.map((storyObj) => (
      <Card content={storyObj.content} storyId={storyObj._id} title={storyObj.title} code={storyObj.code} />
    ))
  } else {
    storiesList = <div> No stories so far! </div>
  }

  return (
    <>
    <div className="Homepage-title">
      Welcome to StoryCollab!
    </div>
    <div style={{ flexDirection: "row", display: "flex"}}>
      {/* Row for Feed */}
      <div className="Homepage-feed" style={{flex: 0.5}}>
        <div className="Homepage-feedtitle">
          Feed
        </div>
        <div className="Homepage-storiescontent">
          {storiesList}
        </div>
      </div>

      {/* Row for Instructions */}
      <div style={{flex: 0.5}}>
        <div className="Homepage-instructionstitle">
          Instructions
        </div>
        <ul class="instructions-list">
          <li>Instruction #1. This is what happens when the instruction wraps around.</li>
          <li>Instruction #2</li>
          <li>Instruction #3</li>
        </ul>
      </div>
      
    </div>
    </>
  );
};

export default HomePage;
