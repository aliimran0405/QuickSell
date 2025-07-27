import { useState } from "react"

function Modal({ titleText, bodyText, closeModal, customFunction }) {

    //const [modal, setModal] = useState(false);

    return(
        <>
            <div className="modal-background">
                <div className="modal-container">
                    <div className="title">
                        <h1>{titleText}</h1>
                    </div>
                    <div className="body">
                        <p>{bodyText}</p>
                    </div>
                    <div className="footer">
                        <button onClick={() => closeModal(false)}>Back</button>
                        <button id="delete-btn" onClick={() => customFunction()}>Delete</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;