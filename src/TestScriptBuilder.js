import React, { useState } from 'react';
import './TestScriptBuilder.css'; // Ensure you have this CSS file for styles

function TestScriptBuilder() {

    const [showModal, setShowModal] = useState(false);
    const [finalJSON, setFinalJSON] = useState('');
    // State for the test suite information
    const [testSuite, setTestSuite] = useState({
        testsuite_name: '',
        testsuite_owner: '',
        object_map_external: '',
        variable_map_external: ''
    });

    // State for the test case information
    const [testCase, setTestCase] = useState({
        test_name: '',
        description: '',
        execute: 'yes' // or 'no'
    });

    // State for the test action information
    const [testAction, setTestAction] = useState({
        action_type: '',
        action_name: '',
        browser_name: ''
    });

    // Handlers for input changes
    const handleTestSuiteChange = (e) => {
        const { name, value } = e.target;
        setTestSuite({ ...testSuite, [name]: value });
    };

    const handleTestCaseChange = (e) => {
        const { name, value } = e.target;
        setTestCase({ ...testCase, [name]: value });
    };

    const handleTestActionChange = (e) => {
        const { name, value } = e.target;
        setTestAction({ ...testAction, [name]: value });
    };

    // Render JSON output
    const renderJSON = (data) => {
        return <pre>{JSON.stringify(data, null, 2)}</pre>;
    };

    const generateFinalJSON = () => {
        const combinedJSON = {
            testifact_info: testSuite,
            testifact_items: [
                {
                    ...testCase,
                    test_actions: [
                        {
                            action_name: testAction.action_name,
                            action_type: testAction.action_type,
                            action_config: {
                                browser_name: testAction.browser_name // Assuming you want it nested like this
                            }
                        }
                    ]
                }
            ]
        };
        setFinalJSON(JSON.stringify(combinedJSON, null, 2));
        setShowModal(true); // Show the modal with the JSON
    };
    

    const copyToClipboard = () => {
        navigator.clipboard.writeText(finalJSON).then(() => {
            alert('JSON copied to clipboard!'); // Replace with a more elegant notification if desired
        });
    };

    return (
        <div className="test-script-builder-container">
            {/* Test Suite Information Row */}
            <div className="section-row">
                <div className="input-section">
                    <h2>Test Suite Info</h2>
                    <label>
                        Test Suite Name:
                        <input type="text" name="testsuite_name" value={testSuite.testsuite_name} onChange={handleTestSuiteChange} />
                    </label>
                    <label>
                        Test Suite Owner:
                        <input type="text" name="testsuite_owner" value={testSuite.testsuite_owner} onChange={handleTestSuiteChange} />
                    </label>
                    <label>
                        Object Map External:
                        <input type="text" name="object_map_external" value={testSuite.object_map_external} onChange={handleTestSuiteChange} />
                    </label>
                    <label>
                        Variable Map External:
                        <input type="text" name="variable_map_external" value={testSuite.variable_map_external} onChange={handleTestSuiteChange} />
                    </label>
                </div>
                <div className="json-output-section">
                    <h3>Test Suite Info JSON</h3>
                    {renderJSON({ testifact_info: testSuite })}
                </div>
            </div>

            {/* Test Case Information Row */}
            <div className="section-row">
                <div className="input-section">
                    <h2>Test Case 1 Info</h2>
                    <label>
                        Test Case Name:
                        <input type="text" name="test_name" value={testCase.test_name} onChange={handleTestCaseChange} />
                    </label>
                    <label>
                        Description:
                        <input type="text" name="description" value={testCase.description} onChange={handleTestCaseChange} />
                    </label>
                    <label>
                        Execute:
                        <select name="execute" value={testCase.execute} onChange={handleTestCaseChange}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                </div>
                <div className="json-output-section">
                    <h3>Test Case Info JSON</h3>
                    {renderJSON({ testifact_items: [testCase] })}
                </div>
            </div>

            {/* Test Action Row */}
            <div className="section-row">
                <div className="input-section">
                    <h2>Test Case 1 - Action 01</h2>
                    <label>
                        Action Type:
                        <select name="action_type" value={testAction.action_type} onChange={handleTestActionChange}>
                            <option value="">Select Action Type</option>
                            <option value="ui_interaction">UI Interaction</option>
                            <option value="api_call">API Call</option>
                            <option value="data_validation">Data Validation</option>
                        </select>
                    </label>
                    <label>
                        Action Name:
                        <select name="action_name" value={testAction.action_name} onChange={handleTestActionChange}>
                            <option value="">Select Action Name</option>
                            <option value="click">Click</option>
                            <option value="enter_text">Enter Text</option>
                            <option value="submit_form">Submit Form</option>
                        </select>
                    </label>
                    <label>
                        Browser Name:
                        <select name="browser_name" value={testAction.browser_name} onChange={handleTestActionChange}>
                            <option value="">Select Browser</option>
                            <option value="chrome">Chrome</option>
                            <option value="firefox">Firefox</option>
                            <option value="safari">Safari</option>
                        </select>
                    </label>
                </div>
                <div className="json-output-section">
                    <h3>Test Case Action JSON</h3>
                    {renderJSON({ test_actions: [testAction] })}
                </div>
            </div>
            <button onClick={generateFinalJSON} className="generate-json-btn">
                Generate JSON
            </button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <pre>{finalJSON}</pre>
                        <button onClick={copyToClipboard} className="copy-json-btn">
                            Copy JSON
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestScriptBuilder;
