import { createContext, useEffect, useState } from "react";
import { TodoItem } from "./interfaces/interfaces";

interface TodoItemContextValue {
    todoItems: TodoItem[];
    setTodoItems: Function;
    fetchTodoItems: Function; // Add a function to fetch todo items
}

interface GlobalContextProps {
    children: React.ReactNode
}

export const TodoItemContext = createContext<TodoItemContextValue>({
    todoItems: [],
    setTodoItems: () => { },
    fetchTodoItems: () => { }
});

export default function GlobalContext({ children }: GlobalContextProps) {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

    const fetchTodoItems = async () => {
        await fetch('http://localhost:8000/items/')
            .then(response => response.json())
            .then(data => {
                setTodoItems(data)
                console.log(data)
            });
    };

    useEffect(() => {
        fetchTodoItems();
    }, []);

    return (
        <TodoItemContext.Provider value={{ todoItems, setTodoItems, fetchTodoItems }}>
            {children}
        </TodoItemContext.Provider>
    )
};