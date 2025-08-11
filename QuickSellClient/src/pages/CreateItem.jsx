import FileUploader from "../Components/FileUploader";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useCheckAuth from "../Utils/useCheckAuth";
import API_BASE_URL from "../../api";

function CreateItem() {

    
    const {userData, loading} = useCheckAuth("getUserId");
   

    const [name, setName] = useState("");
    const [isNameValid, setIsNameValid] = useState("");

    const [price, setPrice] = useState("");
    const [priceError, setPriceError] = useState("");

    const [description, setDescription] = useState("");
    const [descriptionTextCount, setDescriptionTextCount] = useState("0");
    const [descriptionError, setDescriptionError] = useState("");

    const [category, setCategory] = useState("none");
    const [categoryError, setCategoryError] = useState("");
    
    const [usedStatus, setUsedStatus] = useState("none");
    const [usedStatusError, setUsedStatusError] = useState("");
    
    const [postCode, setPostCode] = useState("");
    const [postCodeError, setPostCodeError] = useState("");

    const [area, setArea] = useState("");
    const [areaError, setAreaError] = useState("");

    const [imageFiles, setImageFiles] = useState([]);
    //const [imageUrls, setImageUrls] = useState([]);

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const navigate = useNavigate();

    // EDIT MODE 
    // NOTE - make sure not anyone can access '/general-items/edit/id' via direct URL. Set up restrictions when user auth is complete.
    const { itemId } = useParams();

    const isEditMode = Boolean(itemId);

    const [curItem, setCurItem] = useState(null);

    const [initialPreviewUrls, setInitialPreviewUrls] = useState([]);

    useEffect(() => {
        document.title = "New Ad";
        
        if (isEditMode) {
            
            axios.get(`${API_BASE_URL}/general-items/${itemId}`)
                .then(response => {
                    setCurItem(response.data);
                });
        }
    }, [isEditMode, itemId]);


    useEffect(() => {
        if (isEditMode && curItem) {
            setName(curItem.name);
            setPrice(curItem.listedPrice.toString());
            setCategory(curItem.category);
            setDescription(curItem.description);
            setDescriptionTextCount(curItem.description.length);
            setUsedStatus(curItem.usedStatus);
            setPostCode(curItem.postCode);
            setArea(curItem.area);

           
            //const previewUrls = curItem.mainImages.map(path => `http://localhost:5000/${path}`);
            
            // Merge thumbnail and mainImages
            const allImageUrls = [`${API_BASE_URL}/${curItem.thumbnail}`, ...curItem.mainImages.map(path => `${API_BASE_URL}/${path}`)];

            setInitialPreviewUrls(allImageUrls);  
        }
    }, [curItem, isEditMode]);

    // Client prevent unauthorized access to '/edit/id' that they do not own
    useEffect(() => {
        if (!loading && userData && userData.userId && curItem && curItem.ownerId) {
            if (isEditMode && userData.userId != curItem.ownerId) {
                navigate("/forbidden");
            }
        }
    }, [loading, userData, curItem, isEditMode, navigate]);

    if (loading) return <p>Loading...</p>;
    
    
    //const userId = userData.userId;

    const handleCreateItemSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        let valid = true;
        const formData = new FormData();
            

            // Name validation
            if (name.trim() === "") {
                setIsNameValid("Name can not be empty");
                valid = false;
            } else if (name.trim().length > 50){
                setIsNameValid("Name can not be more than 50 characters");
                valid = false;
            } else {
                setIsNameValid("");
            }

            // Price validation
            if (price.trim() === ""){
                setPriceError("A price has to be set");
                valid = false;
            } else if (parseInt(price) > 999999) {
                setPriceError("Price is too high");
                valid = false;
            } else {
                setPriceError("");
            }
            
            // Description validation
            if (description.trim().length > 500) {
                setDescriptionError("Description is too long")
                valid = false;
            } else {
                setDescriptionError("");
            }

            if (category.trim() === "none") {
                setCategoryError("Please choose a category");
            } else {
                setCategoryError("");
            }

            if (usedStatus.trim() === "none") {
                setUsedStatusError("Please choose a used status");
            } else {
                setUsedStatusError("");
            }

            // Postcode validation
            if (postCode.trim() === "") {
                setPostCodeError("You need to enter a postcode");
                valid = false;
            } else if (postCode.trim().length != 4) {
                setPostCodeError("Invalid Postcode");
                valid = false;
            } else {
                setPostCodeError("");
            }

            // Area validation
            if (area.trim() === "") {
                setAreaError("You need to enter an area");
                valid = false;
            } else if (area.trim().length > 20) {
                setAreaError("Area name is too long");
                valid = false;
            } else {
                setAreaError("");
            }

            if(!valid) return;
        
        // If description is empty, show a message to users...
        const finalizedDescription = description.trim() === "" ? "No description provided." : description;

        formData.append("name", name);
        formData.append("listedPrice", price);
        formData.append("category", category);
        formData.append("description", finalizedDescription);
        formData.append("usedStatus", usedStatus);
        formData.append("postCode", postCode);
        formData.append("area", area);
        formData.append("ownerId", userData.userId);

        imageFiles.forEach((file) => {
            formData.append("images", file);
        });

        if (!isEditMode) {
            try {
                const response = axios.post(`${API_BASE_URL}/general-items/new`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
            } catch (error) {
                console.log("Something went wrong with new item post...");
            }
        }
        else {
            try {
                console.log("Edit mode!");
                const token = localStorage.getItem("token");
                const response = axios.put(`${API_BASE_URL}/general-items/edit/${itemId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.log("PUT error");
            }
        }

    }

    return(
        <>
        <h1>Create new ad</h1>
        <form onSubmit={handleCreateItemSubmit}>
            <FileUploader initialPreviewUrls={initialPreviewUrls} setImageFiles={setImageFiles}/>
            <hr className="new-section" />
            <div className="fill-info-container">
                <h2>Item Details</h2>
                <div className="input-field">
                    <label htmlFor="name-of-ad">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                    {isNameValid && <p style={{color: "red"}}>{isNameValid}</p>}
                </div>
                
                <div className="input-field">
                    <label htmlFor="price">Price</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}/>
                    {priceError && <p style={{color: "red"}}>{priceError}</p>}
                </div>

                <div className="input-field">
                    <div className="description-textarea">
                        <label htmlFor="description">Description</label>
                        <textarea id="description-text" value={description} onChange={(e) => {
                            setDescription(e.target.value); 
                            setDescriptionTextCount(e.target.value.length);
                            }} 
                        />
                        <span className="char-counter">{descriptionTextCount}/500</span>
                    </div>
                    {descriptionError && <p style={{color: "red"}}>{descriptionError}</p>}
                </div>

                <div className="input-field">
                    <div className="input-group">
                        <label htmlFor="category">Category</label>
                        <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="none">None</option>
                            <option value="tools">Tools</option>
                            <option value="electronics">Electronics</option>
                            <option value="games">Games</option>
                            <option value="indoor-furniture">Indoor Furniture</option>
                            <option value="outdoor-furniture">Outdoor Furniture</option>
                            <option value="others">Others</option>
                        </select>
                        {categoryError && <p style={{color: "red"}}>{categoryError}</p>}

                        <label htmlFor="used-status">Enter Used Status</label>
                        <select name="used-status" id="used-status" value={usedStatus} onChange={(e) => setUsedStatus(e.target.value)}>
                            <option value="none">None</option>
                            <option value="Used - Visibly Used">Used - Visibly Used</option>
                            <option value="Used - Not Visibly Used">Used - Not Visibly Used</option>
                            <option value="New - Packaging Not Included">New - Packaging Not Included</option>
                            <option value="New - Packaging Included">New - Packaging Included</option>
                        </select>
                        {usedStatusError && <p style={{color: "red"}}>{usedStatusError}</p>}
                    </div>
                </div>
                
                <div className="input-field">
                    <label htmlFor="postcode">Postcode</label>
                    <input type="text" 
                        id="postcode"
                        value={postCode}
                        onChange={(e) => {
                            const value = e.target.value;
                            
                            if (/^\d{0,4}$/.test(value)) {
                                setPostCode(value);
                            }
                        }}
                    />
                    {postCodeError && <p style={{color: "red"}}>{postCodeError}</p>}
                </div>
                
                <div className="input-field">
                    <label htmlFor="area">Area</label>
                    <input type="text" id="area" value={area} onChange={(e) => setArea(e.target.value)}/>
                    {areaError && <p style={{color: "red"}}>{areaError}</p>}
                </div>
            </div>
            <hr className="new-section" />
            <div className="submit-ad-container">
                <button className="bid-button" type="submit">
                    <span>Post Ad</span>
                </button>
            </div>
        </form>
        </>
    )
}

export default CreateItem;