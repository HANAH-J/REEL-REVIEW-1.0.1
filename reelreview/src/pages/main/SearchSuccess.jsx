import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginSuccess_header from '../../components/Header/LoginSuccess_header'
import Footer from '../../components/Footer/Footer'
import styles from '../../css/main/Mainpage.module.css'
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Header from "../../components/Header/Header";
import MovieList from '../../components/Main_Body/MovieList';

export default function SearchSuccess() {

    const [userCd, setUserCd] = useState(null);
    const [userData, setUserData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [cookies, setCookie] = useCookies(['token']);

    const location = useLocation();
    const movieList = location.state ? location.state.movieList : [];
    const searchedName = location.state ? location.state.searchedName : "";

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
                console.log(userDTO.username + ' is logged in');
            })
            .catch((error) => '');
    }

    useEffect(() => {
        const token = cookies.token;
        if (cookies.token) {
            getMain(cookies.token);
        }

    }, [cookies.token]);

    const handleLogout = () => {
        setCookie('token', '', { path: '/' });
    };

    return (
        <div className={styles.SearchSuccess_wrapper}>
            <div>
                {cookies.token ? <LoginSuccess_header profileData={profileData} userData={userData} handleLogout={handleLogout} /> : <Header />}
            </div>
            <div className={styles.SearchSuccess_result_wrapper}>
                <div className={styles.SearchSuccess_result_boxing}>
                    <div className={styles.SearchSuccess_result}>
                        <h3>"{searchedName}" 의 검색결과</h3>
                    </div>
                </div>
                <div className={styles.SearchSuccess_result_box}>
                    <MovieList movieList={movieList} />
                </div>
            </div>
            <Footer />
        </div>
    )
}