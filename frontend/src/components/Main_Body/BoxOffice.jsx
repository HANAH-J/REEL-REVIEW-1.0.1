import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../../css/main/Mainpage.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../config';

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




export default function BoxOffice() {
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
          slidesToShow: 1,
          slidesToScroll: 1,
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

  let [boxofficeList, setBoxofficeList] = useState([]);

  useEffect(() => {
    const baseUrl = apiUrl;

    axios.get(baseUrl + "/api/popular_movielist").then((response) => {
      setBoxofficeList(response.data);

    }).catch((error) => { console.log(error) })

  }, []);


  const navigate = useNavigate();

  const onClickDetailPage = (item) => {
    navigate('details', { state: { item } })
  }


  return (
    <Slider {...settings}>
      {boxofficeList.map((item, index) => (
        <div className={styles.BoxOffice_mainBox} key={item.movieId}>
          <div className={styles.BoxOffice_poster} onClick={() => onClickDetailPage(item)}>
            <span className={styles.BoxOffice_number}>{index + 1}</span>
            <img src={IMG_BASE_URL + item.poster_path} className={styles.BoxOffice_img} alt="poster" />
          </div>
          <div className={styles.BoxOffice_bottom}>
            <h3>{item.title}</h3>
          </div>
          <div className={styles.BoxOffice_bottoms}>
            <h3>평균 ★ : {item.vote_average}</h3>
            <h3>예매율 : {item.salesShare}% · 누적관객 : {item.audiAcc} 만명</h3>
            <h3></h3>
          </div>
        </div>
      ))}
    </Slider>
  );
}
