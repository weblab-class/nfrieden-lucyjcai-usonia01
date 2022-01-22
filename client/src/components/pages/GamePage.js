import React, { useState, useEffect } from "react";
import "./GamePage.css";
import StorySentence from "./StorySentence";
import Contributors from "./Contributors";
import { get, post } from "../../utilities";
import { Link, Router } from "@reach/router";

const GamePage = (props) => {
  const [count, setCount] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [inputText, setInputText] = useState("");
  // const [storyId, setStoryId] = useState(undefined);
  const [existing, setExisting] = useState(false);
  const [endGameVote, setEndGameVote] = useState(false);

  const [userArray, setUserArray] = useState([]);

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
  };

  const voteOnGameState = () => {
    if (endGameVote === true) {
      setEndGameVote(false);
    } else {
      setEndGameVote(true);
    }
    console.log(endGameVote);
  };

  const postStory = () => {
    setEndGameVote(true);
    post("/api/vote-to-end").then(
      console.log("user has voted to end! these are the contributors: ", userArray)
    );
    get("/api/voters", { code: props.code }).then((votes) => {
      console.log("these are contributors:", votes);
      let numberOfVotes = 0;
      for (let i = 0; i < votes.length; i++) {
        if (votes[i] === true) {
          numberOfVotes++;
        }
      }
      console.log("numberOfVotes: ", numberOfVotes);
      if (numberOfVotes > votes.length / 2) {
        console.log("hehe vote passed");
        post("/api/post-story", { code: props.code }).then(
          (window.location.href = `/SubmittedPage/${props.code}`)
        );
      }
    });
  };

  const enableTurn = () => {
    document.getElementById("submitButton").disabled = false;
  };
  // story so far
  useEffect(() => {
    let stories = [];
    // console.log(props.code);
    get("/api/search", { code: props.code }).then((res) => {
      // console.log("checking if search successful");
      // console.log(res);
      if (!res.length == 0) {
        // console.log("story content ...");
        // console.log(res.content);
        // console.log("<<>>");
        stories.push(res[0].content);
        // setExisting(true);

        get("/api/contributors", { code: props.code }).then((result) => {
          setUserArray(result);
        });
      } else {
        post("/api/new_story", { code: props.code, content: "" }).then(() => {
          get("/api/contributors", { code: props.code }).then((result) => {
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
        <div style={{ flexDirection: "row", display: "flex" }}>
          {/* This function defines the additive text space*/}
          <div className="item test" style={{ flex: 0.7 }}>
            {sentences.length > 0
              ? sentences.map((sentences, index) => (
                  <StorySentence key={index * 2465343} content={sentences} />
                ))
              : "Your changing story will appear here..."}
          </div>

          {/* This function is very messy but it makes the dots on the side */}
          <div style={{ flex: 0.3, paddingLeft: 30, paddingRight: 20 }}>
            <div style={{ flexDirection: "column", display: "flex", height: "100%" }}>
              {/* Contributors Bar*/}
              {console.log(`user arr: ${userArray}`)}
              <Contributors userArray={userArray} />

              {/* Vote to end game */}
              <div style={{ flex: 0.2 }}>
                <div style={{ fontWeight: "bold", marginBottom: 5, fontSize: "20px" }}>
                  vote to end game:
                  {endGameVote ? (
                    <button className="checkmark" onClick={voteOnGameState}>
                      <i class="fas fa-check-square fa-3x"></i>
                    </button>
                  ) : (
                    <button className="xmark" onClick={postStory}>
                      <i class="fas fa-times-circle fa-3x"></i>
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
          <div className="Add" style={{ flex: 0.7 }}>
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
            <div style={{ flex: 0.3 }}>
              <input
                className="item GamePage-addButton"
                id="submitButton"
                type="button"
                value="Add!"
                onClick={addNewSentence}
                // disabled
              ></input>
            </div>
            <div style={{ padding: 24, flex: 0.3 }}>
              <Link to="/SubmittedPage">
                {/* <input
                className="item GamePage-postButton"
                id = "postButton"
                type="button"
                value="Post!"
                onClick={postStory}
              ></input> */}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;
