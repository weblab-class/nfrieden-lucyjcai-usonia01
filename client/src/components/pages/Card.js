import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket.js";
import "./Card.css";

const Card = (props) => {
  const [authors, setAuthors] = useState([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const UpdateLike = (data) => {
    console.log("we winnnnnnn");
    if (data.storycode === props.code) {
      setLikes(data.likes);
    }
  };

  const UpdateDislike = (data) => {
    if (data.storycode === props.code) {
      setLikes(data.likes);
    }
  };
  useEffect(() => {
    socket.on("like", UpdateLike);
    socket.on("dislike", UpdateDislike);
  }, []);

  const likePost = () => {
    setLiked(true);
    post("/api/post-likes", { code: props.code });
    console.log("liking!");
  };

  const dislikePost = () => {
    setLiked(false);
    post("/api/withdraw-likes", { code: props.code });
    console.log("disliking!");
  };

  useEffect(() => {
    get("/api/contributors-list", { code: props.code }).then((contributors) => {
      setAuthors(contributors);
    });
    get("/api/get-likes", { code: props.code }).then((res) => {
      console.log("result likes: ", res);
      let likess = parseInt(res);
      // console.log("here are the types of likess: ", typeof(likess));
      setLikes(likess);
    });
    get("/api/get-liked", { code: props.code }).then((res) => {
      // console.log("res is: ", res);
      if (res === true) {
        // console.log("now lets setLiked to true");
        setLiked(true);
        // console.log(liked);
      }
      // setLiked(res);
      // console.log("the liked boolean for this story is: ", liked);
    });
  }, []);

  useEffect(() => {
    console.log(liked);
  }, [liked]);

  return (
    <>
      <div className="Card-container">
        <div className="Card-title">
          {props.title}

          {liked ? (
            <button className="Card-xmark" onClick={dislikePost}>
              {likes} <i className="fas fa-heart"></i>
            </button>
          ) : (
            <button className="Card-checkmark" onClick={likePost}>
              {likes} <i className="far fa-heart"></i>
            </button>
          )}
        </div>
        <div className="Card-authors">by {authors.join(", ")}</div>
        <br></br>
        <div className="Card-content">{props.content}</div>
      </div>
    </>
  );
};

export default Card;
