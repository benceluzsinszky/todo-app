import { createContext, useEffect, useState } from "react";
import { TodoItem } from "./interfaces/interfaces";

interface TodoItemContextValue {
    todoItems: TodoItem[];
    setTodoItems: Function;
    fetchTodoItems: Function;
}

interface IsLoggedInContextValue {
    isLoggedIn: boolean;
    setIsLoggedIn: Function;
}

interface GlobalContextProps {
    children: React.ReactNode
}

export const TodoItemContext = createContext<TodoItemContextValue>({
    todoItems: [],
    setTodoItems: () => { },
    fetchTodoItems: () => { },
});

export const IsLoggedInContext = createContext<IsLoggedInContextValue>({
    isLoggedIn: true,
    setIsLoggedIn: () => { },
});

export default function GlobalContext({ children }: GlobalContextProps) {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

    const fetchTodoItems = async () => {
        if (!isLoggedIn) return;
        const token = localStorage.getItem('token');
        await fetch('http://localhost:8000/items/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    setIsLoggedIn(false);
                }
                return response.json();
            })
            .then(data => {
                setTodoItems(data);
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchTodoItems();
    }, [isLoggedIn]);

    return (
        <IsLoggedInContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <TodoItemContext.Provider value={{ todoItems, setTodoItems, fetchTodoItems }}>
                {children}
            </TodoItemContext.Provider>
        </IsLoggedInContext.Provider>
    )
};