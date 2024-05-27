import { useState } from "react";

export default function LoginForm() {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegisterClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsRegistering(!isRegistering);
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
                    <button type="submit" className="submit-button">{isRegistering ? 'Register' : 'Log in'}</button>
                </div>
                <div>
                    <button className="register-button" onClick={handleRegisterClick}>{isRegistering ? 'Back to log in' : 'Register new user'}</button>
                </div>
            </form>
        </div>
    );
}