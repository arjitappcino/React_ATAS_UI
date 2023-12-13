import React, { useState, useEffect } from 'react';
import './VariableMapBuilder.css';

function VariableMapBuilder({ variableMapFile }) {
    const [variables, setVariables] = useState(() => {
        const savedVariables = sessionStorage.getItem('variables');
        return savedVariables ? JSON.parse(savedVariables) : {};
    });
    const [variableName, setVariableName] = useState('');
    const [variableValue, setVariableValue] = useState('');
    const [showJson, setShowJson] = useState(false);

    useEffect(() => {
        if (variableMapFile) {
            console.log("Processing uploaded variable map file in VariableMapBuilder");
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const fileContent = JSON.parse(e.target.result);
                    console.log("Loaded data from variable map file:", fileContent);
                    setVariables(fileContent);
                } catch (error) {
                    console.error("Error parsing variable map file:", error);
                    alert("Failed to parse the uploaded file. Please ensure it's a valid JSON.");
                }
            };
            reader.readAsText(variableMapFile);
        }
    }, [variableMapFile]);

    useEffect(() => {
        sessionStorage.setItem('variables', JSON.stringify(variables));
        // console.log("variableObjects: "+JSON.stringify(variables));
    }, [variables]);

    const toggleShowJson = () => {
        setShowJson(!showJson);
    };

    const addVariable = () => {
        if (variableName === '' || variableValue === '') {
            alert('Please enter both Variable Name and Variable Value.');
            return;
        }
        setVariables({ ...variables, [variableName]: variableValue });
        setVariableName('');
        setVariableValue('');
    };

    const deleteVariable = (name) => {
        const updatedVariables = { ...variables };
        delete updatedVariables[name];
        setVariables(updatedVariables);
    };

    const editVariable = (name) => {
        const newValue = prompt(`Edit value for ${name}:`, variables[name]);
        if (newValue !== null) {
            setVariables({ ...variables, [name]: newValue });
        }
    };

    const downloadJSON = () => {
        const jsonData = JSON.stringify(variables, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'variableMap.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyJSON = () => {
        navigator.clipboard.writeText(JSON.stringify(variables, null, 2))
            .then(() => alert('JSON copied to clipboard!'))
            .catch(err => console.error('Error copying JSON: ', err));
    };

    const resetState = () => {
        setVariables({});
        sessionStorage.removeItem('objectsData');
    };

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <div className="form-container">
                <div className="variable">
                    <label>Variable Name</label>
                    <input type="text" value={variableName} onChange={(e) => setVariableName(e.target.value)} />
                </div>
                <div className="variable">
                    <label>Variable Value</label>
                    <input type="text" style={{ marginLeft: '4px' }} value={variableValue} onChange={(e) => setVariableValue(e.target.value)} />
                </div>
                <button className="button-74" onClick={addVariable} style={{backgroundColor: 'green'}}>Add Variable</button>
            </div>
            {Object.keys(variables).length > 0 && (
                <table className="variable-table">
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Variable Name</th>
                            <th>Variable Value</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(variables).map(([name, value], index) => (
                            <tr key={name}>
                                <td>{index + 1}</td>
                                <td>{name}</td>
                                <td>{value}</td>
                                <td><button onClick={() => editVariable(name)}>Edit</button></td>
                                <td><button onClick={() => deleteVariable(name)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {showJson && (
                    <pre>{JSON.stringify(variables, null, 2)}</pre>
                )}
            <div className='button-container'>
                <button onClick={toggleShowJson} className="button-74">
                    {showJson ? "Hide JSON" : "Show JSON"}
                </button>
                <button className="button-74" onClick={downloadJSON}>Download JSON</button>
                <button className="button-74" onClick={copyJSON}>Copy JSON</button>
                <button onClick={resetState} className="button-74" style={{backgroundColor: 'grey'}}>Reset</button>
            </div>
        </div>
    );
}

export default VariableMapBuilder;
