import './App.css';
import GlobalContext from './GlobalContext';
import HomePage from './components/HomePage';

import MessageBox from './components/MessageBox';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;



function App() {
  return (
    <GlobalContext>
      <MessageBox />
      <HomePage />
    </GlobalContext>
  )
}

export default App
