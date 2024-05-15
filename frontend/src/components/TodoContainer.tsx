import { useContext } from "react";
import { TodoItemContext } from "../GlobalContext";
import AddItem from "./AddItem";
import TodoItemBox from "./TodoItemBox";

export default function TodoContainer() {

    const { todoItems } = useContext(TodoItemContext);

    function fillTodos(completed: boolean) {
        return (
            todoItems
                .sort((a, b) => b.id - a.id)
                .map((item) => {
                    if (item.completed === completed) {
                        return <TodoItemBox key={item.id} item={item} />
                    }
                })
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