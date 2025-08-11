import plusIcon from "../assets/icons/plus_icon.png";
import profileIcon from "../assets/icons/profile_icon.png"
import homeIcon from "../assets/icons/home_icon.png"
function Nav() {
    return(
        <div className="nav-container">
                <a className="logo" href="/">Logo</a>
                <ul className="nav-links">
                    <li>
                        <a href="/general-items/new" className="nav-icon-link">
                            <img src={plusIcon} alt="new_ad_icon" className="nav-icon"/>
                            New Ad
                        </a>
                    </li>
                    <li>
                        <a href="/login" className="nav-icon-link">
                        <img src={profileIcon} alt="login_icon" className="nav-icon" id="login-icon"/>
                        Login
                        </a>
                    </li>
                    <li>
                        <a href="/my-page" className="nav-icon-link">
                            <img src={homeIcon} alt="home_icon" className="nav-icon" id="my-page-icon"/>
                            My Page
                        </a>
                    </li>
                </ul>
                
            
        </div>
    )
}

export default Nav;