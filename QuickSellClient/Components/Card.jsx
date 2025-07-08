
function Card() {

    return(
       
            <div className="card-wrapper">
                <img src="/test-img-cli.avif" alt="Image here"></img>
                <h1 id="card-title">Wrench for sale!</h1>
                <p id="card-price">100kr.</p>
                <p id="card-area">Skjetten</p>
                <p id="card-username">ILoveTrondheim</p>
                <p id="card-rating">5 star rating</p>
            </div>
        
    );
}

export default Card;