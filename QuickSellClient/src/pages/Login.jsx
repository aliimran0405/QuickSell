import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';
import Aurora from "../Components/Aurora";
import API_BASE_URL from "../../api";

function Login() {

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [test, setTest] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //rest of login handler under here
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
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
        <>
        <div className="aurora-bg">
            <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
        </div>
        <div className="login-center-wrapper">
            <form className="form-container" onSubmit={handleSubmit}>
                <h1 className="login-title">Login</h1>

                <section className="input-box">
                    <input type="text" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <i className="bx bxs-envelope"></i>
                </section>
                <section className="input-box">
                    <input type="password" name="password" placeholder="Password" onChange={(e) => setPwd(e.target.value)}/>
                    <i className="bx bxs-lock-alt"></i>
                </section>

                <section className="remember-forgot-box">
                    <div className="remember-me">
                        <input type="checkbox" name="remember-me" id="remember-me"/>
                        <label htmlFor="remember-me">
                            <h5>Remember me</h5>
                        </label>
                    </div>
                    <a href="#" className="forgot-password">
                        <h5>Forgot password?</h5>
                    </a>
                </section>

                <button className="login-button" type="submit">Login</button>

                <h5 className="dont-have-an-account">
                    Don't have an account?
                    <a href="/register"><b>Register</b></a>
                </h5>
            </form>
        </div>
        </>
    );
}

export default Login;