import { useParams } from "react-router-dom";
import testImg from "/default_profile_img.png"
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Components/Modal";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../../api";

function MyItemDetails() {

    const {itemId} = useParams();
    const [itemDetails, setItemDetails] = useState(null);
    const [receivedBids, setReceivedBids] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toggleModal, setToggleModal] = useState(false);
    const navigate = useNavigate();

    const isActive = true;

    useEffect(() => {

        const getMyItemDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const [itemDetailsRes, receivedBidsRes] = await Promise.all([

                    axios.get(`${API_BASE_URL}/general-items/my-ads/${itemId}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }),
                    axios.get(`${API_BASE_URL}/bids/received-bids`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })
                ]);
                setItemDetails(itemDetailsRes.data);
                setReceivedBids(receivedBidsRes.data);
            } catch (error) {
                console.log("");
            } finally {
                setLoading(false);
            }
        }
        getMyItemDetails();
    }, [loading]);

    const handleEditAd = () => {
        navigate(`/general-items/edit/${itemId}`);
    }

    const handleDeleteAd = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${API_BASE_URL}/general-items/${itemId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            navigate("/my-page");
        } catch (error) {
            console.log("Delete error");
        }
    }

    const handleDeclineBid = async (bidId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_BASE_URL}/bids/change-status/${bidId}`, {
                newStatus: -1
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setReceivedBids(prev => prev.filter(b => b.bidId !== bidId));
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
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

    const handleAcceptBid = async (bidId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_BASE_URL}/bids/change-status/${bidId}`, {
                newStatus: 1
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        } catch (error) {
            if (error.response) {
                switch(error.response.status) {
                    case 409:
                        alert("You have already accepted a bid for this item");
                }
            }
        }
    }

    const anyBidAccepted = receivedBids?.some(bid => bid.bidStatus === 1);


    if (loading) {
        return (<p>Loading...</p>)
    }

    return (
        <>
            <h2 className="my-details-header">Manage ad</h2>
            <hr className="new-section" />
            <Link to={`/general-items/${itemId}`} style={{textDecoration: "none", color: "inherit"}}>
            <div className="ad-preview-container">
                <div className="ad-image-wrapper">
                    <img src={`${API_BASE_URL}/${itemDetails.thumbnail}`} alt={itemDetails.thumbnail} className="ad-thumbnail" />
                </div>
                
                <div className="ad-content">
                    <div className="ad-status-line">
                        {isActive ? 
                            <span className="active-status" style={{border: "1px solid limegreen", backgroundColor: "limegreen"}}>Active</span> 
                            : 
                            <span className="active-status" style={{border: "1px solid gray", backgroundColor: "gray"}}>Sold</span>
                        }
                        <span>Last changed: {itemDetails.updatedAt}</span>
                    </div>
                    
                    <div className="ad-title-price">
                        <h3>{itemDetails.name}</h3>
                        <p>{itemDetails.listedPrice},-</p>
                    </div>
                </div>
            </div>
            </Link>
            <hr className="new-section" />
            
            <div className="bid-info-status-container">

                
                {receivedBids && receivedBids.length > 0 ? receivedBids.map(bids => (
                    <div className="bid-info-container">
                        <h3 id="active-bids-header">Active bids</h3>
                        <hr />
                        <p>{bids.user.customUsername}</p>
                        <p>{bids.bidAmount},-</p>
                        <div className="accept-decline-btns">
                            <button id="accept-btn" onClick={() => handleAcceptBid(bids.bidId)} disabled={anyBidAccepted}>Accept</button>
                            <button id="decline-btn" onClick={() => handleDeclineBid(bids.bidId)} disabled={bids.bidStatus === 1}>Decline</button>
                        </div>
                    </div>
                )) 
                : 
                (
                    <div className="bid-info-container">
                        <h3 id="active-bids-header">Active bids</h3>
                        <p>Your item has not received any bids yet</p>
                    </div>
                )}
                <div className="status-container">
                    <p>Status: {isActive ? 
                            <span className="active-status" style={{border: "1px solid limegreen", backgroundColor: "limegreen"}}>Active</span> 
                            : 
                            <span className="active-status" style={{border: "1px solid gray", backgroundColor: "gray"}}>Sold</span>
                        }</p>
                    <p>Views: 148</p>
                    <p>Favourites: 13</p>
                </div>
            </div>
            
            <div className="owner-section">
                <button className="edit-btn" onClick={() => handleEditAd()}><span>Edit Ad</span></button>
                <button className="delete-btn" onClick={() => setToggleModal(true)}><span>Delete Ad</span></button>
            </div>
            {toggleModal && <Modal titleText={<h1>Are you sure?</h1>} bodyText={<p>The changes can not be reverted.</p>}closeModal={setToggleModal} customFunction={handleDeleteAd}/>}
        </>
    );
}

export default MyItemDetails;