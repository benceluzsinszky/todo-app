import './App.css';
import GlobalContext from './GlobalContext';
import HomePage from './components/HomePage';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  console.log(BACKEND_URL);
  return (
    <GlobalContext>
      <HomePage />
    </GlobalContext>
  )
}

export default App
