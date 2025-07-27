import { useState, useEffect } from "react";
import CarouselComponent from "../Components/CarouselComponent";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "../Components/Modal";
import useCheckAuth from "../Utils/useCheckAuth";
import { jwtDecode } from "jwt-decode";

function ItemDetails() {

    const [item, setItem] = useState([]);
    const {itemId} = useParams();
    const [toggleModal, setToggleModal] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    
    const navigate = useNavigate();
    
    // For my-page item page
    const location = useLocation();
    const {userData, loading} = useCheckAuth("getUserId"); // Look over loading attribute if it should be used like this or something better
    const isAtMyPage = location.pathname.startsWith("/general-items/my-ads/");
    

    

    useEffect(() => {
        axios.get(`http://localhost:5000/general-items/${itemId}`)
            .then(response => {
                setItem(response.data);
            });
    }, []);

    useEffect(() => {
        document.title = item.name;
    }, []);

    if (!userData) return <p>Loading...</p>

    

    

    //let imagesArr = [];
    //let isOwner = false;
    let isLoggedIn = false; // For testing only

    

    // const combineImages = () => {
    //     imagesArr.push(item.thumbnail);
    //     item.mainImages.map(img => 
    //         imagesArr.push(img)
    //     );
    // }

    const imagesArr = [
        ...(item.thumbnail ? [item.thumbnail] : []),
        ...(Array.isArray(item.mainImages) ? item.mainImages : [])
    ];

    const handleEditAd = () => {
        navigate(`/general-items/edit/${itemId}`);
    }

    const handleDeleteAd = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/general-items/${itemId}`);
            navigate("/my-page");
        } catch (error) {
            console.log("Delete error");
        }
    }

    
    return(
        <>
            <div className="custom-carousel-container">
                <CarouselComponent mainImages={imagesArr}/>
            </div>
            <hr className="new-section"/>
            <div className="info-container" style={{color: "white"}}>
                <div className="info-header-row">
                    <h1>{item.name}</h1>
                    <p>Name of user of seller</p>
                </div>
                <h3>{item.listedPrice},-</h3>
                <p>{item.description}</p>
                <div className="used-status-info">
                    <p>{item.usedStatus}</p>
                </div>
                <button className="bid-button">
                    <span>Place Bid</span>
                </button>
            </div>
            <hr className="new-section" />
            <div className="sens-info">
                {isLoggedIn ?
                    <div className="logged-in">
                        <p>Username</p> 
                        <p>Area</p>
                    </div>
                    :
                    <div className="not-logged-in">
                        <img src="/default_profile_img.png" alt="default-img" />
                        <p>You need to be logged in to see username and area</p>
                    </div>
                }
            </div>
            
            {isOwner && (
                <div className="owner-section">
                    <button className="edit-btn" onClick={() => handleEditAd()}><span>Edit Ad</span></button>
                    <button className="delete-btn" onClick={() => setToggleModal(true)}><span>Delete Ad</span></button>
                </div>
            )}
            {toggleModal && <Modal titleText={<h1>Are you sure?</h1>} bodyText={<p>The changes can not be reverted.</p>}closeModal={setToggleModal} customFunction={handleDeleteAd}/>}
            <hr className="new-section" />
            <div className="item-data">
                <p>Published: 04.05.2025</p>
                <p>Last changed: 23.06.2025</p>
                <p>QuickSell-code: {item.itemId}</p>
            </div>
            
        </>
    );
}

export default ItemDetails;