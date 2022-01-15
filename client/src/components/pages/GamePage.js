import React, { useState } from "react";
import "./GamePage.css";
import StorySentence from "./StorySentence";
import { get, post } from "../../utilities";

const GamePage = () => {
  const [count, setCount] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [inputText, setInputText] = useState("");

  const CharCount = (event) => {
    setInputText(event.target.value);
    if (event.target.value.length <= 50) {
      setCount(event.target.value.length);
    }
  };

  const addNewSentence = () => {
    const updatedSentences = [...sentences, inputText];
    setSentences(updatedSentences);
    setInputText("");
    post("/api/new_story", { content: updatedSentences.join(" ") });
  };

  return (
    <>
      <div className="Story-space">
        <div className="item test">
          {sentences.length > 0
            ? sentences.map((sentences, index) => <StorySentence key={index} content={sentences} />)
            : "Your changing story will appear here..."}
        </div>

        <div className="Add">
          <div className="my-text">
            <textarea
              className="item Text-space"
              onChange={CharCount}
              placeholder="Type your sentence..."
              maxLength="50"
              value={inputText}
            ></textarea>
            <span className="Text-space_count"> {count}/50 (Max Character)</span>
          </div>
          <input
            className="item GamePage-addButton"
            type="button"
            value="Add!"
            onClick={addNewSentence}
          ></input>
        </div>
      </div>
    </>
  );
};

export default GamePage;
