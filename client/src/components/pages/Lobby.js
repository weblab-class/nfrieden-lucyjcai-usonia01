import React, { useState, useEffect } from "react";
import { Link, Router } from "@reach/router";
import "./Lobby.css";

const Lobby = () => {
  return (
    <>
      {/* We need to make the functionality of each of the button have not yet been implemented */}
      <div className="Lobby-Container">
        <button className="Lobby-Options">Create a new story!</button>
        <button className="Lobby-Options">Join a created story!</button>
      </div>
    </>
  );
};

export default Lobby;
