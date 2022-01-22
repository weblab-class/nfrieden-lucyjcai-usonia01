import React, { useState, useEffect } from "react";
import "./GamePage.css";

const Contributors = ({ userArray }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // if (!userArray.length === 0) {
  //   setSelectedIndex((selectedIndex + 1) % userArray.length);
  // }

  useEffect(() => {
    setTimeout(() => {
      if (userArray.length !== 0) {
        setSelectedIndex((selectedIndex + 1) % userArray.length);
      }
    }, 6000);
    // find a way to communicate to everyone what the new selectedIndex is
  }, [selectedIndex, userArray]);

  return (
    <div style={{ flex: 0.8 }}>
      <div style={{ fontWeight: "bold", marginBottom: 5, fontSize: "25px" }}>Contributors</div>
      {userArray.map((user, i) => (
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
          {i == selectedIndex ? (
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
