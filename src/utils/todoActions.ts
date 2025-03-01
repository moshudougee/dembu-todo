import axios from "axios"
import { ToDo } from "../types"


const clearTodo = async (id: string) => {
    try {
        await axios.patch(`/todos/${id}`, { cleared: true })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteTodo = async (id: string) => {
    try {
        await axios.delete(`/todos/${id}`)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const completeTodo = async (id: string, completed: boolean) => {
    try {
        await axios.patch(`/todos/${id}`, {
            completed,
            cleared: false
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const clearCompletedTodos = async () => {
    try {
        const response =  await axios.get('/todos')
        const todos: ToDo[] = response.data
        if (todos.length > 0) {
            for (const todo of todos) {
                if (todo.completed) {
                    const res = await clearTodo(todo.id!)
                    if (!res) {
                        console.error("Error clearing todo")
                        return false
                    }
                }
            }
        }
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}