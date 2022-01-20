import React, { useState, useEffect } from "react";
import { Link, Router } from "@reach/router";
import GamePage from "../pages/GamePage.js";
import "./JoinAuth.css";
import { get, post } from "../../utilities";

// 1. change for code validity
// 2. if valid --> take to gamepage
// 3. if not valid --> Sorry try again

const Join = () => {
  // const [storyCode, setstoryCode] = useState(undefined);
  // const existing = false
  // const [existing, setExisting] = useState(false);
  const handleJoin = () => {
    setstoryCode(document.getElementsByClassName("Code-textBox"));
    get("/api/search", { code: storyCode }).then((story) => {
      if (story) {
        // setExisting(true);
        console.log(story);
        console.log(story.code);
        return <GamePage code={story.code} />;
      } else {
        // give an alert that wrong code was provided
      }
    });
  };
  return (
    <>
      <div className="Code-Form">
        <form>
          <div className="Game-Code">
            <label>Game Code</label>
            <input type="number" className="Code-textBox"></input>
          </div>
          <div className="Code-submit">
            {/* <Link to="/gamepage" state={{code ={story.code}, existing={true}}}>

            </Link> */}
            <button onClick={handleJoin}>Submit!</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Join;
