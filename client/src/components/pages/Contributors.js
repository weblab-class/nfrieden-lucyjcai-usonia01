import React, { useState, useEffect } from "react";
import "./GamePage.css";
import { socket } from "../../client-socket";
const Contributors = (props) => {
  // const [writerId, setWriterId] = useState(undefined);
  const [idToNameDict, setIdToNameDict] = useState({});

  // const Updatewriter = (data) => {
  //   console.log("writer:", data);
  //   setWriterId(data);
  // };

  const UpdateDictionary = (data) => {
    console.log("in dictionary:", data);
    setIdToNameDict(data);
  };

  useEffect(() => {
    // socket.on("writer", Updatewriter);
    socket.on("IdToName", UpdateDictionary);
  }, []);

  //   useEffect(() => {
  //     setTimeout(() => {
  //       if (userArray.length !== 0) {
  //         setSelectedIndex((selectedIndex + 1) % userArray.length);
  //       }
  //     }, 6000);
  //     // find a way to communicate to everyone what the new selectedIndex is
  //   }, [selectedIndex, userArray]);

  return (
    <div style={{ flex: 0.8 }}>
      <div style={{ fontWeight: "bold", marginBottom: 5, fontSize: "25px" }}>Contributors</div>
      {props.userArray.map((user, i) => (
        <div style={{ width: "100%", padding: 10, display: "flex", alignItems: "center" }}>
          <span
            style={{
              height: "25px",
              width: "25px",
              // "background-color": userDictionary.color,
              border: "1px solid",
              borderRadius: "50%",
              display: "inline-block",
            }}
          ></span>

          {/* function below controls which name is bolded */}
          {user == idToNameDict[props.writerId] ? (
            <span style={{ fontWeight: 700, marginLeft: 10 }}>{user}</span>
          ) : (
            <span style={{ fontWeight: 500, marginLeft: 10 }}>{user}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Contributors;
