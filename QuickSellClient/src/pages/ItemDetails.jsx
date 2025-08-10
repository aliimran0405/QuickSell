import { useState, useEffect } from "react";
import CarouselComponent from "../Components/CarouselComponent";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "../Components/Modal";
import useCheckAuth from "../Utils/useCheckAuth";
import { jwtDecode } from "jwt-decode";
import API_BASE_URL from "../../api";

function ItemDetails() {

    const [item, setItem] = useState([]);
    const [bids, setBids] = useState([]);
    const {itemId} = useParams();
    
    const [itemNotFound, setItemNotFound] = useState(false);

    const [bidAmount, setBidAmount] = useState(0);
    
    const navigate = useNavigate();
    
   
    

    

    // useEffect(() => {
    //     axios.get(`http://localhost:5000/general-items/${itemId}`)
    //         .then(response => {
    //             setItem(response.data);
    //         });
    // }, []);


    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const [itemsResponse, bidsResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/general-items/${itemId}`),
                    axios.get(`${API_BASE_URL}/bids/item/${itemId}`)
                ]);
                setItem(itemsResponse.data);
                setBids(bidsResponse.data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 404) {
                        setItemNotFound(true);
                    }
                }
            }
        }
        fetchItemDetails();
    }, []);

    
    useEffect(() => {
        document.title = item.name;
    }, []);

    

    

    

    
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

    const handleSubmittedBid = async () => {

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_BASE_URL}/bids/place-bid`, {
                itemId: itemId,
                bidAmount: bidAmount
            }, 
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
        } catch (error) {
            console.log("Bid post error");
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
                <div className="all-bids">
                    {console.log(bids)}
                    <h3>Current Bids</h3>
                    {bids && bids.length > 0 ? bids.map(b => (
                        <div className="bid-row">
                            <p>{b.user.customUsername}</p>
                            <p>{b.bidAmount},-</p>
                        </div>
                    )) : <p>No bids are currently posted for this item</p>}
                </div>
                <div>
                    <label htmlFor="bid-amount">Enter bid amount</label>
                    <input type="number" id="bid-amount" onChange={(e) => setBidAmount(e.target.value)}/>
                </div>
                <button className="bid-button" onClick={() => handleSubmittedBid()}>
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
            
            
            
            <hr className="new-section" />
            <div className="item-data">
                <p>Published: {item.createdAt}</p>
                <p>Last changed: {item.updatedAt}</p>
                <p>QuickSell-code: {item.itemId}</p>
            </div>
            
        </>
    );
}

export default ItemDetails;