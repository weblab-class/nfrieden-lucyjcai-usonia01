import React, { useState, useEffect } from "react";
import "./GamePage.css";
import StorySentence from "./StorySentence";
import { get, post } from "../../utilities";

const GamePage = (props) => {
  const [count, setCount] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [inputText, setInputText] = useState("");
  // const [storyId, setStoryId] = useState(undefined);
  const [existing, setExisting] = useState(false);

  // this needs to be brought in from the back-end
  // right now its just a hard-coded dictionary
  const [userDictionary, setUserDictionary] = useState([
    { color: "gold", name: "Nadia Frieden" },
    { color: "blue", name: "Lucy Cai" },
    { color: "pink", name: "Sonia Uwase" },
  ]);
  const [userArray, setUserArray] = useState(["Nadia Frieden", "Lucy Cai", "Sonia Uwase"]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const CharCount = (event) => {
    setInputText(event.target.value);
    if (event.target.value.length <= 300) {
      setCount(event.target.value.length);
    }
  };
  // console.log(props.code);
  const addNewSentence = () => {
    const updatedSentences = [...sentences, inputText];
    setSentences(updatedSentences);
    post("/api/Update-story", { code: props.code, content: updatedSentences.join(" ") });
    setInputText("");
    setCount(0);

    // index for bolding different people's names
    setSelectedIndex((selectedIndex + 1) % 3);
  };

  // story so far
  useEffect(() => {
    let stories = [];
    console.log(props.code);
    get("/api/search", { code: props.code }).then((res) => {
      console.log("checking if search successful");
      console.log(res);
      if (!res.length == 0) {
        console.log("story content ...");
        console.log(res.content);
        console.log("<<>>");
        stories.push(res[0].content);
        // setExisting(true);
      } else {
        post("/api/new_story", { code: props.code, content: "" });
      }
      setSentences(stories);
      // console.log(existing);
    });
  }, []);

  return (
    <>
      <div className="Story-space">
        <div className="OurStory">
          <div className="item test">
            {sentences.length > 0
              ? sentences.map((sentences, index) => (
                  <StorySentence key={index} content={sentences} />
                ))
              : "Your changing story will appear here..."}
          </div>

          <div className="ContributorsSpace">
            <div className="Contributors">Contributors</div>
            {userDictionary.map((userDictionary, i) => (
              <div style={{ width: "100%", padding: 10, display: "flex", alignItems: "center" }}>
                <span
                  className="ColorDisplay"
                  style={{ "background-color": userDictionary.color }}
                ></span>

                {i == selectedIndex ? (
                  <span style={{ fontWeight: 700, marginLeft: 10 }}>{userDictionary.name}</span>
                ) : (
                  <span style={{ fontWeight: 500, marginLeft: 10 }}>{userDictionary.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="TextingSpace">
          <div className="Add">
            <div className="my-text">
              <textarea
                className="item Text-space"
                onChange={CharCount}
                placeholder="Type your sentence..."
                maxLength="300"
                value={inputText}
              ></textarea>
              <span className="Text-space_count"> {count}/300 (Max Character)</span>
            </div>

            <div className="AddingButton">
              <input
                className="item GamePage-addButton"
                type="button"
                value="Add!"
                onClick={addNewSentence}
              ></input>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;
