import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../../css/main/Mainpage.module.css'; 
import { useNavigate } from 'react-router-dom';
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500/";

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "#ddd", borderRadius: "50%", color: "white", transform: "scale(1.5)" }}
            onClick={onClick}
        >
            <i className="fa fa-angle-right" style={{ color: "black" }}></i>
        </div>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "#ddd", borderRadius: "50%", color: "white", transform: "scale(1.5)" }}
            onClick={onClick}
        >
            <i className="fa fa-angle-left" style={{ color: "black" }}></i>
        </div>
    );
}

export default function DirectorMovie(props) {
 
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        initialSlide: 0,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4,
                  infinite: true,
                  dots: false,
                },
              },
              {
                breakpoint: 1280,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                  infinite: true,
                  dots: false,
                },
              },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: false,
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
    const navigate = useNavigate();

  const onClickDetailPage = (item) =>{
    navigate('details',{state:{item}})
  }
    const index = 0;

    return (
        <Slider {...settings}>
            {props.movieList.map((item, index) => (
                <div key={index} className={styles.DirectorMovie_mainBox}>
                    <div className={styles.DirectorMovie_poster} onClick={()=>{onClickDetailPage(item)}}>
                        <div className={styles.DirectorMovie_content}>
                        <span className={styles.ActorMovie_number}>{index + 1}</span>
                        <img src={IMG_BASE_URL+item.poster_path} alt="poster" />
                        </div>
                    </div>
                    <div className={styles.DirectorMovie_bottom}>
                        <h3>{item.title}</h3>
                    </div>
                </div>
            ))}
        </Slider>
    )
}