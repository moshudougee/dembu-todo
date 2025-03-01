import { ToDo } from "../types"
import ChechIcon from '../assets/icon-check.svg'
import SortableItem from "./SortableItem"


type DndTodoListProps = {
  filteredTodos: ToDo[],
  handleCompleted: (id: string, completed: boolean) => void,
  handleDelete: (id: string) => void,
}
const DndTodoList = ({ filteredTodos, handleCompleted, handleDelete }: DndTodoListProps) => {
  return (
    <div className="flex flex-col">
        {filteredTodos.map((item) => {
            return (
                <SortableItem key={item.id} id={item.id!}>
                    {({attributes, listeners}) => (
                        <div className="todo-item" key={item.id}>
                            <div 
                                className={item.completed ? "circle-checked" : "circle-display"}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleCompleted(item.id!, item.completed)
                                }}
                            >
                                {item.completed && 
                                    <img 
                                        src={ChechIcon} 
                                        alt="Check Icon"
                                        className="flex w-3 h-3 object-cover"
                                    />
                                }
                            </div>
                            <div 
                                className="todo-content"
                                {...attributes} 
                                {...listeners}
                            >
                                <span className={item.cleared ? 'content-cleared' : ''}>
                                    {item.content}
                                </span>
                            </div>
                            <div 
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(item.id!)
                                }}
                            >
                                X
                            </div>
                        </div>
                    )}
                </SortableItem>
            )
        })}
    </div>
  )
}

export default DndTodoList