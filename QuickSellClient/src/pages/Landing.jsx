//npm i react-icons
import { useNavigate } from "react-router-dom";
import Dock from "../Components/Dock";
import Aurora from "../Components/Aurora";

function Landing() {

    const navigate = useNavigate();

    const items = [
        { icon: <img src="lamp_icon.png" width={40} />, label: 'General Items', onClick: () => navigate("/general-items") },
        { icon: <img src="car_icon.png" width={40} />, label: 'Cars\nComing Soon!', onClick: () => "" },
        { icon: <img src="house_icon.png" width={40} />, label: 'Property\nComing Soon!', onClick: () => "" },
        { icon: <img src="suitcase_icon.png" width={40} />, label: 'Work\nComing Soon!', onClick: () => ""},
    ];

    return (
        <>
            <div className="landing-text-area">
                <h1>QuickSell</h1>
                <p>Buy & Sell quicker than ever</p>
            </div>
            <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
            <div className="landing-container">
                <Dock
                    items={items}
                    panelHeight={68}
                    baseItemSize={50}
                    magnification={70}
                />
            </div>
        </>
    );
}

export default Landing;