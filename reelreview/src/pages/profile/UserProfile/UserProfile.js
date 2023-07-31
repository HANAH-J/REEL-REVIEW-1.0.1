import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styles from '../../../css/profile/UserProfile.module.css'
import PFPModal from "../Modal/PFPModal";
import LoginSuccess_header from "../../../components/Header/LoginSuccess_header";
import Footer from "../../../components/Footer/Footer";
import userPFP from '../../../img/profile/userProfile/empty_user.svg';
import userPFPHover from '../../../img/profile/userProfile/userGear2.png'
import rateImg from "../../../img/profile/userProfile/rate.svg";
import { useUserStore } from "../../../stores/index.ts";
import axios from "axios";
import { useCookies } from 'react-cookie';

function UserProfile() {
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";

    const responsive = { //캐러셀 반응형 코드
        superLargeDesktop: {breakpoint: { max: 4000, min: 3000 }, items: 5},
        desktop: {breakpoint: { max: 3000, min: 1024 }, items: 3},
        tablet: {breakpoint: { max: 1024, min: 464 }, items: 2},
        mobile: {breakpoint: { max: 464, min: 0 },items: 1}
    };

    const userMovieToWatch = () => { navigate('/MovieToWatch'); }
    const userComment = () => { navigate('/userComment'); }
    const userScoreCollection = () => { navigate('/UserScoreCollection'); }
    const goToMain = () => { navigate('/'); }

    const goToMovie = (movieDetails) => {
      navigate('/details',{state:{"item":movieDetails}})
    };

    const { user, removeUser } = useUserStore();
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({});
    const [profileData, setProfileData] = useState({});
    const [ratings, setRatings] = useState([]);
    const [movieDetails, setMovieDetails] = useState([]);
    const [userCd, setUserCd] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    useEffect(() => {
      const token = cookies.token;
    
      if (token) {
        setLoggedIn(true);
        fetchUserData(token); // 토큰이 유효하다면 사용자 데이터를 가져오는 함수 호출
      } else {
        setLoggedIn(false);
        alert('로그인을 해주세요.'); 
        navigate('/'); // 토큰이 없을 경우 메인으로 리디렉션
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
            setUserCd(responseData.userDTO.userCd); //userCd값 설정 -> Modal에서 사용
            setProfileImage(responseData.profileDTO.pfImage);
            setUserEmail(responseData.userDTO.userEmail);

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

            const ratings = responseData.ratings;
            const movieDetails = responseData.movieDetailsList;

            setUserData(userDTO);
            setProfileData(profileDTO);
            setRatings(ratings);
            setMovieDetails(movieDetails);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    }

    const openPFPModal = () => { 
        setOpenModal(true);
    }

    const recentRatings = ratings ? ratings.slice(0, 5) : [];

    return (
    <div className={styles.UserProfile}>
      <LoginSuccess_header profileData={profileData} userData={userData} />
      <div className={styles.profileContainer}>

            {profileData.bgImage === 'defaultBgImage' ? (
              <div className={styles.profileBg}>
                <div className={styles.profileShadow} />
              </div>
            ) : (
              <div className={styles.profileBg} 
              style={{ backgroundImage: `url(http://localhost:8085/userProfiles/getBackgroundImage?userCd=${userCd})`,
                       backgroundSize: '100%',
                       backgroundRepeat: 'no-repeat' }}>
                <div className={styles.profileShadow} />
              </div>
            )}
            
            <div className={styles.userInfo}>
                <button className={styles.profilePic} onClick={openPFPModal}> 

                    {profileData.pfImage === 'defaultPfImage' ? (
                      <img alt="profile" src={userPFP} />
                    ) : (
                      <img alt="profile" src={`http://localhost:8085/userProfiles/getProfilePicture?userCd=${userCd}`} />
                    )}
                    <img alt="profile" src={userPFPHover} className={styles.profilePicHover} />

                </button>
                <ul>
                    <li>
                        <h2 className={styles.name}> {userData.username} </h2>
                    </li> 
                    <li>
                        <div className={styles.msg}> {profileData.status} </div>
                    </li>
                </ul>

                    <div className={styles.movieListText}>
                        <div className={styles.topHR}> <hr className={styles.userProfile_HR} /> </div>
                        <h4>
                        <img alt="" src= {rateImg}/>
                        {userData.username} 님이 평가한 영화
                        </h4>
                        <div className={styles.bottomHR}> <hr className={styles.userProfile_HR}/> </div>
                    </div>

                    <div className={styles.movieList}>
                      {recentRatings && recentRatings.length > 0 ? (
                        <>
                          <Carousel responsive={responsive}>
                            {recentRatings.map((rating, index) => (
                              
                              <div key={index} className={styles.card}>
                                <img className={styles.movieListPoster} src={IMG_BASE_URL+movieDetails[index].poster_path} alt="Movie" onClick={() => goToMovie(movieDetails[index])} />
                                <h4 onClick={() => goToMovie(movieDetails[index])} className={styles.movieListTitle}>{movieDetails[index].title}</h4>
                                <h5 onClick={() => goToMovie(movieDetails[index])}>평가함 ★ {rating.rate}</h5>
                              </div>
                            ))}
                          </Carousel>
                          <div className={styles.movieListMore} onClick={userScoreCollection}> 
                            <p>더보기</p>
                          </div>
                        </>
                      ) : (
                        <div className={styles.noContent}>
                          <p className={styles.noMovie}>평가한 영화가 없습니다.</p>
                          <p className={styles.goRate} onClick={goToMain}>평가하러 가기</p>
                        </div>
                      )}
                    </div>

                <div className={styles.movieToWatch} onClick={userMovieToWatch}>
                        <div className={styles.topHR}> <hr className={styles.userProfile_HR}/> </div>
                        <h4>
                        보고싶어요
                        </h4>
                        <div className={styles.bottomHR}> <hr className={styles.userProfile_HR}/> </div>
                </div>

                {/* <div className={styles.movieCollection} onClick={movieCollection}>
                        <h4>
                        {userData.username} 님의 컬렉션
                        </h4>
                        <div className={styles.bottomHR}> <hr className={styles.userProfile_HR}/> </div>
                </div> */}

                <div className={styles.userComment} onClick={userComment}>
                        <h4>코멘트</h4>
                </div>
           </div>
        </div>
        {openModal === true ? <PFPModal setOpenModal={setOpenModal} userCd={userCd} userEmail={userEmail} removeUser={removeUser}/> : null}
        
    <Footer/>
  </div>
);
}

export default UserProfile;