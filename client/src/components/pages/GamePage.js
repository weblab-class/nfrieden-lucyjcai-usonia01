import React, { useState, useEffect } from "react";
import "./GamePage.css";
import StorySentence from "./StorySentence";
import { get, post } from "../../utilities";
import { Link, Router } from "@reach/router";


const GamePage = (props) => {
  const [count, setCount] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [inputText, setInputText] = useState("");
  // const [storyId, setStoryId] = useState(undefined);
  const [existing, setExisting] = useState(false);
  const [endGameVote, setEndGameVote] = useState(false);

  // this needs to be brought in from the back-end
  // right now its just a hard-coded dictionary
  // const [userDictionary, setUserDictionary] = useState([
  //   { color: "gold", name: "Nadia Frieden" },
  //   { color: "blue", name: "Lucy Cai" },
  //   { color: "pink", name: "Sonia Uwase" },
  // ]);
  const [userArray, setUserArray] = useState([]);
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
    if (!userArray.length === 0){
      setSelectedIndex((selectedIndex + 1) % userArray.length);
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
  
  const postStory = () => {
    post("/api/post-story", { code: props.code }).then((story) => {
      console.log(story.active);
    })
  };

  const enableTurn = () => {
    document.getElementById("submitButton").disabled = false;
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

        get("/api/contributors", {code: props.code}).then((result) => {
          setUserArray(result);
        })
      } else {
        post("/api/new_story", { code: props.code, content: "" }).then(() => {
          get("/api/contributors", {code: props.code}).then((result) => {
            setUserArray(result);
          })
        });
      }
      setSentences(stories);
      // console.log(existing);
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
                  <StorySentence key={index*2465343} content={sentences} />
                ))
              : "Your changing story will appear here..."}
          </div>

          {/* This function is very messy but it makes the dots on the side */}
          <div style={{ flex: 0.3, paddingLeft: 30, paddingRight: 20 }}>
            <div style={{flexDirection: "column", display: "flex", height:"100%"}}>

              {/* Contributors Bar*/}
              <div style={{flex: 0.8}}>
                <div style={{ fontWeight: "bold", marginBottom: 5, fontSize: "25px"}}>
                  Contributors
                </div>
                {userArray.map((user, i) => (
                  <div style={{ width: "100%", padding: 10, display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        height: "25px",
                        width: "25px",
                        // "background-color": userDictionary.color,
                        border: "1px solid",
                        "border-radius": "50%",
                        display: "inline-block",
                      }}
                    ></span>

                    {/* function below controls which name is bolded */}
                    {i == selectedIndex ? (
                      <span style={{ fontWeight: 700, marginLeft: 10 }}>{user}</span>
                    ) : (
                      <span style={{ fontWeight: 500, marginLeft: 10 }}>{user}</span>
                    )}
                  </div>
                ))}
              </div>
             
              {/* Vote to end game */}
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
          </div>
        </div>

        <div style={{ flexDirection: "row", display: "flex" }}>
          <div className="Add" style={{flex: 0.7}}>
            {/* For the text inserter*/}
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

            {/* For the button*/}
            <div style={{flex: 0.3 }}>
              <input
                className="item GamePage-addButton"
                id = "submitButton"
                type="button"
                value="Add!"
                onClick={addNewSentence}
                // disabled
              ></input>
            </div>
            <div style={{ padding: 24, flex: 0.3 }}>
            <Link to="/SubmittedPage">
              <input
                className="item GamePage-postButton"
                id = "postButton"
                type="button"
                value="Post!"
                onClick={postStory}
              ></input>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;
