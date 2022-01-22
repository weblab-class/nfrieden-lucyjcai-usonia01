import React, {useState, useEffect} from "react";
import { get, post } from "../../utilities";
import "./Card.css";

const Card = (props) => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    get("/api/contributors", {code: props.code}).then((contributors) => {
      setAuthors(contributors);
    })
  }, []);
  
    return (
      <>
        <div className="Card-container">
          <div className="Card-title">
            {props.title}
          </div>
          <div className="Card-authors">
            by {authors}
          </div>
          <br></br>
          <div className="Card-content">{props.content}</div>
          {/* <Link to="/ViewStory/{storyId}"> */}
            {/* <button> view story </button> */}
          {/* </Link> */}
        </div>
      </>
    );
  };
  
export default Card;
  