import { useEffect, useState } from "react";
import SpotlightCard from "../Components/SpotlightCard/SpotlightCard";
import default_img from "/default_profile_img.png"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function MyPage() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.log(error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        }
        getUser();
    }, [loading]);

    if (loading) {
        return (<p>Loading...</p>)
    }

    return (
        <>
            <hr className="new-section" />
            <div className="profile-info">
                <img src={default_img} alt="" />
                <div className="profile-info-details">
                    <p id="full-name">{user.firstName + " " + user.lastName}</p>
                    <p id="username">{user.customUsername}</p>
                    <p id="email">{user.email}</p>
                </div>
            </div>
            <div className="my-page-options">
                <Link to="/my-page/my-profile" style={{textDecoration: "none", color: "inherit"}}>
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(75, 0, 130, 0.8)">
                        <h1>Show my profile</h1>
                        <p>Manage your profile information</p>
                    </SpotlightCard>
                </Link>

                <Link to="/my-page/my-ads" style={{textDecoration: "none", color: "inherit"}}>
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(75, 0, 130, 0.8)">
                        <h1>Show my ads</h1>
                        <p>Check and manage your active ads</p>
                    </SpotlightCard>
                </Link>

                <Link to="/my-page/my-bids" style={{textDecoration: "none", color: "inherit"}}>
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(75, 0, 130, 0.8)">
                        <h1>Show my bids</h1>
                        <p>Manage your active bids and see their status</p>
                    </SpotlightCard>
                </Link>
            </div>
            <hr className="new-section" />
        </>
    );
}

export default MyPage;