import useTodoStore from './store/todoStore'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'

function App() {
  const todoCount = useTodoStore(state => state.todos.length)
  const completedCount = useTodoStore(
    state => state.todos.filter(t => t.completed).length
  )

  return (
    <div>
      <h1>Todo List with Zustand</h1>
      <TodoInput />
      <p>Total: {todoCount} | Completed: {completedCount}</p>
      <TodoList />
    </div>
  )
}

export default App