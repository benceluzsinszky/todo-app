import { useContext, useState } from "react";
import { BACKEND_URL } from "../App";
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
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BACKEND_URL}/items/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BACKEND_URL}/items/${item.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
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

    const emojiMap: { [key: string]: string } = {
        ":-)": "😊",
        ":)": "😊",
        ":]": "😊",
        "=)": "😊",
        "^_^": "😁",
        ":-(": "☹️",
        ":(": "☹️",
        ":[": "☹️",
        "=(": "☹️",
        ":-P": "😛",
        ":P": "😛",
        "=P": "😛",
        ":-D": "😃",
        ":D": "😃",
        "=D": "😃",
        ":-O": "😮",
        ":O": "😮",
        ":o": "😮",
        ":-o": "😮",
        ";-)": "😉",
        ";)": "😉",
        "8-)": "😎",
        "8)": "😎",
        "B-)": "😎",
        "B)": "😎",
        ">:(": "😠",
        ">:-(": "😠",
        ">:O": "😠",
        ">:-O": "😠",
        ":/": "😕",
        ":-/": "😕",
        ":\\": "😕",
        ":-\\": "😕",
        ":'(": "😢",
        "=3:)": "😈",
        "3:-)": "😈",
        "=O:)": "😇",
        "O:-)": "😇",
        "=:-*": "😘",
        ":*": "😘",
        "<3": "❤️",
        "-_-": "😑",
        "<(“)": "🐧",
        ":conf:": "🎉",
        ":fire:": "🔥",
        ":poop:": "💩",
        ":100:": "💯",
        ":pray:": "🙏",

    };

    function parseEmoji(text: string) {
        return text.split(/\s+/).map(word => emojiMap[word] || word).join(' ');
    }

    return (
        <div className="todo" style={{ color: item.completed ? 'rgba(255, 255, 255, 0.3)' : 'inherit' }}>
            <input type="checkbox" checked={isChecked} className="todo-checkbox" onChange={handleCheckbox}></input>
            <div className={`todo-description ${item.completed ? 'completed' : ''}`}>{parseEmoji(item.description)}</div>
            <button className="todo-delete" onClick={handleDelete}><img src="../../public/delete.png" alt="Delete button" /></button>
        </div>
    )
}
