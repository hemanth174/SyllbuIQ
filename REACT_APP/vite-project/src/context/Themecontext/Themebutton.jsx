import { useTheme } from "./ThemeContext";
import { Sun, Moon } from "lucide-react";
const ThemeButton = ({ className = "" }) => {
    const { darkMode, toggleTheme } = useTheme()
    const textTheme = !darkMode ? 'text-white' : 'text-black'
    const bgTheme = darkMode ? 'bg-white' : 'bg-black'
    return (
        <>
            <button 
                onClick={toggleTheme} 
                className={`${textTheme} ${bgTheme} ${className} rounded-full p-2 transition-all duration-300 hover:scale-110 active:scale-95`}
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </>
    )
}
export default ThemeButton