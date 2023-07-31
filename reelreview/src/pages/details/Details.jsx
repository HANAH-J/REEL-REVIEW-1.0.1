import { useLocation } from "react-router-dom";
import Detailtop from "../../components/details/Detail_top";
import Detailnum2 from "../../components/details/Detail_num2";
import Header from "../../components/Header/Header";
import Header_noneBackground from "../../components/Header/Header_noneBackground";
import styles from '../../css/details/Detail.module.css';
import Detailnum3 from "../../components/details/Detail_num3";
import Detailnum4 from "../../components/details/Detail_num4";
import Detailnum5 from "../../components/details/Detail_num5";
import Detailnum6 from "../../components/details/Detail_num6";
import Footer from "../../components/Footer/Footer";
import LoginSuccess_header from "../../components/Header/LoginSuccess_header";
import LoginSuccess_header_noneBackground from "../../components/Header/LoginSuccess_header_noneBackground";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import axios from "axios";
import UserContext from './UserContext';


function Details() {
    const [movieData, setMovieData] = useState(null);
    const location = useLocation();
    const { item } = location.state;
    const[commentss,setCommentss] = useState();
    const [cookies, setCookie] = useCookies(['token']);
    const [userCd, setUserCd] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [userEmail, setUserEmail] = useState('');

    const [scrolled, setScrolled] = useState(false);

    const headerStyle = {
        opacity: scrolled ? 1 : 0, 
        transition: "opacity 3s ease-in-out",
      };
      
     
      const header2Style = {
        opacity: scrolled ? 0 : 1, 
        transition: "opacity 3s ease-in-out",
    
      };
      
      const renderHeader = () => {
        const transitionDuration = 1000; 
        const transitionStyle = {
          transition: `opacity ${transitionDuration}ms ease-in-out`,
        };
      
        if (scrolled) {
            if (loggedIn) {
              return (
                <div style={{ ...headerStyle, ...transitionStyle }}>
                  <LoginSuccess_header profileData={profileData} userData={userData} />
                </div>
              );
            } else {
              return (
                <div style={{ ...headerStyle, ...transitionStyle }}>
                  <Header />
                </div>
              );
            }
          } else {
            if (loggedIn) {
              return (
                <div style={{ ...header2Style, ...transitionStyle }}>
                  <LoginSuccess_header_noneBackground profileData={profileData} userData={userData} />
                </div>
              );
            } else {
              return (
                <div style={{ ...header2Style, ...transitionStyle }}>
                  <Header_noneBackground />
                </div>
              );
            }
          }
        };
      

    useEffect(() => {
        const token = cookies.token;

        if (token) {
            setLoggedIn(true);
            fetchUserData(token); // 토큰이 유효하다면 사용자 데이터를 가져오는 함수 호출
            console.log('상세페이지 토큰' + token);

        } else {
            setLoggedIn(false);
            console.log('not logged in');
            //alert('로그인을 해주세요.'); 
            //navigate('/'); // 토큰이 없을 경우 메인으로 리디렉션
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
                    role: responseData.userDTO.role
                };

                const profileDTO = {
                    status: responseData.profileDTO.status,
                    bgImage: responseData.profileDTO.bgImage,
                    pfImage: responseData.profileDTO.pfImage
                };

                setUserData(userDTO);
                setProfileData(profileDTO);
                console.log(userDTO.username + ' is logged in');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // console.log(item);
    useEffect(() => {
        const movieId = item.movieId;
        console.log(movieId);
        axios.get("http://localhost:8085/api/getMovieFulldata", { params: { movieId: movieId } }).then((response) => {
            setMovieData(response.data);
            setCommentss(response.data.comments)
            // console.log(movieData);
        }).catch((error) => { console.log(error) })
    }, [item.movieId]);

    useEffect(() => {
        const handleScroll = () => {
          const scrollY = window.scrollY;
          const scrollThreshold = 50; // 일정 이상 스크롤이 내려간 경우를 판단하는 값
          if (scrollY > scrollThreshold) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
          // 컴포넌트가 언마운트될 때 스크롤 이벤트 리스너 제거
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);
      
      
      
      return (
      <UserContext.Provider value={{ commentss , setCommentss}}>
        <div className={styles.Detail_box}>
       {renderHeader()}
        {movieData ? (<>
          
            <Detailtop item={item} movieData={movieData} />
            <Detailnum2 item={item} movieData={movieData} />
            <Detailnum3 item={item} movieData={movieData} />
            <Detailnum4 item={item} movieData={movieData} />
            <Detailnum5 item={item} movieData={movieData} />
            <Detailnum6 item={item} movieData={movieData} />
   
        </>) : (<></>)}
        <Footer></Footer>
    </div>
    </UserContext.Provider>
    );
}


export default Details;
