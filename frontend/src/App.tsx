import './App.css'
import GlobalContext from './GlobalContext'
import TodoContainer from './components/TodoContainer'

function App() {

  return (
    <GlobalContext>
      <TodoContainer></TodoContainer>
    </GlobalContext>
  )
}

export default App
