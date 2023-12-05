import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import TestScriptBuilder from './TestScriptBuilder';
import ObjectMapBuilder from './ObjectMapBuilder';
import VariableMapBuilder from './VariableMapBuilder';
import WelcomePage from './WelcomePage'; // Make sure to create this component
import { AppProvider } from './AppContext';
// Import other components as needed

function App() {

    const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('activeTab') || null);

    useEffect(() => {
        // Update sessionStorage when activeTab changes
        sessionStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    const handleBackClick = () => {
        // Clear the active tab from the session and reset the state
        // sessionStorage.removeItem('activeTab');
        sessionStorage.clear();
        setActiveTab(null);
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleNewClick = () => {
        setActiveTab('test-script');
    };

    const renderActiveTabContent = () => {
        if (activeTab === null) {
            // If no tab is active, show the welcome page
            return <WelcomePage onNewClick={handleNewClick} />;
        } else {
            // Once a tab is active, show the corresponding component
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
        }
    };

    return (
        <AppProvider>
            {activeTab && <Navbar onTabClick={handleTabClick} activeTab={activeTab} onBackClick={handleBackClick} />}
            {renderActiveTabContent()}
        </AppProvider>
    );
}

export default App;
