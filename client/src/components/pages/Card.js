import React from "react";
import "./Card.css";

const Card = (props) => {
  
    return (
      <>
        <div className="Card-container">
          <div className="Card-title">
            Story id: {props.storyId} | contributers: | date created: 
          </div>
          <span>{props.content}</span>
          {/* <Link to="/ViewStory/{storyId}"> */}
            {/* <button> view story </button> */}
          {/* </Link> */}
        </div>
      </>
    );
  };
  
export default Card;
  