import { Link } from "react-router-dom";

function Card(props) {

    return(
       <Link to={`/general-items/${props.id}`} style={{textDecoration: "none", color: "inherit"}}>
            <div className="card-wrapper">
                <img src={props.thumbnail} alt="Image here"></img>
                <h1 id="card-title">{props.name}</h1>
                <p id="card-price">{props.listedPrice},-</p>
                <p id="card-area">{props.postCode}, {props.area}</p>
                <p id="card-username">ILoveTrondheim</p>
                <p id="card-rating">5 star rating</p>
            </div>
        </Link>
        
    );
}

export default Card;