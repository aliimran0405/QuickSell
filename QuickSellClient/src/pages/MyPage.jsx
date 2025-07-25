import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

import Card from "../Components/Card"

function MyPage() {

    const [myAds, setMyAds] = useState([]);
    const [err, setErr] = useState("");

    useEffect(() => {
        try {
            const response = axios.get("http://localhost:5000/general-items/4188");
            setMyAds(response.data);
        } catch (error) {
            setErr(error);
        }
    }, [])
    

    return(
        <>
            <hr className="new-section" />
            <div className="my-page-container">
                <h1 id="my-ads-header">My Ads</h1>

                <Card />
            </div>
            <hr className="new-section" />
        </>
    )
}

export default MyPage;