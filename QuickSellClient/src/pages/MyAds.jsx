import React, { useState, useEffect } from "react";
import Card from "../Components/Card"
import useCheckAuth from "../Utils/useCheckAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyAds() {

    const [userItems, setUserItems] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const getUserItems = async () => {
            // try {
            //     const token = localStorage.getItem("token");
            //     const response = await axios.get("http://localhost:5000/general-items/user-items", {
            //         headers: {
            //             "Authorization": `Bearer ${token}`
            //         }
            //     })

            //     setUserItems(response.data);
            // } catch (error) {
            //     console.log("Error");
            //     // Remember to navigate to '/login'
            // }

            try {
                const token = localStorage.getItem("token");

                const [userItemsRes, userDataRes] = await Promise.all([
                    axios.get("http://localhost:5000/general-items/user-items", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        }
                    }),
                    axios.get("http://localhost:5000/user", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        }
                    })

                ]);
                setUserItems(userItemsRes.data);
                setUser(userDataRes.data);

            } catch (error) {
                console.log("Error");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };


        getUserItems();
    }, [loading]);

    if (loading) {
        return (<p>Loading...</p>)
    }
    

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }
    

    return(
        <>
            <h1 id="my-ads-header">Hello, {user.firstName}</h1>
            <hr className="new-section" />
            <div className="my-page-container">
                <h2 style={{color: "white"}}>My Ads</h2>
                {userItems.length != 0 ? (userItems.map(item => (
                    <Card linkTo={"/general-items/my-ads"} id={item.itemId} thumbnail={`http://localhost:5000/${item.thumbnail}`} name={item.name} listedPrice={item.listedPrice} postCode={item.postCode} area={item.area}/>
                ))
                ) : (<p style={{color: "white"}}>You have no listed items.</p>)}
                <button onClick={() => handleLogout()}>Logout</button>
            </div>
            <hr className="new-section" />
        </>
    )
}

export default MyAds;