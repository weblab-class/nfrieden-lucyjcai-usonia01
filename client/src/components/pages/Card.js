import React, {useState, useEffect} from "react";
import { get, post } from "../../utilities";
import "./Card.css";

const Card = (props) => {
  const [authors, setAuthors] = useState([]);
  const[likes, setLikes] = useState(0);

  const addLike = () => {
    console.log("added a like");
    // post("/api/post-likes", {code: props.code});
    console.log(likes);
  }

  useEffect(() => {
    get("/api/contributors", {code: props.code}).then((contributors) => {
      setAuthors(contributors);
    })
    // get("/api/get-likes", {code: props.code}).then((res) => {
    //   setLikes(res.likes);
    // })
  }, []);
  
    return (
      <>
        <div className="Card-container">
          <div className="Card-title">
            {props.title}
            <button className="Card-heart" onClick={addLike}>
              {likes} <i class="far fa-heart"></i>
            </button>
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
  