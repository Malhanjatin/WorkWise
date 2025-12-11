import React from "react";
import "../components/TopBar.css";
const TopBar = ({ userEmail }) => {
  const date = new Date();
  const formatted = date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <header className="topbar">
      <div className="welcome-topbar">
        <h2>Welcome back !</h2>
        <div className="ws-date">📅 {formatted}</div>
      </div>

      <div className="ws-top-actions">
        <div className="ws-profile">{userEmail || "user@example.com"}</div>
      </div>
    </header>
  );
};

export default TopBar;
