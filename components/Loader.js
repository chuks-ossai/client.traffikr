import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "#0006",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="spinner-grow text-primary"
        role="loading"
        style={{ width: "5rem", height: "5rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
