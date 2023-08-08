import React, { useState, useEffect } from 'react';
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
import { config } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import apiUrl from '../../config';


export default function MainPage() {
  const baseUrl = apiUrl;

  const [movieList, setMovieList] = useState([]);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [mainResponse, setMainResponse] = useState('');
  const [cookies] = useCookies(['token']);
  const { user } = useUserStore();
  const [userCd, setUserCd] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // JWT 토큰
  const getMain = async (token) => {
    const requestData = {
      headers: {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      }
    };

    await axios.get(baseUrl + '/userProfiles', requestData)
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
    if (token) getMain(token);
    else setMainResponse('');
  }, [cookies.token]);

  const handleChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // 서버로 보낼 데이터 준비
    const formData = new FormData();
    formData.append('name', name);

    // 데이터 전송
    axios.post(baseUrl + "/api/directorSearch", formData)
      .then((response) => {
        // 요청에 대한 성공 처리
        setMovieList(response.data);
        // 받은 데이터에 대한 추가 처리
      })
      .catch((error) => {
        // 요청에 대한 실패 처리
        console.error(error);
      });
  };

  const [movieListActor, setMovieListActor] = useState([]);
  const [name1, setName1] = useState('');
  const handleChange1 = (event) => {
    const { value } = event.target;
    setName1(value);
  };
  const handleSubmit1 = (event) => {
    event.preventDefault();

    // 서버로 보낼 데이터 준비
    const formData = new FormData();
    formData.append('name', name1);

    // 데이터 전송
    axios.post(baseUrl + "/api/actorSearch", formData)
      .then((response) => {
        // 요청에 대한 성공 처리
        setMovieListActor(response.data);
        // 받은 데이터에 대한 추가 처리
      })
      .catch((error) => {
        // 요청에 대한 실패 처리
        console.error(error);
      });
  };

  const [movieListGenre, setMovieListGenre] = useState([]);
  const [name2, setName2] = useState('');
  const handleChange2 = (event) => {
    const { value } = event.target;
    setName2(value);
  };
  const handleSubmit2 = (event) => {
    event.preventDefault();

    // 서버로 보낼 데이터 준비
    const formData = new FormData();
    formData.append('genre', name2);

    // 데이터 전송
    axios.post(baseUrl + "/api/genreSearch", formData)
      .then((response) => {
        // 요청에 대한 성공 처리
        setMovieListGenre(response.data);
        // 받은 데이터에 대한 추가 처리
      })
      .catch((error) => {
        // 요청에 대한 실패 처리
        console.error(error);
      });
  };

  return (

    <div className={styles.MainPage_box}>
      <LoginSuccessHeader profileData={profileData} userData={userData} />
      <div className={styles.DirectorMovie_box_wrapper}>
        <div className={styles.DirectorMovie_box}>
          <div className={styles.DirectorMovie_box_header}>
            <h3>감독 작품 검색</h3>
          </div>
          <div className={styles.DirectorMovie_box_info}>
            <form onSubmit={handleSubmit}>
              <input type="text" name='name' onChange={handleChange} className={styles.search_input} autoComplete='off' />
              <button type='submit' className={styles.search_button}>검색</button>
            </form>
            <DirectorMovie movieList={movieList} />
          </div>
        </div>
      </div>
      <div className={styles.ActorMovie_box_wrapper}>
        <div className={styles.ActorMovie_box}>
          <div className={styles.ActorMovie_box_header}>
            <h3>배우 작품 검색</h3>
          </div>
          <div className={styles.ActorMovie_box_info}>
            <form onSubmit={handleSubmit1}>
              <input type="text" name1='name1' onChange={handleChange1} className={styles.search_input} autoComplete='off' />
              <button type='submit' className={styles.search_button}>검색</button>
            </form>
            <ActorMovie movieList={movieListActor} />
          </div>
        </div>
      </div>
      <div className={styles.Genre_box_wrapper}>
        <div className={styles.Genre_box}>
          <div className={styles.Genre_box_header}>
            <h3>장르</h3>
          </div>
          <div className={styles.Genre_box_info}>
            <form onSubmit={handleSubmit2}>
              <input type="text" name2='name2' onChange={handleChange2} className={styles.search_input} autoComplete='off' />
              <button type='submit' className={styles.search_button}>검색</button>
            </form>
            <Genre movieList={movieListGenre} />
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}