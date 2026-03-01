import { useContext, useEffect } from 'react';
import { PageHeaderContext } from '@/contexts/PageHeaderContext';

export const usePageHeader = (title, description = '') => {
    const { setHeaderConfig } = useContext(PageHeaderContext);
    
    useEffect(() => {
        if (setHeaderConfig) {
            setHeaderConfig(prev => {
                if (prev.title === title && prev.description === description) {
                    return prev;
                }
                return { title, description };
            });
        }
        
        // Cleanup function to reset header when unmounting
        return () => {
            if (setHeaderConfig) {
                setHeaderConfig({ title: 'Dashboard', description: '' });
            }
        };
    }, [title, description, setHeaderConfig]);
};
