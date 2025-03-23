import { ThemeProvider } from './presentation/contexts/ThemeContext'
import { HomePage } from './presentation/pages/HomePage'

function App() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  )
}

export default App