import React, { useState } from 'react';
import './TestScriptBuilder.css'; // Ensure you have this CSS file for styles
import TestSuiteInfo from './files/TestSuiteInfo';
import TestCaseInfo from './files/TestCaseInfo';
import TestAction from './files/TestAction';

function TestScriptBuilder() {

    const [showModal, setShowModal] = useState(false);
    const [finalJSON, setFinalJSON] = useState('');
    const [testActions, setTestActions] = useState([]);
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

    const addTestAction = () => {
        setTestActions([...testActions, { action_type: 'ui', action_name: '', action_fields: {} }]);
    };

    const handleActionTypeChange = (index, value) => {
        const updatedActions = testActions.map((action, i) =>
            i === index ? { ...action, action_type: value, action_name: '', action_fields: {} } : action
        );
        setTestActions(updatedActions);
    };

    const handleActionNameChange = (index, value) => {
        const updatedActions = testActions.map((action, i) =>
            i === index ? { ...action, action_name: value, action_fields: {} } : action
        );
        setTestActions(updatedActions);
    };

    const updateActionFields = (index, fieldName, value) => {
        const updatedActions = testActions.map((action, i) => {
            if (i === index) {
                return {
                    ...action,
                    action_fields: { ...action.action_fields, [fieldName]: value }
                };
            }
            return action;
        });
        setTestActions(updatedActions);
    };

    const renderActionFields = (action, index) => {
        switch (action.action_name) {
            case "ui_open_browser":
                return (
                    <>
                        <div>
                            <label>Browser Name:</label>
                            <select onChange={(e) => updateActionFields(index, 'browser_name', e.target.value)}>
                                <option value="chrome">Chrome</option>
                                <option value="edge">Edge</option>
                            </select>
                        </div>
                        <div>
                            <label>SSO Login:</label>
                            <select onChange={(e) => updateActionFields(index, 'sso_login', e.target.value)}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        <div>
                            <label>Browser Zoom:</label>
                            <input type="text" defaultValue="0.8" onChange={(e) => updateActionFields(index, 'browser_zoom', e.target.value)} />
                        </div>
                    </>
                );
            case "ui_navigate":
                return (
                    <>
                        <div>
                            <label>url</label>
                            <input type="text" placeholder="Web URL starting with http/https" onChange={(e) => updateActionFields(index, 'url', e.target.value)} />
                        </div>
                    </>
                );

            case "ui_input":
                return (
                    <>
                        <div>
                            <label>Object Name</label>
                            <input type="text" placeholder="Enter Object Name" onChange={(e) => updateActionFields(index, 'object_name', e.target.value)} />
                        </div>
                        <div>
                            <label>Input Value</label>
                            <input type="text" placeholder="Enter Input Value" onChange={(e) => updateActionFields(index, 'input_value', e.target.value)} />
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    const removeTestAction = (index) => {
        const updatedActions = testActions.filter((_, i) => i !== index);
        setTestActions(updatedActions);
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
                    test_actions: testActions.map(action => ({
                        action_name: action.action_name,
                        action_type: action.action_type,
                        action_config: action.action_fields // Assuming action_fields contains all the dynamic fields
                    }))
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
            <TestSuiteInfo testSuite={testSuite} handleTestSuiteChange={handleTestSuiteChange} renderJSON={renderJSON} />
            {/* Test Case Information Row */}
            <TestCaseInfo testCase={testCase} handleTestCaseChange={handleTestCaseChange} renderJSON={renderJSON} />

            {testActions.map((action, index) => (
                <TestAction
                    key={index}
                    action={action}
                    index={index}
                    handleActionTypeChange={handleActionTypeChange}
                    handleActionNameChange={handleActionNameChange}
                    updateActionFields={updateActionFields}
                    removeTestAction={removeTestAction}
                    renderActionFields={renderActionFields}
                    renderJSON={renderJSON}
                />
            ))}
            <button onClick={addTestAction} className="add-action-btn">
                Add Test Action
            </button>
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
