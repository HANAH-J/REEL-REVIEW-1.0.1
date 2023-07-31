import React, { useState , useEffect} from "react";
import styles from '../../css/csMain/CsMain.module.css';
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import CsHeaderMenu from "./CsHeader_menu";
import { useCookies } from 'react-cookie';
import axios from "axios";

export default function CsHeader() {

  const [userData, setUserData] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [userCd, setUserCd] = useState(null);
  const [profileData, setProfileData] = useState({});

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [cookies] = useCookies(['token']);

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // 쿠키에서 토큰 정보 가져오기
    const token = cookies.token;

    if (token) {
      setLoggedIn(true);
      fetchUserData(token); // 토큰이 유효하다면 사용자 데이터를 가져오는 함수 호출
      console.log(token);
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
        setUserCd(responseData.userDTO.userCd); //userCd값 설정 -> Modal에서 사용

        const userDTO = {
          userCd: responseData.userDTO.userCd,
          username: responseData.userDTO.username
        };

        const profileDTO = {
          status: responseData.profileDTO.status
        };

        setUserData(userDTO);
        setProfileData(profileDTO);
        console.log(userDTO.username + ' is logged in');
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  return (
    <div className={styles.CsMain_header}>
      <div className={styles.CsMain_header_logo_wrapper}>
        <Link to="/">
          <div className={styles.CsMain_header_logo} />
        </Link>
      </div>
      <div className={styles.CsMain_header_name}><strong>{userData.username}</strong></div>
      <div className={styles.CsMain_header_menuBar}>
        <button onClick={handleClick}>
          <GiHamburgerMenu style={{ width: '100%', height: '100%' }} />
        </button>
      </div>
      {isMenuOpen && <CsHeaderMenu />}
    </div>
  );
}
