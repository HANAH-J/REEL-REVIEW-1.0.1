import React, { useState, useEffect } from 'react';
import styles from '../../../css/profile/UserScoreCollection.module.css'
import Header from "../../../components/Header/Header";
import LoginSuccess_header from "../../../components/Header/LoginSuccess_header";
import { Link } from 'react-router-dom';
import axios from "axios";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'; 


function UserScoreCollection() {
  const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";
  
  const [userData, setUserData] = useState({});
  const [ratings, setRatings] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [profileData, setProfileData] = useState({});

  const navigate = useNavigate();
  const goToMovie = (movieDetails) => {
    navigate('/details',{state:{"item":movieDetails}})
  };

  useEffect(() => {
    const token = cookies.token;

    if (token) {
      setLoggedIn(true);
      fetchUserData(token); // 토큰이 유효하다면 사용자 데이터를 가져오는 함수 호출      
    } else {
      setLoggedIn(false);
    }
  }, [cookies.token]);

  const fetchUserData = (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      },
    };

    axios.get('http://localhost:8085/userProfiles', config)
           .then(response => {
            const responseData = response.data;

            const userDTO = {
              userCd: responseData.userDTO.userCd,
              username: responseData.userDTO.username,
              userEmail: responseData.userDTO.userEmail,
              role: responseData.userDTO.role,
            };

            const profileDTO = {
              status: responseData.profileDTO.status,
              bgImage: responseData.profileDTO.bgImage,
              pfImage: responseData.profileDTO.pfImage
            };

            setUserData(userDTO);
            setProfileData(profileDTO);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });

    axios.get('http://localhost:8085/UserScoreCollection', config)
      .then(response => {

        const responseData = response.data;

        const userDTO = {
          userCd: responseData.userDTO.userCd,
          username: responseData.userDTO.username,
        };

        const ratings = responseData.ratings;
        const movieDetails = responseData.movieDetailsList;

        setUserData(userDTO);
        setRatings(ratings);
        setMovieDetails(movieDetails);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  
  return (
    <div className={styles.userScoreCollection_Wrapper}>
      {loggedIn ? (
        <LoginSuccess_header profileData={profileData} userData={userData} />
      ) : (
        <Header />
      )}
      <div className={styles.userScoreCollection_Header}>
        <Link to="/userProfiles"><div className={styles.userScoreCollection_Header_Arrow}></div></Link>
        <div className={styles.userScoreCollection_Wrapper_Title}> <h2>평가한 작품들</h2> </div>
      </div>
    
      <div className={styles.userScoreCollection_List}>

      {ratings.length === 0 ? (
          <div className={styles.userScoreCollection_noContent}>
            <span className={styles.userScoreCollection_noContent_image}></span>
            <div className={styles.userScoreCollection_noContent_text}>담긴 작품이 없어요.</div>
          </div>
        ) : (
          ratings.map((rating, index) => (
            <ul className={styles.userScoreCollection_MovieList} key={index}>
              <li>
                <img
                  className={styles.userScoreCollection_MoviePoster}
                  alt="movie"
                  src={IMG_BASE_URL + movieDetails[index].poster_path}
                  onClick={() => goToMovie(movieDetails[index])}
                />
                <h4 className={styles.userScoreCollection_MovieTitle} onClick={() => goToMovie(movieDetails[index])}>{movieDetails[index].title}</h4>
                <h5 className={styles.userScoreCollection_Rating} onClick={() => goToMovie(movieDetails[index])}>평가함 ★ {rating.rate}</h5>
              </li>
            </ul>
          ))
        )}

      </div>
        
    </div>
  );
}

export default UserScoreCollection;