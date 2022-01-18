import React, { useState, useEffect } from "react";
import { Link, Router } from "@reach/router";


const Lobby = () => {
    return (
        <>
        <div>
            This is the lobby hi
        </div>
        <div>
            <Link to="/gamepage">
                <button>
                    start game
                </button>
            </Link>
        </div>
        </>
    );
};


export default Lobby;