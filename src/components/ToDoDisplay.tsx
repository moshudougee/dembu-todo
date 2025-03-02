/* eslint-disable @typescript-eslint/no-explicit-any */
import { LuLoader } from "react-icons/lu"
import { clearCompletedTodos, completeTodo, deleteTodo } from "../utils/todoActions"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { ToDo } from "../types"

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import DndTodoList from "./DndTodoList"

type Active = 'all' | 'active' | 'completed'

type ToDoDisplayProps = {
    todos: ToDo[] | [],
    loading: boolean,
    error: string | null,
    mutate: () => void
}

const ToDoDisplay = ({ todos, loading, error, mutate }: ToDoDisplayProps) => {
    const [filter, setFilter] = useState<Active>('all')
    const [filteredTodos, setFilteredTodos] = useState(todos)

    useEffect(() => {
        const filterTodos = () => {
            if (filter === 'all') {
                setFilteredTodos(todos)
            } else if (filter === 'active') {
                setFilteredTodos(todos.filter(todo => !todo.completed))
            } else if (filter === 'completed') {
                setFilteredTodos(todos.filter(todo => todo.completed))
            }
        }

        if (todos.length > 0) {
            filterTodos()
        }
    }, [todos, filter])

    const handleFilter = (filterAction: Active) => {
        setFilter(filterAction)
    }

    const handleCompleted = async (id: string, completed: boolean) => {
        completed = !completed
        const res = await completeTodo(id, completed)
        if (res) {
            mutate()
            toast.success('Todo completed!')
        } else {
            console.error("Error completing todo")
            toast.error('Error completing todo. Please try again later.')
        }
    }

    const handleClear = async () => {
        const res = await clearCompletedTodos()
        if (res) {
            mutate()
            toast.success('Completed todos cleared!')
        } else {
            mutate()
            console.error("Error clearing completed todos")
            toast.error('Error clearing completed todos. Please try again later.')
        }
    }
    
    const handleDelete = async (id: string) => {
        const res = await deleteTodo(id)
        if (res) {
            mutate()
            toast.success('Todo deleted!')
        } else {
            mutate()
            console.error("Error deleting todo")
            toast.error('Error deleting todo. Please try again later.')
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setFilteredTodos((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

  return (
    <div className="todo-display">
        <div className="todo-list">
            {loading ? 
                <div className="flex justify-center items-center w-full h-full">
                    <LuLoader className='animate-spin' size={60} />
                </div>
            :error ?
                <div className="todo-item">
                    <span>An error occurred while fetching data.</span>
                </div>
            :filteredTodos.length > 0 ? 
                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext 
                        items={filteredTodos} 
                        strategy={verticalListSortingStrategy}
                    >
                        <DndTodoList 
                            filteredTodos={filteredTodos}
                            handleCompleted={handleCompleted}
                            handleDelete={handleDelete}
                        />
                    </SortableContext>   
                </DndContext>
            :
                <div className="todo-item">
                    <span>No {filter === 'all' ? '' : filter} ToDo Items</span>
                </div>
            }
        </div>
        <div className="todo-footer">
            <div className="footer-item">
                <span>{todos.length} Items left</span>
            </div>
            <div className="footer-item">
                <button 
                    className={filter === 'all' ? 'active-button' : 'filter-button'}
                    onClick={() => handleFilter('all')}
                >
                    All
                </button>
                <button 
                    className={filter === 'active' ? 'active-button' : 'filter-button'}
                    onClick={() => handleFilter('active')}
                >
                    Active
                </button>
                <button 
                    className={filter === 'completed' ? 'active-button' : 'filter-button'}
                    onClick={() => handleFilter('completed')}
                >
                    Completed
                </button>
            </div>
            <div className="footer-item">
                <button 
                    className="clear-button"
                    onClick={handleClear}
                >
                    Clear completed
                </button>
            </div>
        </div>
    </div>
  )
}

export default ToDoDisplay