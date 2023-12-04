import React, { useState, useEffect } from 'react';
import './VariableMapBuilder.css';

function VariableMapBuilder() {
    const [variables, setVariables] = useState(() => {
        const savedVariables = sessionStorage.getItem('variables');
        return savedVariables ? JSON.parse(savedVariables) : {};
    });
    const [variableName, setVariableName] = useState('');
    const [variableValue, setVariableValue] = useState('');

    useEffect(() => {
        sessionStorage.setItem('variables', JSON.stringify(variables));
    }, [variables]);

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

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <div className="form-container">
                <div className="variable">
                    <label>Variable Name</label>
                    <input type="text" value={variableName} onChange={(e) => setVariableName(e.target.value)} />
                </div>
                <div className="variable" style={{ marginLeft: '20px' }}>
                    <label>Variable Value</label>
                    <input type="text" value={variableValue} onChange={(e) => setVariableValue(e.target.value)} />
                </div>
                <button className="button-74" onClick={addVariable} style={{ marginTop: '10px', marginLeft: '20px' }}>Add Variable</button>
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
            <div>
                <pre>{JSON.stringify(variables, null, 2)}</pre>
                <button className="button-74" onClick={downloadJSON}>Download JSON</button>
                <button className="button-74" onClick={copyJSON} style={{ marginLeft: '10px' }}>Copy JSON</button>
            </div>
        </div>
    );
}

export default VariableMapBuilder;
