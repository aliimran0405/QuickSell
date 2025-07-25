import Card from "../Components/Card";
import Filter from "../Components/Filter";
import axios from 'axios';

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";



function GeneralItems() {

    const [items, setItems] = useState([]);
    const location = useLocation();
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/general-items')
            .then(response => {
                setItems(response.data);
            });
    }, []);

    useEffect(() => {
        document.title = "General Items";
        const params = new URLSearchParams(location.search);
        console.log("PARAMS: ", params);
        const category = params.getAll('category');
        console.log("CATEGORY: ", category);

        if (category.length != 0) {
            setFilteredItems(items.filter(item => category.includes(item.category)));
        }
        else {
            setFilteredItems(items);
        }

        
    }, [location.search, items])


    return(
        <>
            {console.log("LOCATION: ", location)}
            <div className="content-container">
                <Filter />
                <div className="card-container">
                    {filteredItems.length === 0 ? (
                        <p className="no-items-text">No listed items for this category</p>
                    ) : (
                        filteredItems.map(item => (
                            <Card id={item.itemId} thumbnail={`http://localhost:5000/${item.thumbnail}`} name={item.name} listedPrice={item.listedPrice} postCode={item.postCode} area={item.area}/>
                    )))}
                </div>
            </div>
        
        </>
    );
}

export default GeneralItems;