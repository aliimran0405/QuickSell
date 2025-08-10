import { useEffect, useState } from "react";
import "./MyBids.css";
import axios from "axios";

function MyBids() {

    const [myBids, setMyBids] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllBids = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/bids/my-bids", {
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

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <>
            <div className="bids-container">
                <h2>Manage bids</h2>
                {myBids && myBids.length > 0 ? myBids.map(bid => (

                    <div className="bids">
                        <hr />
                        <h4>{bid.item.name}</h4>
                        <p>{bid.bidAmount},-</p>
                        <p>Status: Pending/Accepted</p>
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