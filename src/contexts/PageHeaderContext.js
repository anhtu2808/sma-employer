import React, { createContext, useState, useMemo } from 'react';

export const PageHeaderContext = createContext({
    headerConfig: { title: 'Dashboard', description: '' },
    setHeaderConfig: () => {}
});

export const PageHeaderProvider = ({ children }) => {
    const [headerConfig, setHeaderConfig] = useState({
        title: 'Dashboard',
        description: ''
    });

    const value = useMemo(() => ({ headerConfig, setHeaderConfig }), [headerConfig]);

    return (
        <PageHeaderContext.Provider value={value}>
            {children}
        </PageHeaderContext.Provider>
    );
};
