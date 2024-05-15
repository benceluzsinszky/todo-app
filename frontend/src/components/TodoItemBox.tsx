import { useContext, useState } from "react";
import { TodoItemContext } from "../GlobalContext";
import { TodoItem } from "../interfaces/interfaces";

interface TodoItemBoxProps {
    item: TodoItem
}

export default function TodoItemBox({ item }: TodoItemBoxProps) {

    const [isChecked, setIsChecked] = useState(item.completed);
    const { setTodoItems, fetchTodoItems } = useContext(TodoItemContext);

    const handleCheckbox = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCheckedState = event.target.checked;
        try {
            const response = await fetch(`http://localhost:8000/items/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date_added: item.date_added,
                    completed: newCheckedState
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update todo item');
            }
            fetchTodoItems();
            setIsChecked(newCheckedState);

        }
        catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/items/${item.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete todo item');
            }
            setTodoItems((prevItems: TodoItem[]) => prevItems.filter((prevItem) => prevItem.id !== item.id));
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="todo" style={{ color: item.completed ? 'rgba(255, 255, 255, 0.3)' : 'inherit' }}>
            <input type="checkbox" checked={isChecked} className="todo-checkbox" onChange={handleCheckbox}></input>
            <div className={`todo-description ${item.completed ? 'completed' : ''}`}>{item.description}</div>
            <button className="todo-delete" onClick={handleDelete}><img src="../../public/delete.png" alt="Delete button" /></button>
        </div>
    )
}
