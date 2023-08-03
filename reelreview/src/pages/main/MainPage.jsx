import React, { useState, useEffect, useContext } from 'react';
import Header from "../../components/Header/Header";
import LoginSuccessHeader from "../../components/Header/LoginSuccessHeader";
import Footer from "../../components/Footer/Footer";
import BoxOffice from "../../components/Main_Body/BoxOffice";
import Upcomming from "../../components/Main_Body/Upcomming"
import ActorMovie from '../../components/Main_Body/ActorMovie';
import DirectorMovie from '../../components/Main_Body/DirectorMovie';
import Genre from '../../components/Main_Body/Genre';
import styles from '../../css/main/Mainpage.module.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useUserStore } from '../../stores/index.ts';
import NumberContext from '../details/NumberContext';

export default function MainPage() {
  const [movieList, setMovieList] = useState([]);
  const [name, setName] = useState('');
  const [mainResponse, setMainResponse] = useState('');
  const [cookies, setCookie] = useCookies(['token']);
  const { user } = useUserStore();
  const [userCd, setUserCd] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const { number, setNumber } = useContext(NumberContext);
  
  // JWT 토큰
  const getMain = async (token) => {
    const requestData = {
      headers: {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      }
    };
    await axios.get('http://localhost:8085/userProfiles', requestData)
      .then((response) => {
        const responseData = response.data;
        setUserCd(responseData.userDTO.userCd); //userCd값 설정 -> Modal에서 사용
        const userDTO = {
          userCd: responseData.userDTO.userCd,
          username: responseData.userDTO.username,
          userEmail: responseData.userDTO.userEmail,
          role: responseData.userDTO.role,
          provider: responseData.userDTO.provider,
          providerCd: responseData.userDTO.providerCd,
          createDate: responseData.userDTO.createDate
        };
        const profileDTO = {
          status: responseData.profileDTO.status,
          pfImage: responseData.profileDTO.pfImage
        };
        setUserData(userDTO);
        setProfileData(profileDTO);
      })
      .catch((error) => '');
  }

  useEffect(() => {
    const token = cookies.token;
    if (cookies.token) {
      getMain(cookies.token);
    }
    setNumber(movieList.number);

  }, [cookies.token]);
  useEffect(() => {
    axios.post("http://localhost:8085/api/directorNactorNgenreSearchByDate")
      .then((response) => {
        setMovieList(response.data);

      })
      .catch((error) => {
        console.error(error);
      });
  }, [])



  return (
    <div className={styles.MainPage_box}>
      {cookies.token ? <LoginSuccessHeader profileData={profileData} userData={userData} /> : <Header />}
      <div className={styles.BoxOffice_box_wrapper}>
        <div className={styles.BoxOffice_box}>
          <div className={styles.BoxOffice_box_header}>
            <h3>박스오피스 순위</h3>
          </div>
          <div className={styles.BoxOffice_box_info}>
            <BoxOffice />
          </div>
        </div>
      </div>
      {movieList.director && movieList.director.length > 0 && (
        <div className={styles.DirectorMovie_box_wrapper}>
          <div className={styles.DirectorMovie_box}>
            <div className={styles.DirectorMovie_box_header}>
              <h3>화제의 감독 {movieList.director[0].directorName}의 작품</h3>
            </div>
            <div className={styles.DirectorMovie_box_info}>
              <DirectorMovie movieList={movieList.director} />
            </div>
          </div>
        </div>
      )}

      {movieList.actor && movieList.actor.length > 0 && (
        <div className={styles.ActorMovie_box_wrapper}>
          <div className={styles.ActorMovie_box}>
            <div className={styles.ActorMovie_box_header}>
              <h3>화제의 배우 {movieList.actor[0].actorName}의 작품</h3>
            </div>
            <div className={styles.ActorMovie_box_info}>
              <ActorMovie movieList={movieList.actor} />
            </div>
          </div>
        </div>
      )}

      {movieList.genre && movieList.genre.length > 0 && (
        <div className={styles.Genre_box_wrapper}>
          <div className={styles.Genre_box}>
            <div className={styles.Genre_box_header}>
              <h3>#{movieList.todayGenre}</h3>
            </div>
            <div className={styles.Genre_box_info}>
              <Genre movieList={movieList.genre} />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}