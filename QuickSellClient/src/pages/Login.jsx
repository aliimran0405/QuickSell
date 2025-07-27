import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [test, setTest] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //rest of login handler under here
        try {
            const response = await axios.post('http://localhost:5000/login', {
                    email: email, 
                    password: pwd
                },
            );
            setTest(response.data);
            localStorage.setItem("token", response.data.token);
            navigate("/my-page");
        } catch (error) {
            console.error("Something failed", error);
        }
    }
    
    return(
        <form onSubmit={handleSubmit}>
            {console.log(test)}
            <div className="login">
                <div className="login-container">
                    <h2>Log in</h2>
                    
                    <label htmlFor="email">E-mail</label>
                    <input 
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        />
                    
                    <button className="login-button" type="submit">Log in</button>
                </div>
            </div>
        </form>
    );
}

export default Login;