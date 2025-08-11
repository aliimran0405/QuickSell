import React, { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Aurora from "../Components/Aurora";
import API_BASE_URL from "../../api";

const USER_REGEX = /^[A-z][A-z0-9-_]{6,19}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,24}$/;

function Register() {
    
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [validFirstName, setValidFirstName] = useState("");

    const [lastName, setLastName] = useState("");
    const [validLastName, setValidLastName] = useState("");

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Register";
    })
    

    useEffect(() => {
        setErrMsg(""); // Set to nothing as error is false when user re-types something
    }, [user, pwd, matchPwd, firstName, lastName]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let valid = true;

        if (!USER_REGEX.test(user)) {
            setValidName("Choose another username please");
            valid = false;
        } else {
            setValidName("");
        }

        if (!PWD_REGEX.test(pwd)) {
            setValidPwd("Please choose a stronger password");
            valid = false
        } else {
            setValidPwd("");
        }

        if (pwd != matchPwd) {
            setValidMatch("Passwords do not match");
            valid = false;
        } else {
            setValidMatch("");
        }

        if (firstName.trim().length > 20) {
            setValidFirstName("First Name is too long");
            valid = false;
        } else {
            setValidFirstName("");
        }

        if (lastName.trim().length > 20) {
            setValidLastName("Last Name is too long");
            valid = false;
        } else {
            setValidLastName("");
        }

        if (!valid) return;

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName: email, email: email, password: pwd, firstName, lastName, customUsername: user })
            });
            if (!response.ok) {
                const error = await response.json();
                setErrMsg(error.message || "Registration failed");
            } else {
                setSuccess("Account created successfully");
                navigate("/login", {state: {message: "Account created successfully!"}});
            }
        } catch (err) {
            setErrMsg("Server error");
        } 
    };

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
        <div className="register-center-wrapper">
            <form className="form-container" onSubmit={handleSubmit}>
                <h1 className="login-title">Register</h1>

                <section className="input-box">
                    <input type="text" name="username" placeholder="Username" onChange={(e) => setUser(e.target.value)}/>
                    <i className="bx bxs-user"></i>
                </section>
                {validName && <p className="red-err-msg">{validName}</p>}
                <section className="input-box">
                    <input type="text" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <i className='bx bxs-envelope'  ></i> 
                </section>
                {validEmail && <p className="red-err-msg">{validEmail}</p>}
                <section className="input-box">
                    <input type="password" name="password" placeholder="Password" onChange={(e) => setPwd(e.target.value)}/>
                    <i className="bx bxs-lock-alt"></i>
                </section>
                {validPwd && <p className="red-err-msg">{validPwd}</p>}
                <section className="input-box">
                    <input type="password" name="re-enter-password" placeholder="Re-enter Password" onChange={(e) => setMatchPwd(e.target.value)}/>
                    <i className="bx bxs-lock-alt"></i>
                    {validMatch && <p className="red-err-msg">{validMatch}</p>}
                </section>
                <section className="input-box">
                    <input type="text" name="first-name" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)}/>
                    <i className="bx bxs-user-pin"></i>
                </section>
                {validFirstName && <p className="red-err-msg">{validFirstName}</p>}
                <section className="input-box">
                    <input type="text" name="last-name" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)}/>
                    <i className="bx bxs-user-pin"></i>
                </section>
                {validLastName && <p className="red-err-msg">{validLastName}</p>}

                <button className="login-button" type="submit">Register</button>

                
            </form>
        </div>
        </>
    );
}

export default Register;