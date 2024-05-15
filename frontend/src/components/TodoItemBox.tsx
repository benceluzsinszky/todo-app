import { useContext, useState } from "react";
import { TodoItemContext } from "../GlobalContext";
import { TodoItem } from "../interfaces/interfaces";

interface TodoItemBoxProps {
    item: TodoItem
}

export default function TodoItemBox({ item }: TodoItemBoxProps) {

    const [isChecked, setIsChecked] = useState(item.completed);
    const { todoItems, setTodoItems } = useContext(TodoItemContext);

    const handleCheckbox = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCheckedState = event.target.checked;
        try {
            const response = await fetch(`http://localhost:8000/items/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: isChecked
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update todo item');
            }

            // TODO: checked item completed state is not stored
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
        <>
            <input type="checkbox" checked={isChecked} className="todo-checkbox" onChange={handleCheckbox}></input>
            <div className="todo-description">{item.description}</div>
            <button className="todo-delete" onClick={handleDelete}>DEL</button>
        </>
    )
}
