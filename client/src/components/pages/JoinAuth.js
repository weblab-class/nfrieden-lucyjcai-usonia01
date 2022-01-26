import React, { useState, useEffect } from "react";
import { Link, Router } from "@reach/router";
import GamePage from "../pages/GamePage";
import "./JoinAuth.css";
import { get, post } from "../../utilities";

const Join = () => {
  const [code, setCode] = useState("");

  const handleSubmit = (event) => {
    get("/api/search", { code: code }).then((result) => {
      if (result.length !== 0) {
        post("/api/Update-story", { code: code }).then(
          (window.location.href = `/gamepage/${code}`)
        );
      } else {
        alert("Invalid Game Code");
      }
    });

    event.preventDefault();
  };

  const onChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <div className="Code-Form">
      <form className="Game-Code" onSubmit={handleSubmit}>
        <div className="Code-instructions">Enter a valid game code below:</div>
        <div className="submit">
          <input
            type="text"
            minLength="5"
            onChange={onChange}
            className="Code-Box"
            placeholder="Game code"
          ></input>
        </div>
        <button className="Code-submit">Submit!</button>
      </form>
    </div>
  );
};

export default Join;
