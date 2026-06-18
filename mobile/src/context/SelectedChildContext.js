import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectedChildContext = createContext({ selectedChild: null, setSelectedChild: () => { } });

export const SelectedChildProvider = ({ children }) => {
    const [selectedChild, setSelectedChild] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const saved = await AsyncStorage.getItem('selectedChild');
                if (saved) setSelectedChild(JSON.parse(saved));
            } catch (e) {
                console.log('SelectedChild load error:', e);
            }
        };
        load();
    }, []);

    useEffect(() => {
        console.log('SelectedChild changed:', selectedChild);
    }, [selectedChild]);

    return (
        <SelectedChildContext.Provider value={{ selectedChild, setSelectedChild }}>
            {children}
        </SelectedChildContext.Provider>
    );
};

export const useSelectedChild = () => useContext(SelectedChildContext);

export default SelectedChildContext;
