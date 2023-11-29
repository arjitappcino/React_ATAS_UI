import React, { useState } from 'react';
import './TestScriptBuilder.css'; // Make sure to create this CSS file

function TestScriptBuilder() {
    // State to store input values
    const [testsuiteName, setTestsuiteName] = useState('');
    const [testsuiteOwner, setTestsuiteOwner] = useState('');
    const [objectMapExternal, setObjectMapExternal] = useState('');
    const [variableMapExternal, setVariableMapExternal] = useState('');
    const [generatedJson, setGeneratedJson] = useState('');

    // Function to generate JSON
    const generateJson = () => {
        const jsonScript = JSON.stringify({
            testifact_info: {
                testsuite_name: testsuiteName,
                testsuite_owner: testsuiteOwner,
                object_map_external: objectMapExternal,
                variable_map_external: variableMapExternal
            }
        }, null, 2); // Beautify the JSON output
        setGeneratedJson(jsonScript);
    };

    return (
        <div className="test-script-builder-container">
            <div className="input-section">
                <form>
                    <label>
                        Test Suite Name:
                        <input type="text" value={testsuiteName} onChange={(e) => setTestsuiteName(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Test Suite Owner:
                        <input type="text" value={testsuiteOwner} onChange={(e) => setTestsuiteOwner(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Object Map External:
                        <input type="text" value={objectMapExternal} onChange={(e) => setObjectMapExternal(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Variable Map External:
                        <input type="text" value={variableMapExternal} onChange={(e) => setVariableMapExternal(e.target.value)} />
                    </label>
                    <br />
                    <button type="button" onClick={generateJson}>Generate JSON</button>
                </form>
            </div>
            <div className="json-display-section">
                {generatedJson && (
                    <div>
                        <h3>Generated JSON:</h3>
                        <pre>{generatedJson}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TestScriptBuilder;
