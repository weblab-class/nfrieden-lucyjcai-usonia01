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

  // MongoDB part; This needs to be edited

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
  };

  // Nadia's edits
  useEffect(() => {
    // let author_id = "61e348b2169bf8320892af1d"; // this is mine specifically, it eventually needs to be passed in as a prop? I think

    // STEPS:
    // 1. where you're handing google auth login, you need to save author id in session storage

    // 2. in this file, you need to retrieve the author id and use it to make a get
    // request to the "active_story" endpoint to only retrive stories with that author id (this is how you set sentences)

    // 3. also request to retrieve a list of users given the story

    // **************

    // The function below does not work how its supposed to, but its a start.
    // It saves stuff after reloading, but duplicates it for an undetermined reason

    //   get("/api/stories").then((res) => {
    //     res.map((story) => {
    //       let stories = [];
    //       console.log(story.author_ids, author_id);
    //       if (story.author_ids.includes(author_id)) {
    //         stories.push(story.content);
    //       }
    //     });
    //     setSentences(stories);
    //   });
    // }, []);

    get("/api/CurrentStory").then((response) => {
      console.log(response);
      let stories = [];
      stories.push(response.content);

      setSentences(stories);
    });
  }, []);

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
