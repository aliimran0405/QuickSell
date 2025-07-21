import { useState, useEffect } from "react";
import CarouselComponent from "../Components/CarouselComponent";
import { useParams } from "react-router-dom";
import axios from "axios";

function ItemDetails() {

    const [item, setItem] = useState([]);
    const {itemId} = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/general-items/${itemId}`)
            .then(response => {
                setItem(response.data);
            });
    }, []);

    useEffect(() => {
        document.title = item.name;
    });

    //let imagesArr = [];
    let isLoggedIn = false;

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