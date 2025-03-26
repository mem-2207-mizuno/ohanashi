import { ThemeProvider } from './presentation/contexts/ThemeContext';
import { HomePage } from './presentation/pages/HomePage';
import { Header } from './presentation/widgets/header/Header';

function App() {
  return (
    <ThemeProvider>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Header />
        <div style={{ flexGrow: 1, height: 'calc(100vh - 32px)' }}>
          <HomePage />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
