import { useContext, useState } from "react";
import { IsLoggedInContext } from "../GlobalContext";

export default function LoginForm() {
    const { setIsLoggedIn, setLoggedInUser } = useContext(IsLoggedInContext);

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
            const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            const url = 'http://localhost:8000/users/';
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
                            throw new Error("Username already exists");
                        } throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .then(() => {
                    alert('Success!');
                    setIsRegistering(false);
                })
                .catch(error => {
                    alert(error);
                });
        } else {
            const url = 'http://localhost:8000/token';
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
                    alert(error);
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