import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useContext, useState } from 'react';
import { IsLoggedInContext, TodoItemContext } from "../GlobalContext";
import AddItem from "./AddItem";
import TodoItemBox from "./TodoItemBox";
import UserMenu from './UserMenu';

export default function TodoContainer() {

    const [showUserMenu, setShowUserMenu] = useState(false);

    const { todoItems } = useContext(TodoItemContext);
    const { setIsLoggedIn } = useContext(IsLoggedInContext);

    const [parent] = useAutoAnimate<HTMLDivElement>();

    // const handleLogOut = () => {
    //     localStorage.removeItem('token');
    //     setIsLoggedIn(false);
    // };

    const fillTodos = (completed: boolean) => {
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
    };

    return (
        <>
            <button onClick={() => setShowUserMenu(!showUserMenu)} className='user-button'>User</button>
            {showUserMenu && <div className="overlay" onClick={() => setShowUserMenu(false)} />}
            {showUserMenu && <UserMenu />}
            <div className="parent">
                <AddItem />
                <div ref={parent}>
                    {fillTodos(false)}
                    {fillTodos(true)}
                </div>
            </div>
        </>
    )
}