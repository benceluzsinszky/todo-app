import { createContext, useEffect, useState } from "react";
import { TodoItem } from "./interfaces/interfaces";

interface TodoItemContextValue {
    todoItems: TodoItem[]
    setTodoItems: Function
}
interface GlobalContextProps {
    children: React.ReactNode
}

export const TodoItemContext = createContext<TodoItemContextValue>({ todoItems: [], setTodoItems: () => { } });

export default function GlobalContext({ children }: GlobalContextProps) {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/items/')
            .then(response => response.json())
            .then(data => {
                setTodoItems(data)
                console.log(data)
            });
    }, []);

    return (
        <TodoItemContext.Provider value={{ todoItems, setTodoItems }}>
            {children}
        </TodoItemContext.Provider>
    )
};