import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [testScript, setTestScript] = useState('');
    const [objectMap, setObjectMap] = useState({});
    const [variableMap, setVariableMap] = useState({});

    const resetTestScript = () => setTestScript('');
    const resetObjectMap = () => setObjectMap({});
    const resetVariableMap = () => setVariableMap({});

    return (
        <AppContext.Provider value={{ testScript, setTestScript, objectMap, setObjectMap, variableMap, setVariableMap }}>
            {children}
        </AppContext.Provider>
    );
};
