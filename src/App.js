import React, { useState } from 'react';
import Navbar from './Navbar';
import TestScriptBuilder from './TestScriptBuilder';
// Import other components as needed

function App() {
    const [activeTab, setActiveTab] = useState('test-script');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'test-script':
                return <TestScriptBuilder />;
            case 'object-map':
                // return <ObjectMap />;
            case 'variable-map':
                // return <VariableMap />;
            default:
                return null; // or <DefaultComponent />
        }
    };

    return (
        <div>
            <Navbar onTabClick={handleTabClick} activeTab={activeTab} />
            {renderActiveTabContent()}
        </div>
    );
}

export default App;
