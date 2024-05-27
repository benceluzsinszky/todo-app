import { createContext, useEffect, useState } from "react";
import { TodoItem } from "./interfaces/interfaces";

interface TodoItemContextValue {
    todoItems: TodoItem[];
    setTodoItems: Function;
    fetchTodoItems: Function;
    isLoggedIn: boolean;
}

interface GlobalContextProps {
    children: React.ReactNode
}

export const TodoItemContext = createContext<TodoItemContextValue>({
    todoItems: [],
    setTodoItems: () => { },
    fetchTodoItems: () => { },
    isLoggedIn: false
});

export default function GlobalContext({ children }: GlobalContextProps) {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const fetchTodoItems = async () => {
        await fetch('http://localhost:8000/items/')
            .then(response => {
                if (!response.ok) {
                    setIsLoggedIn(false);
                    throw new Error('Not logged in');
                }
                return response.json();
            })
            .then(data => {
                setTodoItems(data);
                setIsLoggedIn(true);
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchTodoItems();
    }, []);

    return (
        <TodoItemContext.Provider value={{ todoItems, setTodoItems, fetchTodoItems, isLoggedIn }}>
            {children}
        </TodoItemContext.Provider>
    )
};