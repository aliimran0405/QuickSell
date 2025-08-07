import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ProtectedRoutes = () => {
    const [userData, serUserData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const checkAuth = async () => {
            const [userData, serUserData] = useState(null);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                serUserData(response.data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        navigate("/login");
                    }
                }
            }
        }
        checkAuth();
    }), [];
    
}

export default ProtectedRoutes;