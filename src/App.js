import React, { useState } from 'react';
import Navbar from './Navbar';
import TestScriptBuilder from './TestScriptBuilder';
import ObjectMapBuilder from './ObjectMapBuilder';
import VariableMapBuilder from './VariableMapBuilder';
import { AppProvider } from './AppContext';
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
                return <ObjectMapBuilder />;
            case 'variable-map':
                return <VariableMapBuilder />;
            default:
                return null; // or <DefaultComponent />
        }
    };

    return (
        <AppProvider>
            <Navbar onTabClick={handleTabClick} activeTab={activeTab} />
            {renderActiveTabContent()}
        </AppProvider>
    );
}

export default App;
