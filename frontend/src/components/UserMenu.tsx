import { useContext } from "react";
import { IsLoggedInContext } from "../GlobalContext";

interface UserMenuProps {
    setShowUserMenu: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function UserMenu({ setShowUserMenu }: UserMenuProps) {
    const { setIsLoggedIn, loggedInUser } = useContext(IsLoggedInContext);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };



    return (
        <div className="user-menu">
            <div className="close-user-menu">
                <button onClick={() => setShowUserMenu(false)}>X</button>
            </div>
            <div className="change-user-name">
                <p>Username</p>
                <p>{loggedInUser}</p>
            </div>
            <div className="change-password">
                <p>Password</p>
            </div>
            <div className="log-out">
                <button onClick={() => handleLogOut()}>Log out</button>
            </div>
        </div>
    )
}