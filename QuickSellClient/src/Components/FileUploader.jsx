import { useState, useRef } from "react";
import DefaultUploadImage from "../assets/default_img_upload.png";

function FileUploader({ setImageFiles, setImageUrls }) {

    // Includes the URL of the image file
    const [file, setFile] = useState([]);

    const fileUploadRef = useRef();

    const handleImageUpload = (e) => {
        e.preventDefault();
        fileUploadRef.current.click();
    }

    const handleImageDisplay = () => {
        const uploadedFiles = fileUploadRef.current.files;

        const cachedURLs = Array.from(uploadedFiles).map(file => URL.createObjectURL(file));
        
        // Restricting to 5 images for now
        if (file.length + cachedURLs.length > 5) {
            window.alert("Please upload 5 images or less");
            return;
        }

        setFile(prev => [...prev, ...cachedURLs]);
        
        setImageFiles(prev => [...prev, ...uploadedFiles]);     
        setImageUrls(prev => [...prev, ...cachedURLs]);
    }

    function handleRemoveImage(index) {
        setFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }

    return(
        <>

            <div className="upload-wrapper">
                <h2>Upload Images</h2>
                
                    <button type="submit" className="file-upload-btn" onClick={handleImageUpload}>
                        <div className="image-upload-container">
                            <img src={DefaultUploadImage} alt="default-img" className="default-upload-image" />
                            <p>*Supported types: png, jpeg, jpg, webp, heic (preview not available)</p>
                        </div>
                    </button>
                    <input type="file" id="file" ref={fileUploadRef} onChange={handleImageDisplay} accept="image/png, image/jpeg, image/jpg, image/webp, image/heic" multiple hidden/>
                
                
                <div className="uploaded-files-container">
                    {file.map((f, index) => (
                        <div className="image-wrapper">
                            <img key={index} src={f} alt={`uploaded_file_${index}`} className="uploaded-image" />
                            <button className="remove-btn" onClick={() => handleRemoveImage(index)}>x</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default FileUploader;