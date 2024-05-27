import './App.css';
import GlobalContext from './GlobalContext';
import Root from './components/Root';

function App() {

  return (
    <GlobalContext>
      <Root />
    </GlobalContext>
  )
}

export default App
