import React from 'react';
import './WelcomePage.css'; // Make sure to create this CSS file

function WelcomePage({ onNewClick }) {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Test Script Builder</h1>
        <p>Choose a better way to work on your test scripts.</p>
        <div className="welcome-buttons">
          <button onClick={onNewClick} className="welcome-button new-script">New Script</button>
          <button disabled className="welcome-button existing-script">Existing Script</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
