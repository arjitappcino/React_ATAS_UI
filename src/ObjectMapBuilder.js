import React, { useState, useEffect } from 'react';
import './ObjectMapBuilder.css'; // Ensure your CSS is adapted for React

const locatorNames = ['Select Locator Type', 'ID', 'Name', 'ClassName', 'LinkText', 'Partial LinkText', 'TagName', 'CssSelector', 'XPath'];
const xpathTypes = ['Select XPath Type', 'using attribute', 'using text', 'using contains', 'using starts-with', 'using multiple attributes', 'using index', 'custom'];

function ObjectMapBuilder() {
    const [objectsData, setObjectsData] = useState(() => JSON.parse(sessionStorage.getItem('objectsData')) || []);
    const [objectName, setObjectName] = useState('');
    const [locatorName, setLocatorName] = useState(locatorNames[0]);
    const [locatorValue, setLocatorValue] = useState('');
    const [xpathType, setXpathType] = useState(xpathTypes[0]);

    // Save state to sessionStorage when state changes
    useEffect(() => {
        sessionStorage.setItem('objectsData', JSON.stringify(objectsData));
    }, [objectsData]);

    const addObject = () => {
        if (!objectName || locatorName === locatorNames[0] || !locatorValue) {
            alert('Please fill in all required fields.');
            return;
        }

        const newObject = { objectName, locatorName, locatorValue };
        setObjectsData([...objectsData, newObject]);
        clearInputs();
    };

    const editObject = (index) => {
        const object = objectsData[index];
        setObjectName(object.objectName);
        setLocatorName(object.locatorName);
        setLocatorValue(object.locatorValue);
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

    const handleLocatorNameChange = (name) => {
        setLocatorName(name);
        if (name === 'XPath') {
            setXpathType(xpathTypes[1]); // default to first XPath type
        } else {
            setXpathType(xpathTypes[0]);
            setLocatorValue('');
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
                    <select value={locatorName} onChange={(e) => setLocatorName(e.target.value)}>
                        {locatorNames.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                <div className="object-form">
                    <label>Locator Value <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" value={locatorValue} onChange={(e) => setLocatorValue(e.target.value)} />
                </div>
                <button onClick={addObject} className="button-74">Add Object</button>
                <div className="object-container">
                    {objectsData.map((object, index) => (
                        <div key={index} className="object-item">
                            <div><strong>Object {index + 1}:</strong> {object.objectName}</div>
                            <div><strong>Locator Name:</strong> {object.locatorName}</div>
                            <div><strong>Locator Value:</strong> {object.locatorValue}</div>
                            <button onClick={() => editObject(index)} className="button-74">Edit</button>
                            <button onClick={() => deleteObject(index)} className="button-74">Delete</button>
                        </div>
                    ))}
                </div>
                <div className="json-output">{JSON.stringify(
                    objectsData.reduce((result, object) => {
                        result[object.objectName] = {
                            locator_name: object.locatorName,
                            locator_value: object.locatorValue,
                        };
                        return result;
                    }, {}),
                    null,
                    2
                )}</div>
                <button onClick={downloadJSON} className="button-74">Download JSON</button>
                <button onClick={copyJSON} className="button-74">Copy JSON</button>
                <button onClick={resetState} className="button-74">Reset</button>
            </div>
        </div>
    );
}

export default ObjectMapBuilder;
