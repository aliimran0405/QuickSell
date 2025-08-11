import { useEffect, useState } from "react";
import "./MyBids.css";
import axios from "axios";
import API_BASE_URL from "../../../api";

function MyBids() {

    const [myBids, setMyBids] = useState(null);
    const [loading, setLoading] = useState(true);

    const BID_STATUS_STRING = {
        0: "Pending",
        1: "Accepted",
        2: "Rejected"
    };

    useEffect(() => {
        const fetchAllBids = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_BASE_URL}/bids/my-bids`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                setMyBids(response.data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        console.log("401 error");
                    }
                }
            } finally {
                setLoading(false);
            }
        }
        fetchAllBids();
    }, [loading]);


    const handleDeleteBid = async (bidId) => {
        try {
            const token = localStorage.getItem("token");
            const response = axios.delete(`${API_BASE_URL}/bids/delete/${bidId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setMyBids(prevBids => prevBids.filter(bid => bid.bid.bidId !== bidId));
        } catch (error) {
            if (error.response) {
                switch(error.response.status) {
                    case 401:
                        console.log("401 error");
                        break;
                    case 404:
                        console.log("404 error");
                        break;
                    case 403:
                        console.log("403 error");
                        break
                    default:
                        console.log(error);
                }
            }
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <>
            {console.log(myBids)}
            <div className="bids-container">
                <h2>Manage bids</h2>
                {myBids && myBids.length > 0 ? myBids.map(bid => (

                    <div className="bids">
                        <hr />
                        <h4>Name of ad: {bid.item.name}</h4>
                        <p>Your bid amount: {bid.bid.bidAmount},-</p>
                        <p>Status: {BID_STATUS_STRING[bid.bid.bidStatus]}</p>

                        <button onClick={() => handleDeleteBid(bid.bid.bidId)}>Delete Bid</button>
                        {bid && bid.bid.bidStatus === 1 ? (<p>Owner Email: {bid.ownerEmail}</p>) : (<p>None</p>)}
                    </div>
                ))
                :
                (
                    <div className="bids">
                        <p>No bids submitted</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default MyBids;