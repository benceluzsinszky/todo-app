import { useContext, useEffect, useState } from "react";
import { MessageBoxContext } from "../GlobalContext";


export default function MessageBox() {

    const [showMessageBox, setShowMessageBox] = useState<boolean>(false);

    const { messageBox } = useContext(MessageBoxContext);

    const messageClass = messageBox.color === "red" ? 'messagebox-red' : 'messagebox-green';

    useEffect(() => {
        if (messageBox.text !== '') {
            setShowMessageBox(true);
        }
    }, [messageBox]);

    return (
        <>
            {showMessageBox && <div className="overlay" onClick={() => setShowMessageBox(false)} />}
            {showMessageBox && <div className={`messagebox ${messageClass}`} >{messageBox.text}</div>}
        </>
    )
}