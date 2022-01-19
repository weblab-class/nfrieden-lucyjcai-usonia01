import React, { useState, useEffect } from "react";
import { Link, Router } from "@reach/router";
import "./Lobby.css";

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}


const Lobby = () => {
  return (
    <>
      {/* We need to make the functionality of each of the button have not yet been implemented */}
      <div className="Lobby-Container">
        <Link to="/waitingroom">
            <button className="Lobby-Options">Create a new story!</button>
        </Link>
        <button className="Lobby-Options">Join a created story!</button>
      </div>
    </>
  );
};

export default Lobby;
