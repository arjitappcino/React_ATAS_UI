import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import TestScriptBuilder from './TestScriptBuilder';
import ObjectMapBuilder from './ObjectMapBuilder';
import VariableMapBuilder from './VariableMapBuilder';
import WelcomePage from './WelcomePage'; // Make sure to create this component
import { AppProvider } from './AppContext';

function App() {
    const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('activeTab') || null);
    const [variableMapFile, setVariableMapFile] = useState(null);
    const [objectMapFile, setObjectMapFile] = useState(null); // New state for object map file

    useEffect(() => {
        sessionStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    const handleBackClick = () => {
        sessionStorage.clear();
        setActiveTab(null);
        setVariableMapFile(null);
        setObjectMapFile(null);
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleNewClick = (variableFile, objectFile) => {
        console.log("Received variable map file in App:", variableFile);
        console.log("Received object map file in App:", objectFile);
        setActiveTab('test-script');
        setVariableMapFile(variableFile); // Set the uploaded variable map file
        setObjectMapFile(objectFile); // Set the uploaded object map file
    };

    const renderActiveTabContent = () => {
        if (activeTab === null) {
            return <WelcomePage onNewClick={handleNewClick} />;
        } else {
            switch (activeTab) {
                case 'test-script':
                    return <TestScriptBuilder />;
                case 'object-map':
                    return <ObjectMapBuilder objectMapFile={objectMapFile}/>; // Pass object map file to ObjectMapBuilder
                case 'variable-map':
                    return <VariableMapBuilder variableMapFile={variableMapFile}/>; // Pass variable map file to VariableMapBuilder
                default:
                    return null;
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
