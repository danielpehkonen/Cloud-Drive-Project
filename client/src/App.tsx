import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/Home'
import { Register } from "./components/Register"
import { Login } from './components/Login'
import { Header } from './components/Header'
import { DocumentEditor } from './components/DocumentEditor'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { appTheme } from './theme' 
import { useState } from 'react'
import { PublicDocument } from './components/PublicDocument'

function App() {
  const [lightMode, setLightMode] = useState<boolean>(() => localStorage.getItem("theme") !== "dark")

  const theme = appTheme(lightMode)

  const toggleTheme = () => {
    setLightMode((currentMode) => {
      const newMode = !currentMode;
      localStorage.setItem("theme", newMode ? "light" : "dark");

      return newMode
    })
  }
  return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
      <BrowserRouter>
      <Header
        lightMode={lightMode}
        toggleTheme={toggleTheme}
      />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/document/:documentId" element={<DocumentEditor />}/>
          <Route path="/shared/:shareToken" element={<PublicDocument />}/>
          <Route path='/register' element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
  </ThemeProvider>
  )
}

export default App
