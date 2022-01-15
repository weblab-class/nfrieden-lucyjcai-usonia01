import React, {useState} from "react";
import StorySentence from "./StorySentence.js";

import "./SubmitBar.css";

const SubmitBar = () => {
    const [sentences, setSentences] = useState([]);
    const [inputText, setInputText] = useState("");

    const handleInputText = (event) => {
        const value = event.target.value;
        setInputText(value);
    }

    const addNewSentence = () => {
        setSentences([...sentences, inputText]);
        setInputText("");
      };

    return (
        <div>
            {sentences.map((sentences) => (
                <StorySentence content={sentences} />
            ))}
            <div className="SubmitBar-typeBox">
                <textarea cols="40" rows="3" placeholder="Type your sentence..." value={inputText} onChange={handleInputText}></textarea>
                <input className="SubmitBar-addButton" type="button" value="Add!" onClick={addNewSentence}></input>
            </div>
        </div>
    )
  };
  
  export default SubmitBar;
