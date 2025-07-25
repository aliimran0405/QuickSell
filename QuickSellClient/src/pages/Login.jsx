import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //rest of login handler under here
        try {
            const response = await axios.post('http://localhost:5000/login-user', {
                    email: email, 
                    password: pwd
                },
                {
                    withCredentials: true
                }
            );
            console.log("Login successful!", response.data);
            localStorage.setItem("accessToken", response.data.accessToken);
            navigate("/my-page");
        } catch (error) {
            console.error("Something failed", error);
        }
    }
    
    return(
        <form onSubmit={handleSubmit}>
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