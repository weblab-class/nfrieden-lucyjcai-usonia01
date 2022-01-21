import React, { useState, useEffect } from "react";
import { Link, Router } from "@reach/router";
import GamePage from "../pages/GamePage.js";
import "./JoinAuth.css";
import { get, post } from "../../utilities";

// 1. change for code validity
// 2. if valid --> take to gamepage
// 3. if not valid --> Sorry try again


const Join = () => {

  const handleJoin = () => {
    console.log("started handleJoin");
    console.log(document.getElementsByClassName("Code-textBox")[0].value);
    get("/api/search", { code: document.getElementsByClassName("Code-textBox")[0].value }).then(() => {
      console.log("game found!");
      // if (story) {
      //   console.log("game found! :)")
      //   // setExisting(true);
      //   console.log(story);
      //   console.log(story.code);
      //   return <GamePage code={story.code} />;
      // } else {
      //   // give an alert that wrong code was provided
      //   console.log("no existing game found :(")
      //   alert("This game does not exist.");
      // }
    });
  };
  
  return (
    <>
      <div className="Code-Form">
        <form>
          <div className="Game-Code">
            <label>Game Code</label>
            <input type="text" className="Code-textBox"></input>
          </div>
          <div className="Code-submit">
            <button onClick={handleJoin}>Submit!</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Join;
