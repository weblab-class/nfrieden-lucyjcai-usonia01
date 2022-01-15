import React, { useState } from "react";
import "./GamePage.css";
import SubmitBar from "./SubmitBar.js";

const GamePage = () => {
  const [count, setCount] = useState(0);

  const CharCount = () => {
    if (document.getElementsByClassName("Text-space").length <= 50) {
      setCount(document.getElementsByClassName("Text-space").length);
    }
  };

  return (
    <>
      <div className="Story-space">

        <div className="Add">
          <div className="my-text">
            <h1>hi this is the game page</h1>
            <SubmitBar />
            <textarea
              className="item Text-space"
              onChange={(event) => {
                CharCount();
              }}
              placeholder="Type your sentence..."
            ></textarea>
            <span class="Text-space_count"> {count}/50 (Max Character)</span>
          </div>
          <input className="item GamePage-addButton" type="button" value="Add!"></input>
        </div>
      </div>
    </>
  );
};

export default GamePage;
