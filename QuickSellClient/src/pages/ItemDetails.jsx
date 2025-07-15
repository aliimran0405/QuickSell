import CarouselComponent from "../Components/CarouselComponent";

function ItemDetails() {

    let imagesArr = [];
    let isLoggedIn = true;

    return(
        <>
            <div className="custom-carousel-container">
                <CarouselComponent />
            </div>
            <hr className="new-section"/>
            <div className="info-container" style={{color: "white"}}>
                <div className="info-header-row">
                    <h1>Name of ad here</h1>
                    <p>Name of user of seller</p>
                </div>
                <h3>1000,-</h3>
                <p>Description here</p>
                <div className="used-status-info">
                    <p>Used Status: Used - Visibly Used</p>
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
                <p>Id of ad: 4010</p>
            </div>
            
        </>
    );
}

export default ItemDetails;