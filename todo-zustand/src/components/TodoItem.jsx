import useTodoStore from '../store/todoStore'

function TodoItem({ todo }) {
  const toggleTodo = useTodoStore(state => state.toggleTodo)
  const removeTodo = useTodoStore(state => state.removeTodo)

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span className={todo.completed ? 'done' : ''}>
        {todo.text}
      </span>
      <button className="del-btn" onClick={() => removeTodo(todo.id)}>
        Delete
      </button>
    </li>
  )
}

export default TodoItem