import React, { useState, useEffect } from "react";
import "./GamePage.css";
import StorySentence from "./StorySentence";
import { get, post } from "../../utilities";

const GamePage = () => {
  const [count, setCount] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [inputText, setInputText] = useState("");
  // const storyId = props.storyId;
  const [storyId, setStoryId] = useState(undefined);
  // this needs to be brought in from the back-end
  // right now its just a hard-coded dictionary

  // uncomment when done 1
  const [users, setUsers] = useState([
    { color: "gold", name: "Nadia Friedman" },
    { color: "blue", name: "Veer Gadodia" },
    { color: "pink", name: "Bob" },
  ]);

  const CharCount = (event) => {
    setInputText(event.target.value);
    if (event.target.value.length <= 50) {
      setCount(event.target.value.length);
    }
  };

  // loading story sofar
  // const loadStory = (storyId) => {
  //   let stories = [];
  //   get("/api/CurrentStory", { _id: storyId }).then((story) => {
  //     if (story) {
  //       stories.push(story.content);
  //     }
  //     setSentences(stories);
  //   });
  // };
  // function to keep the content after reload

  // function for adding sentences
  const addNewSentence = () => {
    const updatedSentences = [...sentences, inputText];
    setSentences(updatedSentences);
    setInputText("");
    setCount(0);

    post("/api/story", { _id: storyId, content: updatedSentences.join(" ") }).then((res) => {
      // set the state of some frontend state variable to the value of res._id
      if (!storyId) {
        // console.log(res._id);
        setStoryId(res._id);
      }
    });
    // setSentences(updatedSentences);
    // setInputText("");
    // setCount(0);
  };

  // useEffect(() => {
  //   loadStory(storyId);
  // }, []);

  return (
    <>
      <div className="Story-space">
        <div style={{ flexDirection: "row", display: "flex" }}>
          <div className="item test" style={{ flex: 0.7 }}>
            {sentences.length > 0
              ? sentences.map((sentences, index) => (
                  <StorySentence key={index} content={sentences} />
                ))
              : "Your changing story will appear here..."}
          </div>

          {/* uncomment when done */}

          <div style={{ flex: 0.3, paddingLeft: 30, paddingRight: 20 }}>
            <div style={{ fontWeight: "bold", marginBottom: 5, fontSize: "25px" }}>
              Contributors
            </div>
            {users.map((user) => (
              <div style={{ width: "100%", padding: 10, display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    height: "25px",
                    width: "25px",
                    "background-color": user.color,
                    "border-radius": "50%",
                    display: "inline-block",
                  }}
                ></span>
                <span style={{ fontWeight: 500, marginLeft: 10 }}>{user.name}</span>
              </div>
            ))}
          </div>
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
