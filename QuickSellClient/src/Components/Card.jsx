import { Link } from "react-router-dom";

function Card(props) {

    return(
       <Link to={`${props.linkTo}/${props.id}`} style={{textDecoration: "none", color: "inherit"}}>
            <div className="card-wrapper">
                <img src={props.thumbnail} alt="Image here"></img>
                <h1 id="card-title">{props.name}</h1>
                <p id="card-price">{props.listedPrice},-</p>
                <p id="card-area">{props.area}</p>
            </div>
        </Link>
        
    );
}

export default Card;