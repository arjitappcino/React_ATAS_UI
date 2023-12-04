import React, { useState } from 'react';
import './TestSuiteInfo.css';

function TestCaseInfo({ testCase, handleTestCaseChange, renderJSON }) {
    // State to manage the expand/collapse
    const [isExpanded, setIsExpanded] = useState(true);

    // Function to toggle the expand/collapse state
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="section-row">
            <div className="input-section">
                <div className="section-header">
                    <h2>Test Case 1 Info</h2>
                    <button onClick={toggleExpand} className="toggle-expand-btn">
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                </div>
                {isExpanded && (
                    // Only render the input fields if the section is expanded
                    <>
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
                    </>
                )}
            </div>
            {isExpanded && (
                <div className="json-output-section">
                    <h3>Test Case Info JSON</h3>
                    {renderJSON({ testifact_items: [testCase] })}
                </div>
            )}

        </div>
    );
}

export default TestCaseInfo;
