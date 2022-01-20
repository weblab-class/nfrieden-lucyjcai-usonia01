import React, { useState, useEffect } from "react";
import "./GamePage.css";
import StorySentence from "./StorySentence";
import { get, post } from "../../utilities";

const GamePage = () => {
  const [count, setCount] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [inputText, setInputText] = useState("");
  const [storyId, setStoryId] = useState(undefined);

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

  const addNewSentence = () => {
    const updatedSentences = [...sentences, inputText];
    setSentences(updatedSentences);
    // setInputText("");
    // setCount(0);
    // post("/api/story", { content: inputText });

    post("/api/story", { _id: storyId, content: updatedSentences }).then((res) => {
      // set the state of some frontend state variable to the value of res._id
      if (!storyId) {
        // console.log(res._id);
        setStoryId(res._id);
      }
      setInputText("");
      setCount(0);
    });

    // index for bolding different people's names
    setSelectedIndex((selectedIndex + 1) % 3);
  };

  useEffect(() => {
    let stories = [];
    let author_id = "61e4b5459ce83c493c31d313"; // this is mine specifically, it eventually needs to be passed in as a prop? I think

    // STEPS:
    // 1. where you're handing google auth login, you need to save author id in session storage

    // 2. in this file, you need to retrieve the author id and use it to make a get
    // request to the "active_story" endpoint to only retrive stories with that author id (this is how you set sentences)

    // 3. also request to retrieve a list of users given the story

    // **************

    // The function below does not work how its supposed to, but its a start.
    // It saves stuff after reloading, but duplicates it for an undetermined reason

    get("/api/stories").then((res) => {
      let stories = [];
      res.map((story) => {
        console.log(story.author_ids, author_id);
        // if (story.author_ids.includes(author_id)){
        stories.push(story.content);
        // }
      });
      setSentences(stories);
    });
  }, []);

  return (
    <>
      <div className="Story-space">
        <div style={{ flexDirection: "row", display: "flex" }}>
          {/* This function defines the additive text space*/}
          <div className="item test" style={{ flex: 0.7 }}>
            {sentences.length > 0
              ? sentences.map((sentences, index) => (
                  <StorySentence key={index} content={sentences} />
                ))
              : "Your changing story will appear here..."}
          </div>

          {/* This function is very messy but it makes the dots on the side */}
          <div style={{ flex: 0.3, paddingLeft: 30, paddingRight: 20 }}>
            <div style={{ fontWeight: "bold", marginBottom: 5, fontSize: "25px" }}>
              Contributors
            </div>
            {userDictionary.map((userDictionary, i) => (
              <div style={{ width: "100%", padding: 10, display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    height: "25px",
                    width: "25px",
                    "background-color": userDictionary.color,
                    "border-radius": "50%",
                    display: "inline-block",
                  }}
                ></span>

                {/* function below controls which name is bolded */}
                {i == selectedIndex ? (
                  <span style={{ fontWeight: 700, marginLeft: 10 }}>{userDictionary.name}</span>
                ) : (
                  <span style={{ fontWeight: 500, marginLeft: 10 }}>{userDictionary.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flexDirection: "row", display: "flex" }}>
          <div className="Add">
            {/* For the text inserter*/}
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

            {/* For the button*/}
            <div style={{ padding: 24, flex: 0.3 }}>
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
