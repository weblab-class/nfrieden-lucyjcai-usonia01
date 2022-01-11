import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./Skeleton.css";

const GOOGLE_CLIENT_ID = "736706200424-0kf7ogmosqktuuji45om6vavokt7n5m4.apps.googleusercontent.com";

const Skeleton = ({ userId, handleLogin, handleLogout }) => {
  return (
    <>
      {userId ? (
        <GoogleLogout
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Logout"
          onLogoutSuccess={handleLogout}
          onFailure={(err) => console.log(err)}
        />
      ) : (
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Login"
          onSuccess={handleLogin}
          onFailure={(err) => console.log(err)}
        />
      )}
      <h1>Good luck on your project :)</h1>
      <h2>How to go from this skeleton to our actual app</h2>
      <a href="http://weblab.to/get-started">Check out this getting started guide</a>
    </>
  );
};

export default Skeleton;
