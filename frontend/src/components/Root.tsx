import { useContext } from "react";
import { IsLoggedInContext } from "../GlobalContext";
import LoginForm from "./LoginForm";
import TodoContainer from "./TodoContainer";


export default function Root() {
    const { isLoggedIn } = useContext(IsLoggedInContext);

    return (
        <>
            {isLoggedIn ? <TodoContainer /> : <LoginForm />}
        </>
    )
}