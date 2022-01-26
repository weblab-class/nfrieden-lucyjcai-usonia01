import React, {useState, useEffect} from "react";
import { get, post } from "../../utilities";
import "./Card.css";

const Card = (props) => {
  const [authors, setAuthors] = useState([]);
  const[likes, setLikes] = useState(0);
  const[liked, setLiked] = useState(false);


  const likePost = () => {
    setLiked(true);
    post("/api/post-likes", {code: props.code});
    console.log("liking!");
  };

  const dislikePost = () => {
    setLiked(false);
    post("/api/withdraw-likes", {code: props.code});
    console.log("disliking!");
  };

  useEffect(() => {
    get("/api/contributors-list", {code: props.code}).then((contributors) => {
      setAuthors(contributors)
    })
    get("/api/get-likes", {code: props.code}).then((res) => {
      let likess = parseInt(res);
      console.log("here are the types of likess: ", typeof(likess));
      setLikes(likess);
    });
    get("/api/get-liked", {code: props.code}).then((res) => {
      setLiked(res);
      console.log(liked);
    })
  }, []);
  
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
          <div className="Card-authors">
            by {authors}
          </div>
          <br></br>
          <div className="Card-content">{props.content}</div>
        </div>
      </>
    );
  };
  
export default Card;
  