import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../../css/users/Header_noneBackground.module.css';
import styles2 from '../../css/Header/Header_noneBackground.module.css';
import SignIn from "../users/SignIn";
import SignUp from "../users/SignUp";
import axios from 'axios';
import reel_review_logo from '../../img/users/Reel_Review_logo_white.png';

export default function Header_noneBackground() {

    const [movieList, setMovieList] = useState([]); 
    const [name, setName] = useState('');

    const handleChange = (event) => {
        const { value } = event.target;
        setName(value);
      };
    
      const navigate = useNavigate();

      const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
    
        axios.post("http://localhost:8085/api/movieSearch", formData)
          .then((response) => {
            console.log(response.data);
            setMovieList(response.data);
            navigate('/searchSuccess', { state: { movieList: response.data, searchedName: name } });
          })
          .catch((error) => {
            console.error(error);
          });
      };

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    // 로그인, 회원가입, 약관 동의 모달창 초기화면 출력 여부 : false
    const [signInModalState, setSignInModalState] = useState(false);
    const [signUpModalState, setSignUpModalState] = useState(false);
    
    // 로그인, 회원가입 모달창 상태 변경 함수
    const signInOnOffModal = () => {
        setSignInModalState(!signInModalState);
    };
    const signUpOnOffModal = () => {
        setSignUpModalState(!signUpModalState);
    };
    useEffect(() => {
        if (signInModalState || signUpModalState) {
            document.body.style.overflow = "hidden";  // 스크롤 비활성화
        } else {
            document.body.style.overflow = "auto";    // 스크롤 활성화
        }
    }, [signInModalState, signUpModalState]);
    return (
        <nav className={styles2.topNav}>
            <div className={styles2.navWrapper}>
                <ul className={styles2.leftNav}>
                    <Link to="/"><img src={reel_review_logo} className={styles2.logoSection}/></Link>
                </ul>
                <ul className={styles2.rightNav}>
                    <li className={styles2.findMovies}>
                            <div className={styles2.findWrapper}>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" name="movie" onChange={handleChange} 
                                    placeholder="영화를 검색해보세요" autoComplete="off" 
                                    className={styles2.searchInput}/>
                                    <button type="submit"></button>
                                </form>
                            </div>
                    </li>
                    <li className={styles2.signInBtn} onClick={signInOnOffModal}>로그인</li>
                    {
                        // 로그인 모달창 화면 출력 여부
                        signInModalState ? <SignIn setSignInModalState={setSignInModalState} setSignUpModalState={setSignUpModalState} /> : null
                    }
                    <li className={styles2.signUp_li}><button className={styles2.signUpBtn} onClick={signUpOnOffModal}>회원가입</button></li>
                    {
                        /* 로그인시 유저 프로필 이미지 출력 */
                        // 회원가입 모달창 화면 출력 여부
                        signUpModalState ? <SignUp setSignInModalState={setSignInModalState} setSignUpModalState={setSignUpModalState} /> : null
                    }
                </ul>
            </div>
            {signInModalState && <div className={styles.modalBackground_1} style={{ backgroundColor: "black" }} />}
            {signUpModalState && <div className={styles.modalBackground_1} style={{ backgroundColor: "black" }} />}
        </nav>
    );
}