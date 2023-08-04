import styles from '../../css/details/Detail_num5.module.css';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import imgs from '../../img/Detail/slide.jpg';
import { useState } from 'react';
import ImageModal from "./smallComponents/ImageModal";

function Detailnum5(props) {

    const movieData = props.movieData;
    const images = movieData.movieImages;
    const videos = movieData.movieVideos;
    const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const thumbnailBase = " https://img.youtube.com/vi/";
    const youtube = "https://www.youtube.com/watch?v="

    const [modalOpen, setModalOpen] = useState(false);
    const showModal = () => {
        setModalOpen(true);
    }


    const [isOver, setIsOver] = useState(false);
    const mouseOver = () => {
        setIsOver(true);
    }
    const mouseOut = () => {
        setIsOver(false);
    }


    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: isOver ? "block" : "none", borderRadius: "50%", transform: "scale(1.5)", right: '25px', zIndex: "9999", top: "132px" }}
                onClick={onClick}
            >
            </div>
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: isOver ? "block" : "none", borderRadius: "50%", transform: "scale(1.5)", left: '25px', zIndex: "9999", top: "132px" }}
                onClick={onClick}
            >
            </div>
        );
    }
    const [clickedBackdropPath, setClickedBackdropPath] = useState("");

    // 클릭 이벤트 핸들러 함수
    const handleClickBackdrop = (backdropPath) => {
        setClickedBackdropPath(backdropPath); // 클릭한 backdropPath를 상태 변수에 저장
        showModal(); // 이미지 모달 열기
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.topHead}>
                <div>
                    <h2>갤러리</h2>
                </div>
            </div>
            <div className={styles.gallery} onMouseEnter={mouseOver} onMouseLeave={mouseOut}>
                <Slider {...settings}>
                    {images && (
                        images.map((backdropPath, index) => (
                            <div key={index} className={styles.imgBox} >
                                <img src={IMG_BASE_URL + backdropPath.backdropPath} onClick={() => handleClickBackdrop(backdropPath)}></img>
                            </div>
                        ))

                    )}
                </Slider>
            </div>
            {modalOpen && <ImageModal backdropPath={clickedBackdropPath} setModalOpen={setModalOpen} />}

            <div className={styles.topHead}>
                <div>
                    <h2>동영상</h2>
                </div>
            </div>
            <div className={styles.gallery} onMouseEnter={mouseOver} onMouseLeave={mouseOut}>
                <Slider {...settings}>
                    {videos && (
                        videos.map((video, index) => (
                            <div key={index} className={styles.movieBox}>
                                <a href={youtube + video.videoKey}>
                                    <div className={styles.thumbNail}>
                                        <img src={thumbnailBase + video.videoKey + '/maxresdefault.jpg'} alt='#' />
                                        <div className={styles.playBtn}></div>
                                    </div>
                                    <p>{video.videoName}</p>
                                </a>
                            </div>
                        ))
                    )}

                </Slider>
            </div>
        </div>
    );
}



export default Detailnum5;