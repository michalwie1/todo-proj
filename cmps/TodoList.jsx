import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

// #99a695

export function TodoList({ todos, onRemoveTodo, onToggleTodo, onChangeColor }) {
console.log(todos)
    return (
        <ul className="todo-list">
            {todos.map(todo =>
                <li key={todo._id} style={{ "backgroundColor": todo.color }}>
                    <TodoPreview todo={todo} onToggleTodo={()=>onToggleTodo(todo)} />
                    <section>
                        <input type="color" id="todo-color" name="todo-color" value={todo.color}
                                onChange={(ev) => onChangeColor(todo, ev.target.value)}
                        ></input>
                        <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                        <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                        <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                    </section>
                </li>
            )}
        </ul>
    )
}
