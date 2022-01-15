import React, { useState } from "react";
import "./GamePage.css";

const GamePage = () => {
  const [count, setCount] = useState(0);

  const CharCount = (event) => {
    if (event.target.value.length <= 50) {
      setCount(event.target.value.length);
    }
  };

  return (
    <>
      <div className="Story-space">
        <textarea
          className="item test"
          placeholder="Your changing story will appear here..."
          disabled
        ></textarea>

        <div className="Add">
          <div className="my-text">
            <textarea
              className="item Text-space"
              onChange={CharCount}
              placeholder="Type your sentence..."
              maxLength="50"
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
