import React, { useState, useEffect } from "react";
import { Link, Router } from "@reach/router";
import GamePage from "../pages/GamePage";
import "./joinAuth.css";
import { get, post } from "../../utilities";

const Join = () => {
  const [code, setCode] = useState("");

  const handleSubmit = (event) => {
    get("/api/search", { code: code }).then((result) => {
      if (!result.length == 0) {
        window.location.href = `/gamepage/${code}`;
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
      <form onSubmit={handleSubmit}>
        <div className="Game-Code">
          <label>Game Code</label>
          <input
            type="text"
            minLength="5"
            onChange={onChange}
            className="Code-Box"
            placeholder="Game code"
          ></input>
        </div>
        <div className="Code-submit">
          <button>Submit!</button>
        </div>
      </form>
    </div>
  );
};

export default Join;
