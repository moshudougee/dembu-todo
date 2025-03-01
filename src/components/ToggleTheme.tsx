import { useTheme } from "./theme-provider"
import SunIcon from '../assets/icon-sun.svg'
import MoonIcon from '../assets/icon-moon.svg'


const ToggleTheme = () => {
    const { theme, setTheme } = useTheme();

    const handleTheme = () => {
        setTheme(theme === "light"? "dark" : "light");
    }
  return (
    <div
        className="flex items-center cursor-pointer"
        onClick={handleTheme}
    >
        <img 
            src={theme === 'light' ? MoonIcon : SunIcon}
            alt="Toggle Theme"
            className="w-8 h-8 object-cover"
        />
    </div>
  )
}

export default ToggleTheme