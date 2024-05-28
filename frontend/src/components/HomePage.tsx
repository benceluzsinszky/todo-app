import { useContext } from "react";
import { IsLoggedInContext } from "../GlobalContext";
import LoginForm from "./LoginForm";
import TodoContainer from "./TodoContainer";


export default function HomePage() {
    const { isLoggedIn } = useContext(IsLoggedInContext);

    return (
        <>
            {isLoggedIn ? <TodoContainer /> : <LoginForm />}
        </>
    )
}