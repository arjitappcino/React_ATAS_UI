import React, { useState, useEffect } from 'react';
import './ObjectMapBuilder.css'; // Ensure your CSS is adapted for React

const locatorNames = ['Select Locator Type', 'id', 'name', 'className', 'linkText', 'partialLinkText', 'tagName', 'cssSelector', 'xpath'];
const xpathTypes = ['Select XPath Type', 'using attribute', 'using text', 'using contains', 'using starts-with', 'using multiple attributes', 'using index', 'custom'];

function ObjectMapBuilder({ objectMapFile }) {
    const [objectsData, setObjectsData] = useState(() => JSON.parse(sessionStorage.getItem('objectsData')) || []);
    const [objectName, setObjectName] = useState('');
    const [locatorName, setLocatorName] = useState(locatorNames[0]);
    const [locatorValue, setLocatorValue] = useState('');
    const [xpathType, setXpathType] = useState(xpathTypes[0]);
    const [xpathStatement, setXpathStatement] = useState('');
    const [showXpathTypeDropdown, setShowXpathTypeDropdown] = useState(false); // State to show/hide the XPath type dropdown
    const [editIndex, setEditIndex] = useState(null);
    const [showJson, setShowJson] = useState(false);


    useEffect(() => {
        if (objectMapFile) {
            console.log("Processing uploaded object map file in ObjectMapBuilder");
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const fileContent = JSON.parse(e.target.result);
                    console.log("Loaded data from object map file:", fileContent);
                    setObjectsData(Object.entries(fileContent).map(([name, details]) => ({
                        objectName: name,
                        locatorName: details.locator_name,
                        locatorValue: details.locator_value
                    })));
                } catch (error) {
                    console.error("Error parsing object map file:", error);
                    alert("Failed to parse the uploaded file. Please ensure it's a valid JSON.");
                }
            };
            reader.readAsText(objectMapFile);
        }
    }, [objectMapFile]);

    // Save state to sessionStorage when state changes
    useEffect(() => {
        sessionStorage.setItem('objectsData', JSON.stringify(objectsData));
        // console.log("objectData: "+JSON.stringify(objectsData));
    }, [objectsData]);

    const toggleShowJson = () => {
        setShowJson(!showJson);
    };

    const addObject = () => {
        if (!objectName || locatorName === locatorNames[0] || !locatorValue) {
            alert('Please fill in all required fields.');
            return;
        }

        if (editIndex !== null) {
            // Update existing object
            const updatedObjectsData = objectsData.map((item, index) =>
                index === editIndex ? { objectName, locatorName, locatorValue } : item
            );
            setObjectsData(updatedObjectsData);
            setEditIndex(null); // Reset editIndex
        } else {
            // Add new object
            const newObject = { objectName, locatorName, locatorValue };
            setObjectsData([...objectsData, newObject]);
        }
        clearInputs();
    };

    const editObject = (index) => {
        const object = objectsData[index];
        setObjectName(object.objectName);
        setLocatorName(object.locatorName);
        setLocatorValue(object.locatorValue);
        setEditIndex(index); // Set editIndex to the index of the object being edited
    };

    const deleteObject = (index) => {
        setObjectsData(objectsData.filter((_, i) => i !== index));
    };

    const clearInputs = () => {
        setObjectName('');
        setLocatorName(locatorNames[0]);
        setXpathType(xpathTypes[0]);
        setLocatorValue('');
    };

    const handleLocatorNameChange = (event) => {
        const selectedLocatorName = event.target.value;
        setLocatorName(selectedLocatorName);
        if (selectedLocatorName === 'XPath') {
            setShowXpathTypeDropdown(true); // Show XPath dropdown
        } else {
            setShowXpathTypeDropdown(false); // Hide XPath dropdown
            setXpathType(xpathTypes[0]); // Reset XPath type
            setXpathStatement(''); // Reset XPath statement
        }
    };

    const handleXpathTypeChange = (event) => {
        const selectedXpathType = event.target.value;
        setXpathType(selectedXpathType);
        const generatedXpath = generateXpathStatement(selectedXpathType); // Generate XPath statement
        setXpathStatement(generatedXpath);
        setLocatorValue(generatedXpath); // Set locator value to generated XPath
    };

    // Function to generate XPath statement based on type
    const generateXpathStatement = (xpathType) => {
        // Replace with your XPath generation logic
        switch (xpathType) {
            case 'using attribute':
                return "//element[@attribute='value']";
            case 'using text':
                return "//element[text()='some text']";
            // Add more cases as needed
            default:
                return '';
        }
    };

    const downloadJSON = () => {
        const jsonScript = JSON.stringify(
            objectsData.reduce((result, object) => {
                result[object.objectName] = {
                    locator_name: object.locatorName,
                    locator_value: object.locatorValue,
                };
                return result;
            }, {}),
            null,
            2
        );

        const blob = new Blob([jsonScript], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ObjectMap.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const copyJSON = () => {
        const jsonScript = JSON.stringify(
            objectsData.reduce((result, object) => {
                result[object.objectName] = {
                    locator_name: object.locatorName,
                    locator_value: object.locatorValue,
                };
                return result;
            }, {}),
            null,
            2
        );

        navigator.clipboard.writeText(jsonScript)
            .then(() => alert('JSON copied to clipboard!'))
            .catch(err => console.error('Error copying JSON: ', err));
    };

    const resetState = () => {
        setObjectsData([]);
        setObjectName('');
        setLocatorName(locatorNames[0]);
        setLocatorValue('');
        sessionStorage.removeItem('objectsData');
    };

    return (
        <div className="object-map-builder" style={{ marginTop: '55px' }}>
            <div className="input-box">
                <div className="object-form">
                    <label>Object Name <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" value={objectName} onChange={(e) => setObjectName(e.target.value)} />
                </div>
                <div className="object-form">
                    <label>Locator Name <span style={{ color: 'red' }}>*</span></label>
                    <select value={locatorName} onChange={handleLocatorNameChange}>
                        {locatorNames.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                {showXpathTypeDropdown && (
                    <div className="object-form">
                        <label>XPath Type <span style={{ color: 'red' }}>*</span></label>
                        <select value={xpathType} onChange={handleXpathTypeChange}>
                            {xpathTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                )}
                <div className="object-form">
                    <label>Locator Value <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" value={locatorValue} onChange={(e) => setLocatorValue(e.target.value)} placeholder="Generated XPath or enter manually" />
                </div>
                <button onClick={addObject} className="button-74" style={{backgroundColor: 'green'}}>Add Object</button>
                {objectsData.length > 0 && (
                    <table className="object-table">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Object Name</th>
                                <th>Locator Name</th>
                                <th>Locator Value</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {objectsData.map((object, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{object.objectName}</td>
                                    <td>{object.locatorName}</td>
                                    <td>{object.locatorValue}</td>
                                    <td>
                                        <button style={{ marginRight: '10px' }} onClick={() => editObject(index)}>Edit</button>
                                        <button onClick={() => deleteObject(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {showJson && (
                    <div className="json-output">
                        {JSON.stringify(
                            objectsData.reduce((result, object) => {
                                result[object.objectName] = {
                                    locator_name: object.locatorName,
                                    locator_value: object.locatorValue,
                                };
                                return result;
                            }, {}),
                            null,
                            2
                        )}
                    </div>
                )}

                {/* Container for the other buttons */}
                <div className="button-container">
                    <button onClick={toggleShowJson} className="button-74">
                        {showJson ? "Hide JSON" : "Show JSON"}
                    </button>
                    <button onClick={downloadJSON} className="button-74">Download JSON</button>
                    <button onClick={copyJSON} className="button-74">Copy JSON</button>
                    <button onClick={resetState} className="button-74" style={{backgroundColor: 'grey'}}>Reset</button>
                </div>
            </div>
        </div>
    );
}

export default ObjectMapBuilder;
