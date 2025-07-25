
function Nav() {
    return(
        <div className="nav-container">
                <a className="logo" href="/">Logo</a>
                <ul className="nav-links">
                    <li><a href="/general-items">General Items</a></li>
                    <li><a href="/general-items/new">New Ad</a></li>
                    <li><a href="/my-page">My Page</a></li>
                </ul>
                <div className="nav-spacer"></div>
            
        </div>
    )
}

export default Nav;