import React, { useState, useEffect } from "react";
import { Link, Router } from "@reach/router";
import Lobby from "./Lobby.js";
import "./WaitingRoom.css";
import GamePage from "./GamePage.js";
import { post } from "../../utilities.js";

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// const existing = false;
const code = makeid(5);

// const startgame = () => {
//   console.log(code);
//   // console.log(existing);
//   return <GamePage  code={code} />;
// };
const WaitingRoom = () => {
  // useEffect(() => {}, []);

  return (
    <>
      <div className="WaitingRoom-title">Waiting Room</div>
      <div className="WaitingRoom-Container">
        Your game code is: {code}
        <div>Current players: Lucy Cai Nadia Frieden Sonia Uwase</div>
        <div>
          <Link to={`/gamepage/${code}`}>
            <button>Start Game</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default WaitingRoom;
