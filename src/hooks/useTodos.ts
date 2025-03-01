import { useCallback, useEffect, useState } from "react"
import { ToDo } from "../types"
import axios from "axios"


const useTodos = () => {
    const [todos, setTodos] = useState<ToDo[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTodos = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/todos')
            setTodos(response.data)
        } catch (error) {
            setError(error as string)
        } finally {
            setLoading(false)
        }
    }

    const mutate = useCallback(async () => {
        await fetchTodos()

    }, [])

    useEffect(() => {
      fetchTodos();

    }, [])


    return { todos, loading, error, mutate }
    

}

export default useTodos