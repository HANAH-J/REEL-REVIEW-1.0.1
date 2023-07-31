import React, { useState, useEffect }  from "react";
import styles from '../../../css/profile/UserComment.module.css';
import LoginSuccess_header from "../../../components/Header/LoginSuccess_header";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useCookies } from 'react-cookie';
import userPFP from '../../../img/profile/userProfile/empty_user.svg';

function UserComment() {
  const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";
  const [userData, setUserData] = useState({});
  const [comments, setComments] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [ratings, setRatings] = useState([]);
  const [ratingsMapping, setRatingsMapping] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userCd, setUserCd] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
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

    axios.get('http://localhost:8085/userComment', config)
      .then(response => {
        const responseData = response.data;
        const userDTO = {
          userCd: responseData.userDTO.userCd,
          username: responseData.userDTO.username,
        };

        const profileDTO = {
              pfImage: responseData.profileDTO.pfImage
        };

        const comments = responseData.comments;
        const movieDetails = responseData.movieDetailsList;
        const ratings = responseData.ratings;
        const ratingsMapping = {}; 
        ratings.forEach((rating) => {
          ratingsMapping[rating.movieId] = rating.rate;
        });

        setUserData(userDTO);
        setProfileData(profileDTO);
        setUserCd(responseData.userDTO.userCd);
        setComments(comments);
        setMovieDetails(movieDetails);
        setRatings(ratings);
        setRatingsMapping(ratingsMapping);

      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  }

    
    return(
      <div className={styles.userComment}>
        <LoginSuccess_header profileData={profileData} userData={userData} />
        <div className={styles.userComment_PageHeader}>
          <Link to="/userProfiles"><div className={styles.userComment_Header_Arrow}></div></Link>
          <div className={styles.userComment_Title}> <h2> {userData.username} 님의 코멘트</h2> </div>
        </div>

        {comments.length === 0 ? (
          <div className={styles.userComment_noContent}>
            <span className={styles.userComment_noContent_image}></span>
            <p>남긴 코멘트가 없어요.</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div className={styles.userComment_container}>
              <ul className={styles.userComment_movie}>
                <ul className={styles.userComment_movieHeader}>
                  <li>
                    {profileData.pfImage === 'defaultPfImage' ? (
                            <img alt="profile" src={userPFP} className={styles.userComment_movieHeader_PFP}/>
                          ) : (
                            <img alt="profile" className={styles.userComment_movieHeader_PFP} src={`http://localhost:8085/userProfiles/getProfilePicture?userCd=${userCd}`} />
                    )}
                  </li>
                  <li className={styles.userComment_movieHeader_name}> {userData.username} </li>
                  <li className={styles.userComment_movieHeader_rating}>★ {ratingsMapping[comment.movieId] || "평가 전"} </li>
                </ul>
                <ul className={styles.userComment_movieFooter}>
                    <li>
                      <img
                        className={styles.userComment_moviePoster}
                        src={IMG_BASE_URL + movieDetails[index].poster_path}
                        alt='Movie Poster'
                        onClick={() => goToMovie(movieDetails[index])}
                        />
                    </li>
                  <ul className={styles.userComment_commentContainer}>
                    <li className={styles.userComment_movieTitle} onClick={() => goToMovie(movieDetails[index])}> {movieDetails[index].title} </li>
                    <li className={styles.userComment_commentContent}>
                      <Link to="/commentDetail" state={{"comment":comment}}>  
                        {comment.commentContent}
                      </Link>
                    </li>
                  </ul>
                </ul>
                <ul className={styles.userComment_commentFooter}>
                  <li className={styles.userComment_commentLikes}>좋아요 {comment.commentGood} </li>
                  <li className={styles.userComment_commentCmt}>댓글 {comment.ccommentcount} </li>
                  <li className={styles.userComment_commentCmt}>작성 날짜 {comment.commentDate} </li>
                </ul>
              </ul>
        </div>
          ))
        )}
    </div>
    );
}

export default UserComment;