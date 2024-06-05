import { useContext, useState } from "react";
import { BACKEND_URL } from "../App";
import { IsLoggedInContext, MessageBoxContext } from "../GlobalContext";


export default function LoginForm() {
    const { setIsLoggedIn, setLoggedInUser } = useContext(IsLoggedInContext);
    const { setMessageBox } = useContext(MessageBoxContext);

    const [isRegistering, setIsRegistering] = useState(false);


    const handleRegisterClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsRegistering(!isRegistering);
    };

    const handleRegisterSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        if (isRegistering) {
            if (!username) {
                setMessageBox({ text: 'Username is required', color: 'red' });
                return;
            }
            if (!password) {
                setMessageBox({ text: 'Password is required', color: 'red' });
                return;
            }
            const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
            if (password !== confirmPassword) {
                setMessageBox({ text: 'Passwords do not match', color: 'red' });
                return;
            }
            const url = `${BACKEND_URL}/users/`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 409) {
                            setMessageBox({ text: 'Username already exists', color: 'red' });
                        } throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .then(() => {
                    setMessageBox({ text: 'Success!', color: 'green' });
                    setIsRegistering(false);
                })
                .catch(error => {
                    setMessageBox({ text: error.message, color: 'red' });
                });
        } else {
            const url = `${BACKEND_URL}/token`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    username: username,
                    password: password
                })
            })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error('Server error');
                        } else if (response.status === 403) {
                            throw new Error('Invalid username or password');
                        }
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem('token', data.access_token);
                    setLoggedInUser(username);
                    setIsLoggedIn(true);
                })
                .catch(error => {
                    setMessageBox({ text: error.message, color: 'red' });
                });
        }
    };

    return (
        <div className="login">
            <h2>{isRegistering ? 'Register' : 'Log in'}</h2>
            <form>
                <div>
                    <input type="text" id="username" name="username" placeholder="Username" />
                </div>
                <div>
                    <input type="password" id="password" name="password" placeholder="Password" />
                </div>
                {isRegistering && (
                    <div>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" />
                    </div>
                )}
                <div>
                    <button type="submit" className="submit-button" onClick={handleRegisterSubmit}>{isRegistering ? 'Register' : 'Log in'}</button>
                </div>
                <div>
                    <button className="register-button" onClick={handleRegisterClick}>{isRegistering ? 'Back to log in' : 'Register new user'}</button>
                </div>
            </form>
        </div>
    );
}