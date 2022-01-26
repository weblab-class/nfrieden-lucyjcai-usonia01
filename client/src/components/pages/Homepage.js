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
    storiesList = <div className="no-story-styling"> No stories so far! </div>;
  }

  return (
    <>
      <div className="Homepage-title">Welcome!</div>
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
            <li>Log in to begin a game and personalize your experience!</li>
            <li>
              Head over to the{" "}
              <span className="instruction-icons">
                <i class="fas fa-plus-square"></i>
              </span>{" "}
              tab to start a new story, and use the game code to invite your friends. Each user's
              name will be bolded when it is their turn to write a sentence (but be careful, you
              only have 15 seconds to submit). Once you're done, vote to end the story, set a title
              for it, and publish!
            </li>
            <li>
              To invite other people to write a story with you, copy the game code and send it to
              them so they can enter it in the "Join a created story!" tab. Make sure every user has
              entered the game before pressing the "Start Game!" button.
            </li>
            <li>To the left, view a feed of all published stories on this website.</li>
            <li>
              In the{" "}
              <span className="instruction-icons">
                <i class="fas fa-book"></i>
              </span>{" "}
              tab, view the list of stories you have contributed to.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default HomePage;
