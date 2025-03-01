import useTodos from "../hooks/useTodos"
import ToDoDisplay from "./ToDoDisplay"
import ToDoInput from "./ToDoInput"
import ToggleTheme from "./ToggleTheme"

const Home = () => {
    const { todos, loading, error, mutate } = useTodos()

  return (
    <div className="home">
        <div className="todo-container">
            <div className="header">
                <div className="title">
                    <span className="title-name">TODO</span>
                </div>
                <ToggleTheme />
            </div>
            <ToDoInput mutate={mutate} />
            <ToDoDisplay 
                todos={todos}
                loading={loading}
                error={error}
                mutate={mutate}
            />
        </div>
        <div className="home-footer">
            <span className="footer-title">Drag and drop to reoder the list</span>
        </div>
    </div>
  )
}

export default Home