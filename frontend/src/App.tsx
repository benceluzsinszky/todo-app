import './App.css';
import GlobalContext from './GlobalContext';
import HomePage from './components/HomePage';

function App() {

  return (
    <GlobalContext>
      <HomePage />
    </GlobalContext>
  )
}

export default App
