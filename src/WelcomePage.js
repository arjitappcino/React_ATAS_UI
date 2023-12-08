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
    const [variableMapError, setVariableMapError] = useState(false);
    const [objectMapError, setObjectMapError] = useState(false);


    const handleNewClick = () => {
        setShowModal(true);
    };

    const validateVariableMapJSON = (json) => {
        for (let key in json) {
            if (typeof key !== 'string') {
                return `Key '${key}' should be a string. Invalid Variable Map JSON. Fix it.`;
            }
            if (typeof json[key] !== 'string') {
                return `Value for key '${key}' should be a string. Invalid Variable Map JSON. Fix it.`;
            }
        }
        return null; // JSON is valid
    };

    const validateObjectMapJSON = (json) => {
        const expectedValueType = { locator_name: 'string', locator_value: 'string' };

        for (let key in json) {
            if (typeof key !== 'string') {
                return `Key '${key}' should be a string. Invalid Object Map JSON. Fix it.`;
            }

            const value = json[key];
            if (typeof value !== 'object') {
                return `Value for key '${key}' should be an object. Invalid Object Map JSON. Fix it.`;
            }

            for (let prop in expectedValueType) {
                if (!value.hasOwnProperty(prop) || typeof value[prop] !== expectedValueType[prop]) {
                    return `Key '${key}' should have a property '${prop}' of type ${expectedValueType[prop]}. Invalid Object Map JSON. Fix it.`;
                }
            }
        }
        return null;
    };

    const handleVariableMapChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const fileContent = JSON.parse(e.target.result);
                    const validationResult = validateVariableMapJSON(fileContent);
                    if (validationResult) {
                        setVariableMapError(validationResult); // Set the validation error message
                        setVariableMapUploaded(false);
                    } else {
                        setVariableMapFile(event.target.files[0]);
                        setVariableMapUploaded(true);
                        setVariableMapError(false);
                    }
                } catch (error) {
                    setVariableMapError('Invalid JSON format.');
                    setVariableMapUploaded(false);
                }
            };
            reader.readAsText(event.target.files[0]);
        } else {
            setVariableMapUploaded(false);
        }
    };

    const handleObjectMapChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const fileContent = JSON.parse(e.target.result);
                    const validationResult = validateObjectMapJSON(fileContent);
                    if (validationResult) {
                        setObjectMapError(validationResult); // Set the validation error message
                        setObjectMapUploaded(false);
                    } else {
                        setObjectMapFile(event.target.files[0]);
                        setObjectMapUploaded(true);
                        setObjectMapError(false);
                    }
                } catch (error) {
                    setObjectMapError('Invalid JSON format');
                    setObjectMapUploaded(false);
                }
            };
            reader.readAsText(event.target.files[0]);
        } else {
            setObjectMapUploaded(false);
        }
    };
    
    const startScripting = () => {
        setVariableMapError(false);
        setObjectMapError(false);
        // Check for files only if the corresponding "Yes" was selected
        if (hasVariableMap && !variableMapFile) {
            if (hasObjectMap && !objectMapFile) {
                setObjectMapError(true); // Set error state for object map
            }
            setVariableMapError(true); // Set error state for variable map
            return; // Stop the function from proceeding further
        }
        if (hasObjectMap && !objectMapFile) {
            setObjectMapError(true); // Set error state for object map
            return; // Stop the function from proceeding further
        }
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

    const closeModal = () => {
        // Reset the error messages when closing the modal
        setVariableMapError(false);
        setObjectMapError(false);
        setHasVariableMap(false);
        resetFileSelection('variable');
        setHasObjectMap(false);
        resetFileSelection('object');
        // Close the modal
        setShowModal(false);
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
                        <span className="close" onClick={closeModal}>&times;</span>
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
                                        {variableMapError && (
                                            <p className="error-message">{variableMapError}</p>
                                        )}
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
                                        {objectMapError && (
                                            <p className="error-message">{objectMapError}</p>
                                        )}
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
