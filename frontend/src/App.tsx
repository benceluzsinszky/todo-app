import { useContext } from 'react';
import './App.css';
import GlobalContext, { IsLoggedInContext } from './GlobalContext';
import LoginForm from './components/LoginForm';
import TodoContainer from './components/TodoContainer';

function App() {
  const { isLoggedIn } = useContext(IsLoggedInContext);

  return (
    <GlobalContext>

      <button onClick={() => console.log(isLoggedIn)}>Check</button>
      {isLoggedIn ? <TodoContainer /> : <LoginForm />}
    </GlobalContext>
  )
}

export default App
