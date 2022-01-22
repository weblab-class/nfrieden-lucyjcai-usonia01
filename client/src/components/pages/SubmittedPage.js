import React, {useState} from "react";
import "./SubmittedPage.css";
import { get, post } from "../../utilities";

const SubmittedPage = (props) => {
  const [title, setTitle] = useState("");

  const onChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (event) => {
    console.log("code and title respectively are: ", props.code, title);
    post("/api/set-title", { code: props.code, title: title}).then(
      console.log("yay this worked! :)) story title is ", title));
    event.preventDefault();
    setTitle("");
  };

    return (
      <>

      <div className="SubmittedPage-title">
        Congrats on finishing your story!
      </div>
      <div className="SubmittedPage-subtitle">
        Now, a pick a name for it:
      </div>
      <div className="SubmittedPage-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={onChange}
            className="Code-Box"
            placeholder="Story title"
            value={title}
          ></input>
          <div className="Code-submit">
            <button>Submit!</button>
          </div>
          <div className="conclusion">
            Once you're done, head over to the 
            <br></br>Homepage to view your story!
          </div>
        </form>
        <div>
        </div>
      </div>
      </>
    );
  };
  
  export default SubmittedPage;
  