import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { LuLoader } from "react-icons/lu"
import toast from "react-hot-toast"

type ToDoInputProps = {
    mutate: () => void
}

type ToDo = {
    content: string,
    completed: boolean,
    cleared: boolean,
    createdAt?: string,
    updatedAt?: string,
}

const ToDoInput = ({ mutate }: ToDoInputProps) => {
    const [content, setContent] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const inputElement = inputRef.current
        const handleSend = async () => {
            if (!content) {
                setError('Please enter a todo item')
                return
            }
            try {
                setLoading(true)
                const newTodo: ToDo = {
                    content,
                    completed: false,
                    cleared: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
                await axios.post('/todos', newTodo)
                setContent('')
                setError(null)
                mutate()
                toast.success('Todo created')
            } catch (error) {
                console.log(error)
                setError('An error occured try again later')
                toast.error('Failed to create todo')
            } finally {
                setLoading(false)
            }
        }

        if (inputElement) {
            const handleKeyDown = function (this: HTMLInputElement, event: KeyboardEvent): void {
                if (event.key === 'Enter') {
                    event.preventDefault()
                    handleSend()
                }
            }

            inputElement.addEventListener('keydown', handleKeyDown)
            // Clean up event listener when component unmounts
            return () => {
                inputElement.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, [content, mutate]) 
    
  return (
    <div className="todo-input">
        <div className="circle-input">
            {loading && <LuLoader className="animate-spin" size={20} />}
        </div>
        <div className="input-div">
            <input 
                id="todo"
                type="text"
                placeholder="Enter ToDo and press enter..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                ref={inputRef}
                className="input"
            />
            {error && <span className="flex text-sm text-red-800">{error}</span>}
        </div>
    </div>
  )
}

export default ToDoInput