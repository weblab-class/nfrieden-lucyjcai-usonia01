import React, { useState } from "react";
import "./GamePage.css";
import SubmitBar from "./SubmitBar.js";

const GamePage = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="Story-space">

        <div className="Add">
          <div className="my-text">
            <h1>hi this is the game page</h1>
            <SubmitBar />
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;
