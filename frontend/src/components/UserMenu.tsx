
export default function UserMenu() {

    return (
        <div className="user-menu">
            <div className="close-user-menu">
                <button>X</button>
            </div>
            <div className="change-user-name">
                <p>Username</p>
            </div>
            <div className="change-password">
                <p>Password</p>
            </div>
            <div className="log-out">
                <button>Log out</button>
            </div>
        </div>
    )
}