
function Filter() {
    return(
        <div className="filter-wrapper">
            <ul>
                <li>Tools</li>
                <li>Electronics</li>
                <li>Games</li>
                <li>Others</li>
                <label>
                    <input type="checkbox" name="category" value="inndoor-furniture" />
                Indoor Furniture
                </label>
            </ul>
        </div>
    )
}

export default Filter;