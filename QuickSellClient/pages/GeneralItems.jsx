import Card from "../Components/Card";
import Filter from "../Components/Filter";

function GeneralItems() {
    return(
        <div className="content-container">
            <Filter />
            <div className="card-container">
                <Card />
                <Card />
                <Card />
            </div>
        </div>
    )
}

export default GeneralItems;