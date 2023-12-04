import React, { useState } from 'react';
import './TestSuiteInfo.css'; 

function TestSuiteInfo({ testSuite, handleTestSuiteChange, renderJSON }) {
    // State to manage the expand/collapse
    const [isExpanded, setIsExpanded] = useState(true);

    // Function to toggle the expand/collapse state
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="section-row" style={{marginTop: '45px'}}>
            <div className="input-section">
                <div className="section-header">
                    <h2>Test Suite Info</h2>
                    <button onClick={toggleExpand} className="toggle-expand-btn">
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                </div>
                {isExpanded && (
                    // Only render the input fields if the section is expanded
                    <>
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
                    </>
                )}
            </div>
            {isExpanded && (
                <div className="json-output-section">
                    <h3>Test Suite Info JSON</h3>
                    {renderJSON({ testifact_info: testSuite })}
                </div>
            )}
        </div>
    );
}

export default TestSuiteInfo;
