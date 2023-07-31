import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import SignIn from "../../components/users/SignIn";
import SignUp from "../../components/users/SignUp";
import styles from '../../css/users/Sign.module.css';
import styles2 from '../../css/Header/Nav.module.css';
import reel_review_logo from '../../img/users/Reel_Review_logo.png';

export default function Header() {

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



    // [회원] 로그인, 회원가입 모달창
    const [signInModalState, setSignInModalState] = useState(false);
    const [signUpModalState, setSignUpModalState] = useState(false);

    // [회원] 로그인, 회원가입 모달창 스크롤 제어
    useEffect(() => {
        if (signInModalState || signUpModalState) { document.body.style.overflow = "hidden"; }
        else { document.body.style.overflow = "auto"; }
    }, [signInModalState, signUpModalState]);



    return (
        <nav className={styles2.topNav}>
            <div className={styles2.navWrapper}>
                <ul className={styles2.leftNav}>
                    <Link to="/"><img src={reel_review_logo} className={styles2.logoSection} /></Link>
                </ul>
                <ul className={styles2.rightNav}>
                    <li className={styles2.findMovies}>
                        <div className={styles2.findWrapper}>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="movie" onChange={handleChange} placeholder="영화를 검색해보세요." autoComplete="off" />
                                <button type="submit"></button>
                            </form>
                        </div>
                    </li>

                    <li className={styles2.signInBtn} onClick={() => { setSignInModalState(true) }}>로그인</li>
                    {   // 로그인 모달창 출력 여부
                        signInModalState ? <SignIn setSignInModalState={setSignInModalState} setSignUpModalState={setSignUpModalState} /> : null
                    }
                    <li className={styles2.signUp_li}><button className={styles2.signUpBtn} onClick={() => { setSignUpModalState(true) }}>회원가입</button></li>
                    {   // 회원가입 모달창 출력 여부
                        signUpModalState ? <SignUp setSignInModalState={setSignInModalState} setSignUpModalState={setSignUpModalState} /> : null
                    }
                </ul>
            </div>
            {/* 로그인, 회원가입 모달창 활성화 시 배경화면 색상 변경 */}
            {signInModalState && <div className={styles.modalBackground_1} style={{ backgroundColor: "black" }} />}
            {signUpModalState && <div className={styles.modalBackground_1} style={{ backgroundColor: "black" }} />}
        </nav>
    );
}