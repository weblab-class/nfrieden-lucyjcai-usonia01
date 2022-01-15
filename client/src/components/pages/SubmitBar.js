import React, {useState} from "react";
import StorySentence from "./StorySentence.js";

import "./SubmitBar.css";

const SubmitBar = () => {
    const [sentences, setSentences] = useState([]);
    const [inputText, setInputText] = useState("");
    const [count, setCount] = useState(0);

    const handleInputText = (event) => {
        const value = event.target.value;
        setInputText(value);
    }

    const addNewSentence = () => {
        setSentences([...sentences, inputText]);
        setInputText("");
      };

    const CharCount = (event) => {
        if (event.target.value.length <= 50) {
            setCount(event.target.value.length);
        }
    };

    return (
        <div>
            <div className="SubmitBar-sent">
                {sentences.map((sentences) => (
                    <StorySentence content={sentences} />
                ))}
            </div>
            <div className="SubmitBar-typeBox">
                <textarea
                // className="item Text-space"
                onChange={CharCount}
                placeholder="Type your sentence..."
                maxLength="50"
                value={inputText}
                onChange={handleInputText}
                ></textarea>
                <input className="SubmitBar-addButton" type="button" value="Add!" onClick={addNewSentence}></input>
                <span class="Text-space_count"> {count}/50 (Max Character)</span>
            </div>
        </div>
    )
  };
  
  export default SubmitBar;
