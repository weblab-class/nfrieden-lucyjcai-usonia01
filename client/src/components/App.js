import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import NavBar from "./modules/NavBar.js";
import GamePage from "./pages/GamePage.js";
import ActiveStory from "./pages/ActiveStory.js";
import HomePage from "./pages/Homepage.js";
import Lobby from "./pages/Lobby.js";
import Join from "./pages/JoinAuth";
import WaitingRoom from "./pages/WaitingRoom.js";
import SubmittedPage from "./pages/SubmittedPage.js";
import ViewStory from "./pages/ViewStory.js";
// import MyStory from "./pages/Mystories.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <>
      <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
      <div>
        <Router>
          <Lobby path="/new_story" />
          <Join path="/join" />
          <WaitingRoom path="/waitingroom" />
          <GamePage path="/gamepage/:code" />
          {/* <ViewStory path="/ViewStory/:storyId" /> */}
          <HomePage path="/" />

          <ActiveStory path="/active-story" />
          <SubmittedPage path="/SubmittedPage/:code" />
          <NotFound default />
        </Router>
      </div>
    </>
  );
};

export default App;
