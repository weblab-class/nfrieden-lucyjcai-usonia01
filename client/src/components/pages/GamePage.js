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
  const [endGameVote, setEndGameVote] = useState(false);

  //Things that I am commenting for now
  // const [userDictionary, setUserDictionary] = useState([
  //   { color: "gold", name: "Nadia Frieden" },
  //   { color: "blue", name: "Lucy Cai" },
  //   { color: "pink", name: "Sonia Uwase" },
  // ]);

  const [userArray, setUserArray] = useState([]);

  // get Contributors

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
    if (!userArray.length === 0) {
      setSelectedIndex((selectedIndex + 1) % useArray.length);
    }
  };

  const voteOnGameState = () => {
    if (endGameVote === true) {
      setEndGameVote(false);
    } else {
      setEndGameVote(true);
    }
    console.log(endGameVote);
  }

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

        get("/api/contributors", { code: props.code }).then((result) => {
          console.log("contributors:", result);
          setUserArray(result);
        });
      } else {
        post("/api/new_story", { code: props.code, content: "" }).then(() => {
          get("/api/contributors", { code: props.code }).then((result) => {
            console.log("contributors:", result);
            setUserArray(result);
          });
        });
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
                  <StorySentence key={index * 24645} content={sentences} />
                ))
              : "Your changing story will appear here..."}
          </div>
          </div>
          </div>

          <div className="ContributorsSpace">
            <div className="Contributors">Contributors</div>
            {userArray.map((user, i) => (
              <div
                key={user + i}
                style={{ width: "100%", padding: 10, display: "flex", alignItems: "center" }}
              >
                <span className="ColorDisplay"></span>

                {i == selectedIndex ? (
                  <span style={{ fontWeight: 700, marginLeft: 10 }}>{user}</span>
                ) : (
                  <span style={{ fontWeight: 500, marginLeft: 10, display: "block" }}>{user}</span>
                )}
              </div>))}
              
              <div style={{flex: 0.2}}>
                <div style={{fontWeight: "bold", marginBottom: 5, fontSize: "20px"}}>
                  vote to end game:
                  {endGameVote ? (
                      <button className="xmark" onClick={voteOnGameState}>
                        <i class="fas fa-times-circle fa-3x"></i>                
                      </button>
                  ) : (
                    <button className="checkmark" onClick={voteOnGameState}>
                      <i class="fas fa-check-square fa-3x"></i>                
                    </button>
                  )}
                </div>
              {endGameVote ? (
                  <p>Press the button again to undo.</p>
              ) : (
                  <p>You can undo this vote if you change your mind.</p>
              )}
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
              <span className="Text-space_count"> {count}/300 (Max Characters)</span>
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
    </>
  );
};

export default GamePage;
