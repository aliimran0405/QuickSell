import Card from "../Components/Card";
import Filter from "../Components/Filter";
import axios from 'axios';
import API_BASE_URL from "../../api.js";

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";



function GeneralItems() {

    const [items, setItems] = useState([]);
    const location = useLocation();
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/general-items`);
                setItems(response.data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 404) {
                        setItems([]);
                    }
                }
            } finally {
                setLoading(false);
            }

        }
        fetchItems();
            
    }, []);


    useEffect(() => {
        if (loading) return;
        document.title = "General Items";
        const params = new URLSearchParams(location.search);
        
        const category = params.getAll('category');
        

        
            if (category.length != 0) {
                setFilteredItems(items.filter(item => category.includes(item.category)));
            }
            else {
                setFilteredItems(items);
            }
        

        
    }, [location.search, items, loading])

    
    return(
        <>
            <div className="content-container">
                <Filter />
                <div className="card-container">
                    {filteredItems.length === 0 ? (
                        <p className="no-items-text">No listed items for this category</p>
                    ) : (
                        filteredItems.map(item => (
                            <Card key={item.itemId} linkTo={"/general-items"} id={item.itemId} thumbnail={`${API_BASE_URL}/${item.thumbnail}`} name={item.name} listedPrice={item.listedPrice} area={item.area}/>
                    )))}
                </div>
            </div>
        
        </>
    );
}

export default GeneralItems;