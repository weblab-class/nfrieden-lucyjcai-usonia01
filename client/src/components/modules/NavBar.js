import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import "./NavBar.css";
import Skeleton from "../pages/Skeleton";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { get, post } from "../../utilities";

const GOOGLE_CLIENT_ID = "736706200424-0kf7ogmosqktuuji45om6vavokt7n5m4.apps.googleusercontent.com";
const NavBar = (props) => {
  return (
    <nav className="NavBar-container">
      <div className="Web-title">feather &amp; ink</div>
      <div className="NavBar-navigations">
        <a href="/" className="NavBar-link">
          <i className="fas fa-home"></i>
        </a>
        <a href="/new_story" className="NavBar-link">
          <i className="fas fa-plus-square"></i>
        </a>

        <a href="/active-story" className="NavBar-link">
          <i className="fas fa-book"></i>
        </a>
        {/* <a href="/" className="NavBar-link">
          <i className="fas fa-bell"></i>
        </a> */}

        {/* <Skeleton userId={props.userId} handleLogin={props.handleLogin} handleLogout={props.handleLogout} /> */}
      </div>
      <span className="Login">
        {props.userId ? (
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={props.handleLogout}
            onFailure={(err) => console.log(err)}
          />
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={props.handleLogin}
            onFailure={(err) => console.log(err)}
          />
        )}
      </span>
    </nav>
  );
};

export default NavBar;
