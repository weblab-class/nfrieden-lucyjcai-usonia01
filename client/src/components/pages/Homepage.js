import React from "react";
import "./Homepage.css";

const HomePage = () => {
  // const [content, setContent] = useState([]);

  // const
  return (
    <div className="Home-Container">
      <div style={{ flex: 0.5 }}>
        <input
          className="Home-Options"
          type="button"
          value="Create a new story!"
          // onClick={addNewSentence}
        ></input>
      </div>
      <div style={{ flex: 0.5 }}>
        <input
          className="Home-Options"
          type="button"
          value="Join a created story!"
          // onClick={addNewSentence}
        ></input>
      </div>
    </div>
  );
};

export default HomePage;
