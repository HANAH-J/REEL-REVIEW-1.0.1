import React, { useState, useEffect } from 'react';
import styles from '../../../css/profile/MovieToWatch.module.css'
import Header from "../../../components/Header/Header";
import LoginSuccess_header from "../../../components/Header/LoginSuccess_header";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useCookies } from 'react-cookie';

function MovieToWatch() {
  const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";

  const [userData, setUserData] = useState({});
  const [wantToSee, setWantToSee] = useState([]);
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
      fetchUserData(token);
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

    axios.get('http://localhost:8085/MovieToWatch', config)
      .then(response => {
        const responseData = response.data;

        const wantToSee = responseData.wantToSee;
        const movieDetails = responseData.movieDetailsList;

        setWantToSee(wantToSee);
        setMovieDetails(movieDetails);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  
  return (
    <div className={styles.movieToWatch_Wrapper}>
      {loggedIn ? (
        <LoginSuccess_header profileData={profileData} userData={userData} />
      ) : (
        <Header />
      )}
      <div className={styles.movieToWatch_Header}>
        <Link to="/userProfiles"><div className={styles.movieToWatch_Header_Arrow}></div></Link>
        <div className={styles.movieToWatch_Wrapper_Title}> <h2>보고싶어요</h2> </div>
      </div>
    
      <div className={styles.movieToWatch_List}>
        {wantToSee.length === 0 ? (
          <div className={styles.movieToWatch_noContent}>
            <span className={styles.movieToWatch_noContent_image}></span>
            <div className={styles.movieToWatch_noContent_text}>담긴 작품이 없어요.</div>
          </div>
        ) : (
          wantToSee.map((wantToSeeItem, index) => (
            <ul className={styles.movieToWatch_MovieList} key={index}>
              <li>
                <img
                  className={styles.movieToWatch_MoviePoster}
                  alt="movie"
                  src={IMG_BASE_URL + movieDetails[index].poster_path}
                  onClick={() => goToMovie(movieDetails[index])}
                />
                <h4 className={styles.movieToWatch_MovieTitle} onClick={() => goToMovie(movieDetails[index])}> {movieDetails[index].title} </h4>
                <h5 className={styles.movieToWatch_Rating}>평균 ★ {movieDetails[index].vote_average}</h5>
              </li>
            </ul>
          ))
        )}
      </div>
        
    </div>
  );
}

export default MovieToWatch;