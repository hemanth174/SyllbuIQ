import { createContext, useContext, useState, useEffect } from "react";

const ThemeToogle = createContext()

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark"
    });


    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light")
    }, [darkMode])


    const toggleTheme = () => setDarkMode(!darkMode)

    return (
        <ThemeToogle.Provider value={{ darkMode, toggleTheme }}>
            <div className={darkMode ? "dark" : "light"}> {children}</div>
        </ThemeToogle.Provider>
    )
}

export const useTheme = () => {
    return useContext(ThemeToogle)
}