import { useContext } from 'react';
import './App.css';
import GlobalContext, { TodoItemContext } from './GlobalContext';
import LoginForm from './components/LoginForm';
import TodoContainer from './components/TodoContainer';

function App() {
  const { isLoggedIn } = useContext(TodoItemContext);

  return (
    <GlobalContext>
      {isLoggedIn ? <TodoContainer /> : <LoginForm />}
    </GlobalContext>
  )
}

export default App
