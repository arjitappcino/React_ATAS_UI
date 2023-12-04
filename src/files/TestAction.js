import React, { useState } from 'react';
import './TestSuiteInfo.css';

function TestAction({
    action,
    index,
    handleActionTypeChange,
    handleActionNameChange,
    updateActionFields,
    removeTestAction,
    renderActionFields,
    renderJSON
}) {

    const [isExpanded, setIsExpanded] = useState(true);

    // Function to toggle the expand/collapse state
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="section-row" key={index}>
            <div className="input-section">
                <div className="section-header">
                    <h2>Action {index + 1 < 10 ? `0${index + 1}` : index + 1}: {action.action_name.replace('_', ' ')}</h2>
                    <button onClick={toggleExpand} className="toggle-expand-btn">
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                </div>
                {/* Action Type Dropdown */}
                {isExpanded && (
                    <>
                        <label>Action Type:</label>
                        <select
                            value={action.action_type}
                            onChange={(e) => handleActionTypeChange(index, e.target.value)}
                        >
                            <option value="">Select Action Type</option>
                            <option value="ui">UI</option>
                            {/* Other action type options */}
                        </select>

                        {/* Action Name Dropdown */}
                        {action.action_type === 'ui' && (
                            <div>
                                <label>Action Name:</label>
                                <select
                                    value={action.action_name}
                                    onChange={(e) => handleActionNameChange(index, e.target.value)}
                                >
                                    <option value="">Select Action</option>
                                    <option value="ui_open_browser">Open Browser</option>
                                    <option value="ui_navigate">Navigate</option>
                                    <option value="ui_input">Input</option>
                                    <option value="ui_click">Click</option>
                                    <option value="ui_verify_text">Verify Text</option>
                                    <option value="ui_appian_open_browser">Appian Open Browser</option>
                                    <option value="ui_appian_action">Appian Action</option>
                                    <option value="add_from_template">Add From Template</option>
                                    {/* Other action name options */}
                                </select>
                            </div>
                        )}

                        {/* Additional Fields based on the action name */}
                        {renderActionFields(action, index)}

                        {/* Delete Action Button */}
                        <button class='delete-action-btn' onClick={() => removeTestAction(index)}>
                            Delete Action
                        </button>
                    </>
                )}
            </div>

            {isExpanded && (
                <div className="json-output-section">
                    <h3>Test Case Action JSON</h3>
                    {renderJSON({ test_actions: [action] })}
                </div>
            )}
        </div>
    );
}

export default TestAction;
