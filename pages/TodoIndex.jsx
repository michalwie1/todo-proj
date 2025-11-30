const { useSelector, useDispatch } = ReactRedux
const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo, changeColor } from '../store/todo.action.js'
import { SET_TODOS, SET_FILTER } from '../store/store.js'


export function TodoIndex() {
    const todos = useSelector((state) => state.todos)
    const isLoading = useSelector((state) => state.isLoading)
    const filterBy = useSelector((state) => state.filterBy)

    const dispatch = useDispatch()

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
    

    // const [filterBy, setFilterBy] = useState(defaultFilter)

    useEffect(() => {
        dispatch({ type: SET_FILTER, filterBy: defaultFilter })
    }, [])

    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos(filterBy)
            .catch(err => {
                showErrorMsg('Cannot load todos')
            })
    }, [filterBy])

    function onSetFilterBy(newFilter){
        dispatch({ type: SET_FILTER, filterBy: newFilter })
    }

    function onRemoveTodo(todoId) {
        const isConfirm = confirm('Are you sure you want to remove this todo?')
        if (!isConfirm) return
        removeTodo(todoId)
            .then(() => {
                showSuccessMsg(`Todo removed`)
            })
            .catch(err => {
                showErrorMsg('Cannot remove todo ' + todoId)
            })
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            // .then((savedTodo) => {
            //     setTodos(prevTodos => prevTodos.map(currTodo => (currTodo._id !== todo._id) ? currTodo : { ...savedTodo }))
            //     showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
            // })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todoId)
            })
    }

    function onChangeColor(todo, newColor) {
        changeColor(todo, newColor)
    }

    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            {isLoading 
            ? <p>Loading...</p>
            :<TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} onChangeColor={onChangeColor} />
            }
            <hr />
            <h2>Todos Table</h2>
        </section>
    )
}