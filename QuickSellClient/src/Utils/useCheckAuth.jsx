import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../api";

// Works like a hook basically
function useCheckAuth(path) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await axios.get(`${API_BASE_URL}/${path}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setUserData(response.data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }
                }
            } finally {
                setLoading(false);
            }
        }
        checkLoggedIn();
    }, [navigate]);
    
    return {userData, loading};
}

export default useCheckAuth;