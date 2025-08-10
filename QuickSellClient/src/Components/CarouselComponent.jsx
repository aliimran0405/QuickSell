import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import API_BASE_URL from "../../api.js";

// Uses pre-made react-multi-carousel: https://www.npmjs.com/package/react-multi-carousel

function CarouselComponent(props) {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
    };
    return(
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={false} // means to render carousel on server-side.
            infinite={true}
            autoPlay={props.deviceType !== "mobile" ? true : false}
            autoPlaySpeed={3000}
            keyBoardControl={false}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            deviceType={props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            >
            {/*<div className="carousel-item-wrapper">
                <img className="carousel-img" src="/t1.png" alt="1" />
            </div>
            <div className="carousel-item-wrapper">
                <img className="carousel-img" src="/t2.png" alt="2" />
            </div>
            <div className="carousel-item-wrapper">
                <img className="carousel-img" src="/test-img-cli.avif" alt="2" />
            </div>
            <div className="carousel-item-wrapper">
                <img className="carousel-img" src="/vite.svg" alt="2" />
            </div> */}

            {props.mainImages && props.mainImages.map(img => (
                <div className="carousel-item-wrapper">
                    <img className="carousel-img" src={`${API_BASE_URL}/${img}`} alt="2" />
                </div>
            ))}
            
        </Carousel>
    );
}

export default CarouselComponent;