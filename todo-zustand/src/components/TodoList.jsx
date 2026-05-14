import useTodoStore from '../store/todoStore'
import TodoItem from './TodoItem'

function TodoList() {
  const todos = useTodoStore(state => state.todos)
  const clearCompleted = useTodoStore(state => state.clearCompleted)
  const hasCompleted = todos.some(t => t.completed)

  return (
    <div>
      <ul className="todo-list">
        {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
      </ul>
      {hasCompleted && (
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
      )}
    </div>
  )
}

export default TodoList