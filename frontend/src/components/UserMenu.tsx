import { useContext, useState } from "react";
import { BACKEND_URL } from "../App";
import { IsLoggedInContext } from "../GlobalContext";

interface UserMenuProps {
    setShowUserMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UpdatedUser {
    username?: string;
    password?: string;
}


export default function UserMenu({ setShowUserMenu }: UserMenuProps) {
    const { setIsLoggedIn, loggedInUser, setLoggedInUser } = useContext(IsLoggedInContext);

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };



    const handleSubmit = () => {
        const passwordElement = document.querySelector('.current-password-input') as HTMLInputElement;
        const password = passwordElement ? passwordElement.value : '';

        const updatedUser: UpdatedUser = {};

        if (isEditingUsername) {
            const usernameElement = document.querySelector('.username-input') as HTMLInputElement;
            updatedUser.username = usernameElement.value;
        }

        if (isEditingPassword) {
            const newPassword1Element = document.querySelector('.new-password-1') as HTMLInputElement;
            const newPassword2Element = document.querySelector('.new-password-2') as HTMLInputElement;
            if (newPassword1Element.value !== newPassword2Element.value) {
                alert('Passwords do not match');
                return;
            }
            updatedUser.password = newPassword1Element.value;
        }

        fetch(`${BACKEND_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                username: loggedInUser || '',
                password: password
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const token = data.access_token;
                console.log(token);
                localStorage.setItem('token', token);
                return fetch(`${BACKEND_URL}/users/me`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.access_token}`
                    },
                    body: JSON.stringify(updatedUser)
                }).then(response => {
                    if (response.ok) {
                        if (updatedUser.username) {
                            setLoggedInUser(updatedUser.username);
                        }
                        setIsEditingPassword(false);
                        setIsEditingUsername(false);
                        alert('Success!');
                        return;
                    }
                }).catch(error => {
                    alert(error);
                    return;
                });
            })
            .catch(error => {
                alert(error);
                return;
            });
    };


    return (
        <div className="user-menu">
            <div className="close-user-menu">
                <button onClick={() => setShowUserMenu(false)}>
                    <img src="../../public/close.png" alt="Close button" />
                </button>
            </div>
            <div className="change-user-details">
                <div className="change-username">
                    {isEditingUsername ? (
                        <input
                            type="text"
                            placeholder="Username"
                            value={loggedInUser || ''}
                            className="username-input"
                        />
                    ) : (
                        <p className="username">{loggedInUser}</p>
                    )}
                    <button onClick={() => { setIsEditingUsername(!isEditingUsername) }}>Change</button>
                </div>
                <div className="change-password">
                    <div className="current-password">
                        <input
                            type="password"
                            placeholder="Password"
                            className="current-password-input"
                            autoComplete="new-password"
                        />
                        <button onClick={() => { setIsEditingPassword(!isEditingPassword) }}>Change</button>
                    </div>
                    <div className="new-password">
                        {isEditingPassword && <input
                            type="password"
                            placeholder="New password"
                            className="new-password-1"
                        />}
                        {isEditingPassword && <input
                            type="password"
                            placeholder="New password again"
                            className="new-password-2"
                        />}
                    </div>
                </div>
            </div>
            <div className="logout">
                <button onClick={() => handleLogOut()}>Log out</button>
                <button onClick={() => handleSubmit()}>Submit</button>
            </div>
        </div>
    )
}