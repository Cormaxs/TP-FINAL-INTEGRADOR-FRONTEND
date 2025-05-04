import { createContext, useState, useEffect } from "react";

export const ContextTheme = createContext();

export function ProviderTheme({ children }) {
    const [dark, setDark] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        // Guardar en localStorage cuando cambia
        localStorage.setItem("darkMode", JSON.stringify(dark));
        
        // Aplicar clase al body
        if (dark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [dark]);

    const toggleTheme = () => {
        setDark(prevDark => !prevDark);
    };

    return (
        <ContextTheme.Provider value={{ dark, toggleTheme }}>
            {children}
        </ContextTheme.Provider>
    );
}