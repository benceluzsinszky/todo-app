import { useContext } from "react";
import { TodoItemContext } from "../GlobalContext";
import AddItem from "./AddItem";
import TodoItemBox from "./TodoItemBox";

export default function TodoContainer() {

    const { todoItems } = useContext(TodoItemContext);

    function fillTodos(completed: boolean) {
        return (
            todoItems
                .filter(item => item.completed === completed)
                .sort((a, b) => {
                    if (completed) {
                        return new Date(b.date_completed).getTime() - new Date(a.date_completed).getTime();
                    } else {
                        return b.id - a.id;
                    }
                })
                .map(item => <TodoItemBox key={item.id} item={item} />)
        )
    }

    return (
        <div className="parent">
            <AddItem />
            {fillTodos(false)}
            {fillTodos(true)}
        </div>
    )
}