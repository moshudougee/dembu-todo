import { Toaster } from "react-hot-toast"
import Home from "./components/Home"
import { ThemeProvider } from "./components/theme-provider"


function App() {
  

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <Home />
    </ThemeProvider>
  )
}

export default App
