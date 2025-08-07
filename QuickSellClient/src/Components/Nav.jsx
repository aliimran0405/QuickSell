
function Nav() {
    return(
        <div className="nav-container">
                <a className="logo" href="/">Logo</a>
                <ul className="nav-links">
                    <li>
                        <a href="/general-items/new" className="nav-icon-link">
                            <img src="plus_icon.png" alt="new_ad_icon" className="nav-icon"/>
                            New Ad
                        </a>
                    </li>
                    <li>
                        <a href="/login" className="nav-icon-link">
                        <img src="profile_icon.png" alt="login_icon" className="nav-icon" id="login-icon"/>
                        Login
                        </a>
                    </li>
                    <li>
                        <a href="/my-page" className="nav-icon-link">
                            <img src="home_icon.png" alt="home_icon" className="nav-icon" id="my-page-icon"/>
                            My Page
                        </a>
                    </li>
                </ul>
                
            
        </div>
    )
}

export default Nav;