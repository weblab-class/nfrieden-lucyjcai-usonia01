import React from "react";
import { Link } from "@reach/router";
import "./NavBar.css";
import Skeleton from "../pages/Skeleton";

const GOOGLE_CLIENT_ID = "736706200424-0kf7ogmosqktuuji45om6vavokt7n5m4.apps.googleusercontent.com";
const NavBar = (props) => {
  return (
    <nav className="NavBar-container">
      <div className="Web-title">StoryCollab</div>
      <div className="NavBar-navigations">
        <a href="/" className="NavBar-link">
          <i class="fas fa-home"></i>
        </a>
        <a href="/new_story" className="NavBar-link">
          <i class="fas fa-plus-square"></i>
        </a>

        <a href="/active-story" className="NavBar-link">
          <i class="fas fa-book"></i>
        </a>
        <a href="/" className="NavBar-link">
          <i class="fas fa-bell"></i>
        </a>
        <Skeleton userId={props.userId} />
      </div>
    </nav>
  );
};

export default NavBar;
