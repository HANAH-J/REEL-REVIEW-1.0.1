import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import SignOutAlert from "../users/SignOutAlert";
import userPFP from '../../img/profile/userProfile/empty_user.svg';
import styles from '../../css/Header/LoginSuccess_header.module.css';
import logo from '../../img/Header/Reel_Review_logo.png';
import apiUrl from '../../config';

export default function LoginSuccess_header({ profileData, userData }) {
  const baseUrl = apiUrl;

  const userCd = userData ? userData.userCd : null;

  const [movieList, setMovieList] = useState([]);
  const [name, setName] = useState('');

  // [회원] 로그아웃 확인 알림창
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  // [회원] 로그아웃 확인 알림창 스크롤 제어
  useEffect(() => {
    if (showSignOutAlert) {
      document.body.style.overflow = "hidden";  // 스크롤 비활성화
    } else {
      document.body.style.overflow = "auto";    // 스크롤 활성화
    }
  }, [showSignOutAlert]);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);

    axios.post(baseUrl + "/api/movieSearch", formData)
      .then((response) => {
        setMovieList(response.data);
        navigate('/searchSuccess', { state: { movieList: response.data, searchedName: name } });
      })
      .catch((error) => {
        console.error(error);
      });
  };



  return (
    <nav className={styles.topNav}>
      <div className={styles.navWrapper}>
        <ul className={styles.leftNav}>
          <Link to="/">
            <img src={logo} className={styles.logoSection} />
          </Link>
        </ul>
        <ul className={styles.rightNav}>
          <li className={styles.findMovies}>
            <div className={styles.findWrapper}>
              <form onSubmit={handleSubmit}>
                <input type="text" name="title" onChange={handleChange} placeholder="영화를 검색해보세요." autoComplete="off" />
                <button type="submit"></button>
              </form>
            </div>
          </li>
          <li className={styles.nameLi} onClick={() => { setShowSignOutAlert(true) }}> 로그아웃 </li>
          {showSignOutAlert && <SignOutAlert setShowSignOutAlert={setShowSignOutAlert} SignOutHeader={'SignOutHeader'} />}
          <Link to="/user/csMain" className={styles.csMainPage} style={{ textDecoration: 'none' }}>
            <li className={styles.nameLi}> 문의하기 </li>
          </Link>
          <Link to={{ pathname: '/user/userProfiles' }} className={styles.userProfile_box}>
            <li>
              {profileData && profileData.pfImage !== 'defaultPfImage' ? (
                <img alt="profile" src={baseUrl + `/userProfiles/getProfilePicture?userCd=${userCd}`} className={styles.icon} />
              ) : (
                <img alt="profile" src={userPFP} className={styles.icon} />
              )}
            </li>
          </Link>
        </ul>
      </div>
    </nav >
  );
}