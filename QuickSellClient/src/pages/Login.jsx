
function Login() {
    
    return(
        <form>
            <div className="login">
                <div className="login-container">
                    <h2>Log in</h2>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" />
                    <label htmlFor="password">Password</label>
                    <input type="password" />
                    <button className="login-button" type="submit">Log in</button>
                </div>
            </div>
        </form>
    );
}

export default Login;