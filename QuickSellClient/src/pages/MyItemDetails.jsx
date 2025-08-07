import { useParams } from "react-router-dom";
import testImg from "/default_profile_img.png"
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Components/Modal";
import { useNavigate, Link } from "react-router-dom";

function MyItemDetails() {

    const {itemId} = useParams();
    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toggleModal, setToggleModal] = useState(false);
    const navigate = useNavigate();

    const isActive = true;

    useEffect(() => {

        const getMyItemDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/general-items/my-ads/${itemId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setItemDetails(response.data);
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
            const response = await axios.delete(`http://localhost:5000/general-items/${itemId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            navigate("/my-page");
        } catch (error) {
            console.log("Delete error");
        }
    }

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
                    <img src={`http://localhost:5000/${itemDetails.thumbnail}`} alt={itemDetails.thumbnail} className="ad-thumbnail" />
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
                <div className="bid-info-container">
                    <h3 id="active-bids-header">Active bids</h3>
                    <hr />
                    <p>Username of bidder</p>
                    <p>Bid amount</p>
                    <div className="accept-decline-btns">
                        <button id="accept-btn">Accept</button>
                        <button id="decline-btn">Decline</button>
                    </div>
                    <hr />
                    <p>Username of bidder</p>
                    <p>Bid amount</p>
                    <div className="accept-decline-btns">
                        <button id="accept-btn">Accept</button>
                        <button id="decline-btn">Decline</button>
                    </div>
                    <hr />
                </div>
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