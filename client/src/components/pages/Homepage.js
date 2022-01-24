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
    });
  }, []);

  let storiesList = null;
  const hasStories = feed.length !== 0;
  if (hasStories) {
    storiesList = feed.map((storyObj) => (
      <Card
        content={storyObj.content}
        storyId={storyObj._id}
        title={storyObj.title}
        code={storyObj.code}
      />
    ));
  } else {
    storiesList = <div> No stories so far! </div>;
  }

  return (
    <>
      <div className="Homepage-title">Welcome to StoryCollab!</div>
      <div style={{ flexDirection: "row", display: "flex" }}>
        {/* Row for Feed */}
        <div className="Homepage-feed" style={{ flex: 0.5 }}>
          <div className="Homepage-feedtitle">Feed</div>
          <div className="Homepage-storiescontent">{storiesList}</div>
        </div>

        {/* Row for Instructions */}
        <div style={{ flex: 0.5 }}>
          <div className="Homepage-instructionstitle">Instructions</div>
          <ul className="instructions-list">
            <li>
              Head over to the <i className="fas fa-plus-square"></i> tab to start a new story, and
              use the game code to invite your friends. Each person submits a sentence on their
              turn. Once you're done, vote to end the story, set a title for it, and you're done!
            </li>
            <li>To the left, view a feed of all stories on this website.</li>
            <li>
              In the <i className="fas fa-book"></i> tab, view the list of stories you have
              contributed to.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default HomePage;
