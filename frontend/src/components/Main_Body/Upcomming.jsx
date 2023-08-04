import React, { useEffect,useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../../css/main/Mainpage.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      style={{ ...style, display: "block", background: "#ddd", borderRadius: "50%", color: "white", transform: "scale(1.5)"}}
      onClick={onClick}
    >
      <i className="fa fa-angle-left" style={{ color: "black" }}></i>
    </div>
  );
}

export default function Upcomming() {

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

  const index = 0;

  const navigate = useNavigate();

  const onClickDetailPage = (item) =>{
    navigate('details',{state:{item}})
  }
  
  
  let [upcommingList,setUpcommingList] = useState([]);
  
useEffect(()=>{
  
  axios.get("http://localhost:8085/api/upcomming").then((response)=>
  {
    upcommingList = response.data;
    setUpcommingList(upcommingList);
  }).catch((error)=>{console.log(error)})
   
},[]);

  
  return (
    <Slider {...settings}>
      {upcommingList.map((item, index) => (
        <div className={styles.Upcomming_mainBox} key={index}>
          <div className={styles.Upcomming_poster} onClick={()=>{onClickDetailPage(item)}}>
          <div className={styles.Upcomming_content}>
          <span className={styles.Upcomming_number}>{index+1}</span>
            <img src={IMG_BASE_URL + item.poster_path} alt="poster" />
          </div>
          </div>
          <div className={styles.Upcomming_bottom}>
            <h3>{item.title}</h3>
            <div className={styles.Upcomming_bottoms}>
              <h3>{item.release_date}일 개봉</h3>
              <h3>평점 : {item.vote_average}</h3>
            </div>
            
          </div>
        </div>
      ))}
    </Slider>
  )
}