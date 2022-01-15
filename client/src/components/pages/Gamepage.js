import React, { useState } from "react";
import "./GamePage.css";

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
        <textarea
          className="item test"
          placeholder="Your changing story will appear here..."
        ></textarea>

        <div className="Add">
          <div className="my-text">
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
