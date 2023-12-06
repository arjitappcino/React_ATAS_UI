import React, { useState } from 'react';
import './WelcomePage.css'; // Import the CSS file for styling
import checkmark from './checkmark.svg';

function WelcomePage({ onNewClick }) {
    const [showModal, setShowModal] = useState(false);
    const [hasVariableMap, setHasVariableMap] = useState(false);
    const [variableMapFile, setVariableMapFile] = useState(null);
    const [variableMapUploaded, setVariableMapUploaded] = useState(false);
    const [hasObjectMap, setHasObjectMap] = useState(false); // New state for object map
    const [objectMapFile, setObjectMapFile] = useState(null);
    const [objectMapUploaded, setObjectMapUploaded] = useState(false);


    const handleNewClick = () => {
        setShowModal(true);
    };

    const handleVariableMapChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setVariableMapFile(event.target.files[0]);
            setVariableMapUploaded(true); // Set uploaded state to true
        } else {
            setVariableMapUploaded(false); // Reset uploaded state
        }
    };

    const handleObjectMapChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setObjectMapFile(event.target.files[0]);
            setObjectMapUploaded(true); // Set uploaded state to true
        } else {
            setObjectMapUploaded(false); // Reset uploaded state
        }
    };

    const startScripting = () => {
        setShowModal(false);
        // Pass both the variable map and object map files to parent for processing
        onNewClick(variableMapFile, objectMapFile);
    };

    const resetFileSelection = (mapType) => {
        if (mapType === 'variable') {
            setVariableMapFile(null);
            setVariableMapUploaded(false);
        } else if (mapType === 'object') {
            setObjectMapFile(null);
            setObjectMapUploaded(false);
        }
    };

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Welcome to Test Script Builder</h1>
                <p>Choose a better way to work on your test scripts.</p>
                <div className="welcome-buttons">
                    <button onClick={handleNewClick} className="welcome-button new-script">New Script</button>
                    <button disabled className="welcome-button existing-script">Existing Script</button>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Start New Script</h2>
                        <div className="radio-options-container">
                            <div className="radio-group">
                                <label>Existing Variable Map?</label>
                                <label>
                                    <input
                                        type="radio"
                                        name="variableMapChoice"
                                        onChange={() => setHasVariableMap(true)}
                                    />
                                    Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="variableMapChoice"
                                        defaultChecked
                                        onChange={() => {
                                            setHasVariableMap(false);
                                            resetFileSelection('variable'); // Call reset when "No" is selected
                                        }}
                                    />
                                    No
                                </label>
                                {hasVariableMap && (
                                    <div className="file-upload">
                                        <input
                                            type="file"
                                            onChange={handleVariableMapChange}
                                        />
                                        {variableMapUploaded && <img src={checkmark} alt="Uploaded" />}
                                    </div>
                                )}
                            </div>
                            <div className="radio-group">
                                <label>Existing Object Map?&nbsp;&nbsp;</label>
                                <label>
                                    <input
                                        type="radio"
                                        name="objectMapChoice"
                                        onChange={() => setHasObjectMap(true)}
                                    />
                                    Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="objectMapChoice"
                                        defaultChecked
                                        onChange={() => {
                                            setHasObjectMap(false);
                                            resetFileSelection('object'); 
                                        }}
                                    />
                                    No
                                </label>
                                {hasObjectMap && (
                                    <div className="file-upload">
                                        <input
                                            type="file"
                                            onChange={handleObjectMapChange}
                                        />
                                         {objectMapUploaded && <img src={checkmark} alt="Uploaded" />}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button className="start-scripting" onClick={startScripting}>Start Scripting</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WelcomePage;
