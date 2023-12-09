import React, { useState, useEffect, useRef } from 'react';
import './TestScriptBuilder.css'; // Ensure you have this CSS file for styles
import TestSuiteInfo from './files/TestSuiteInfo';
import TestCaseInfo from './files/TestCaseInfo';
import TestAction from './files/TestAction';

function TestScriptBuilder() {

    const [variableSuggestions, setVariableSuggestions] = useState([]);
    const [objectSuggestions, setObjectSuggestions] = useState([]);
    const [variableMapData, setVariableMapData] = useState({});
    const [objectMapData, setObjectMapData] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeInputField, setActiveInputField] = useState({ actionIndex: null, fieldName: null });
    const [finalJSON, setFinalJSON] = useState('');
    const [showModal, setShowModal] = useState(false);
    const dropdownRef = useRef(null);
    const [objectSearchTerm, setObjectSearchTerm] = useState('');
    const [variableSearchTerm, setVariableSearchTerm] = useState('');
    const [testSuite, setTestSuite] = useState(() => JSON.parse(sessionStorage.getItem('testSuite')) || {
        testsuite_name: '',
        testsuite_owner: '',
        object_map_external: '',
        variable_map_external: ''
    });
    const [testCase, setTestCase] = useState(() => JSON.parse(sessionStorage.getItem('testCase')) || {
        test_name: '',
        description: '',
        execute: 'yes'
    });
    const [testActions, setTestActions] = useState(() => JSON.parse(sessionStorage.getItem('testActions')) || [{
        action_type: 'ui',
        action_name: 'ui_open_browser',
        action_fields: {}
    }]);

    const searchInputRef = useRef(null);

    useEffect(() => {
        if (showSuggestions && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSuggestions]);

    useEffect(() => {
        sessionStorage.setItem('testSuite', JSON.stringify(testSuite));
        sessionStorage.setItem('testCase', JSON.stringify(testCase));
        sessionStorage.setItem('testActions', JSON.stringify(testActions));
    }, [testSuite, testCase, testActions]);

    useEffect(() => {
        // Fetch object map data along with variable map data
        const fetchedVariableMapData = JSON.parse(sessionStorage.getItem('variables')) || {};
        const fetchedObjectMapData = JSON.parse(sessionStorage.getItem('objectsData')) || [];
        setVariableMapData(fetchedVariableMapData);
        setObjectMapData(fetchedObjectMapData);
    }, []);

    useEffect(() => {
        // Handler to close the dropdown if clicked outside
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setObjectSearchTerm('');
                setVariableSearchTerm('');
                setShowSuggestions(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const showVariableSuggestions = (index, fieldName) => {
        if (activeInputField.actionIndex !== index || activeInputField.fieldName !== fieldName || !showSuggestions) {
            setActiveInputField({ actionIndex: index, fieldName });
            if (Object.keys(variableMapData).length === 0) {
                alert("No variables added in the variable map!");
                return; // Exit the function to prevent further execution
            }
            setVariableSuggestions(Object.keys(variableMapData));
            setVariableSearchTerm(''); // Reset the search term
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const showObjectSuggestions = (index, fieldName) => {
        if (activeInputField.actionIndex !== index || activeInputField.fieldName !== fieldName || !showSuggestions) {
            setActiveInputField({ actionIndex: index, fieldName });

            // Check if objectMapData is empty
            if (objectMapData.length === 0) {
                alert("No objects added in the object map!");
                return;
            }
            setObjectSuggestions(objectMapData
                .map(obj => obj.objectName)
                .filter(name => name.toLowerCase().includes(objectSearchTerm.toLowerCase())));
            setObjectSearchTerm('');
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };


    const handleVariableSuggestionClick = (suggestion) => {
        if (activeInputField.actionIndex !== null && activeInputField.fieldName !== null) {
            applySuggestion(`[VM|${suggestion}]`, activeInputField.actionIndex, activeInputField.fieldName);
        }
    };

    const handleObjectSuggestionClick = (suggestion) => {
        if (activeInputField.actionIndex !== null && activeInputField.fieldName !== null) {
            applySuggestion(suggestion, activeInputField.actionIndex, activeInputField.fieldName);
        }
    };

    const applySuggestion = (suggestion, index, fieldName) => {
        const updatedActions = testActions.map((action, actionIndex) => {
            if (actionIndex === index) {
                return {
                    ...action,
                    action_fields: { ...action.action_fields, [fieldName]: suggestion }
                };
            }
            return action;
        });
        setTestActions(updatedActions);
        setVariableSearchTerm('');
        setObjectSearchTerm('');
        setShowSuggestions(false);
    };

    const handleInputChange = (index, fieldName, event) => {
        const value = event.target.value;
        setActiveInputField({ actionIndex: index, fieldName });
        updateActionFields(index, fieldName, value);

        if (value.startsWith("[VM|")) {
            // Show variable suggestions
            const searchValue = value.slice(4);
            const filteredVariables = Object.keys(variableMapData)
                .filter(key => key.toLowerCase().includes(searchValue.toLowerCase()));
            setVariableSuggestions(filteredVariables);
            setObjectSuggestions([]);
            setShowSuggestions(true);
        }
    };

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
        const currentAction = testActions[index];
        let updatedActionFields = { ...currentAction.action_fields, [fieldName]: value };
    
        if (fieldName === "method_name") {
            // Update method_type to 'void' for 'loginIntoWithUsernameAndPassword', otherwise reset
            updatedActionFields = {
                ...updatedActionFields,
                method_argument: '', // Reset method_argument when method_name changes
                method_type: 'void' // Set default typeValue based on method_name
            };
        }
    
        const updatedActions = testActions.map((action, i) => {
            if (i === index) {
                return { ...action, action_fields: updatedActionFields };
            }
            return action;
        });
    
        setTestActions(updatedActions);
    };
    


    const resetState = () => {
        setTestSuite({ testsuite_name: '', testsuite_owner: '', object_map_external: '', variable_map_external: '' });
        setTestCase({ test_name: '', description: '', execute: 'yes' });
        setTestActions([]);
        sessionStorage.removeItem('testSuite');
        sessionStorage.removeItem('testCase');
        sessionStorage.removeItem('testActions');
    };

    const getPlaceholderForMethodName = (methodName) => {
        const placeholders = {
            loginIntoWithUsernameAndPassword: "URL | USERNAME | PASSWORD",
            clickOnButton: "BUTTON NAME",
            clickOnSitePage: "SITE PAGE NAME",
            populateFieldWithValue: "FIELD NAME | EXACT VALUE TO BE POPULATED",
            populateFieldWith: "FIELD NAME | VALUE_1,VALUE_2,VALUE_3,...",
            waitForProgressBar: "Not required",
            waitForSeconds: "5 (in seconds)",
            refresh: "Not required",
            tearDown: "Not required",
            logout: "Not required",
            populateRecordTypeUserFilterWith: "FILTER NAME | FILTER VALUE",
            clickOnCheckboxOption: "OPTION NAME",
            clickOnRadioOption: "OPTION NAME",
            clickOnRecordGridNavigation: 'navOption (Navigation option can only be "First", "Previous", "Next", or "Last")'
        };

        return placeholders[methodName] || "Enter Method Argument";
    };



    const renderVariableSuggestionsDropdown = (placeholder, searchTerm, suggestions, onSuggestionClick) => {
        return (
            <div className="suggestions-dropdown" ref={dropdownRef}>
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={placeholder}
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setVariableSearchTerm(e.target.value)}
                />
                {suggestions
                    .filter(suggestion => suggestion.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(suggestion => (
                        <div key={suggestion} className="suggestion-item"
                            onClick={() => onSuggestionClick(suggestion)}>
                            {suggestion}
                        </div>
                    ))
                }
            </div>
        );
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
                            <input type="text" placeholder="Web URL starting with http/https" value={action.action_fields.url || ''} onChange={(e) => handleInputChange(index, 'url', e)} />
                            <button onClick={() => showVariableSuggestions(index, 'url')}>Show Variables</button>
                        </div>
                        <div>
                            {index === activeInputField.actionIndex && activeInputField.fieldName === 'url' && showSuggestions && (
                                renderVariableSuggestionsDropdown(
                                    "Search variables...",
                                    variableSearchTerm,
                                    variableSuggestions,
                                    handleVariableSuggestionClick
                                )
                            )}
                        </div>
                    </>
                );

            case "ui_input":
                return (
                    <>
                        <div>
                            <label>Object Name</label>
                            <input type="text" placeholder="Enter Object Name" value={action.action_fields.object_name || ''} onChange={(e) => updateActionFields(index, 'object_name', e.target.value)} />
                            <button onClick={() => showObjectSuggestions(index, 'object_name')}>Show Objects</button>
                        </div>
                        <div>
                            {index === activeInputField.actionIndex && activeInputField.fieldName === 'object_name' && showSuggestions && (
                                <div className="suggestions-dropdown" ref={dropdownRef}>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search objects..."
                                        className="search-input"
                                        value={objectSearchTerm}
                                        onChange={(e) => {
                                            setObjectSearchTerm(e.target.value);
                                        }}
                                    />
                                    {objectSuggestions.filter(suggestion =>
                                        suggestion.toLowerCase().includes(objectSearchTerm.toLowerCase()) // Filter based on the search term
                                    ).map(filteredSuggestion => (
                                        <div key={filteredSuggestion} className="suggestion-item"
                                            onClick={() => handleObjectSuggestionClick(filteredSuggestion)}>
                                            {filteredSuggestion}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label>Input Value</label>
                            <input type="text" placeholder="Enter Input Value" value={action.action_fields.input_value || ''} onChange={(e) => updateActionFields(index, 'input_value', e.target.value)} />
                            <button onClick={() => showVariableSuggestions(index, 'input_value')}>Show Variables</button>
                        </div>
                        <div>
                            {index === activeInputField.actionIndex && activeInputField.fieldName === 'input_value' && showSuggestions && (
                                renderVariableSuggestionsDropdown(
                                    "Search variables...",
                                    variableSearchTerm,
                                    variableSuggestions,
                                    handleVariableSuggestionClick
                                )
                            )}
                        </div>
                    </>
                );

            case "ui_click":
                return (
                    <>
                        <div>
                            <label>Object Name</label>
                            <input type="text" placeholder="Enter Object Name" value={action.action_fields.object_name || ''} onChange={(e) => updateActionFields(index, 'object_name', e.target.value)} />
                            <button onClick={() => showObjectSuggestions(index, 'object_name')}>Show Objects</button>
                        </div>
                        <div>
                            {index === activeInputField.actionIndex && activeInputField.fieldName === 'object_name' && showSuggestions && (
                                <div className="suggestions-dropdown" ref={dropdownRef}>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search objects..."
                                        className="search-input"
                                        value={objectSearchTerm}
                                        onChange={(e) => {
                                            setObjectSearchTerm(e.target.value);
                                        }}
                                    />
                                    {objectSuggestions.filter(suggestion =>
                                        suggestion.toLowerCase().includes(objectSearchTerm.toLowerCase()) // Filter based on the search term
                                    ).map(filteredSuggestion => (
                                        <div key={filteredSuggestion} className="suggestion-item"
                                            onClick={() => handleObjectSuggestionClick(filteredSuggestion)}>
                                            {filteredSuggestion}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                );

            case "ui_verify_text":
                return (
                    <>
                        <div>
                            <label>Object Name</label>
                            <input type="text" placeholder="Enter Object Name" value={action.action_fields.object_name || ''} onChange={(e) => updateActionFields(index, 'object_name', e.target.value)} />
                            <button onClick={() => showObjectSuggestions(index, 'object_name')}>Show Objects</button>
                        </div>
                        <div>
                            {index === activeInputField.actionIndex && activeInputField.fieldName === 'object_name' && showSuggestions && (
                                <div className="suggestions-dropdown" ref={dropdownRef}>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search objects..."
                                        className="search-input"
                                        value={objectSearchTerm}
                                        onChange={(e) => {
                                            setObjectSearchTerm(e.target.value);
                                        }}
                                    />
                                    {objectSuggestions.filter(suggestion =>
                                        suggestion.toLowerCase().includes(objectSearchTerm.toLowerCase()) // Filter based on the search term
                                    ).map(filteredSuggestion => (
                                        <div key={filteredSuggestion} className="suggestion-item"
                                            onClick={() => handleObjectSuggestionClick(filteredSuggestion)}>
                                            {filteredSuggestion}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label>Expected Text</label>
                            <input type="text" placeholder="Enter Expected Text Value" value={action.action_fields.expected_text || ''} onChange={(e) => updateActionFields(index, 'expected_text', e.target.value)} />
                            <button onClick={() => showVariableSuggestions(index, 'expected_text')}>Show Variables</button>
                        </div>
                        <div>
                            {index === activeInputField.actionIndex && activeInputField.fieldName === 'expected_text' && showSuggestions && (
                                renderVariableSuggestionsDropdown(
                                    "Search variables...",
                                    variableSearchTerm,
                                    variableSuggestions,
                                    handleVariableSuggestionClick
                                )
                            )}
                        </div>
                    </>
                );

            case "ui_appian_action":
                const argumentPlaceholder = getPlaceholderForMethodName(action.action_fields.method_name);
                return (
                    <>
                        <div>
                            <label>Method Name:</label>
                            <select onChange={(e) => updateActionFields(index, 'method_name', e.target.value)} value={action.action_fields.method_name || ''}>
                                <option value="">Select Method</option>
                                <option value="loginIntoWithUsernameAndPassword">loginWithUsernameAndPassword</option>
                                <option value="clickOnButton">clickOnButton</option>
                                <option value="clickOnSitePage">clickOnSitePage</option>
                                <option value="populateFieldWithValue">populateFieldWithValue</option>
                                <option value="populateFieldWith">populateFieldWith</option>
                                <option value="waitForProgressBar">waitForProgressBar</option>
                                <option value="waitForSeconds">waitForSeconds</option>
                                <option value="populateRecordTypeUserFilterWith">populateRecordTypeUserFilterWith</option>
                                <option value="logout">logout</option>
                                <option value="tearDown">tearDown</option>
                                <option value="refresh">refresh</option>
                                <option value="clickOnCheckboxOption">clickOnCheckboxOption</option>
                                <option value="clickOnRadioOption">clickOnRadioOption</option>
                                <option value="clickOnRecordGridNavigation">clickOnRecordGridNavigation</option>
                                <option value="openUserProfile">openUserProfile</option>
                            </select>
                        </div>
                        <div>
                            <label>Method Argument:</label>
                            <input type="text" placeholder={argumentPlaceholder} value={action.action_fields.method_argument || ''} onChange={(e) => updateActionFields(index, 'method_argument', e.target.value)} />
                        </div>
                        <div>
                            <label>Method Type:</label>
                            <input type="text" value={action.action_fields.method_type || ''} onChange={(e) => updateActionFields(index, 'method_type', e.target.value)} />
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
            <TestSuiteInfo testSuite={testSuite} handleTestSuiteChange={handleTestSuiteChange} renderJSON={renderJSON} />
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
            <button onClick={addTestAction} className="add-action-btn">Add Test Action</button>
            <button onClick={generateFinalJSON} className="generate-json-btn">Generate JSON</button>
            <button onClick={resetState} className="reset-btn">Reset</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <pre>{finalJSON}</pre>
                        <button onClick={copyToClipboard} className="copy-json-btn">Copy JSON</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestScriptBuilder;
