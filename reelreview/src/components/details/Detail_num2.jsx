import styles from '../../css/details/Detail_num2.module.css';
import React, { useContext, useEffect, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import Charts from './smallComponents/charts';
import { AiOutlinePlus, AiFillEye, AiOutlineLine, AiOutlineClose } from "react-icons/ai";
import { BiSolidPencil, BiDotsHorizontalRounded } from "react-icons/bi";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import UserContext from '../../pages/details/UserContext';


const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";

function Detailnum2(props) {
  const [loading, setLoading] = useState(true);
  const [comment,setComment] = useState([]);
  const { commentss, setCommentss } = useContext(UserContext);
  useEffect(() => {
    const token = cookies.token;

    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      };
      const data = new URLSearchParams();
      data.append('movieId', movie.movieId);

      axios
        .post("http://localhost:8085/details/getWantToSee", data, config)
        .then((response) => {
          if (response.data.want == 'want') {
            setWantTo(true);
            const prevRating = response.data.rate;
            console.log(prevRating);
            if (prevRating) {
              setRating(prevRating);
            }
          } else {
            setWantTo(false);
            const prevRating = response.data.rate;
            console.log(prevRating);
            if (prevRating) {
              setRating(prevRating);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          // 데이터 로딩이 완료되면 loading 상태를 false로 설정
          setLoading(false);
        });
    } else {
      setLoggedIn(false);
      console.log('not logged in');
      console.log('token' + token);
      // 로그인 콘솔 띄우기

      // 데이터 로딩이 완료되면 loading 상태를 false로 설정
      setLoading(false);
    }
  }, []);

  const [rate, setRating] = useState(0);
  const [ratingData,setRatingData] = useState(props.movieData.ratings);
  console.log(ratingData);
  const sum = ratingData.reduce((total, rateObject) => total + rateObject.rate, 0);
  const avg = ratingData.length === 0 ? 0 : sum / ratingData.length;
  
  const avgs = avg.toFixed(1);


  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [loggedIn, setLoggedIn] = useState(false);
  const movie = props.item;
  const [wantTo, setWantTo] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const showModalHandler = () => {
    setShowCommentForm(!showCommentForm);
  };
  const handleCommentChange = (event) => {
    setCommentValue(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    hideModalHandler();
  };

  const hideModalHandler = () => {
    setShowCommentForm(false);
  };

  const sendFormData = () => {
    setShowCommentForm(false);
    console.log(commentValue);
    const token = cookies.token;
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      };
      setLoggedIn(true);
      const data = new URLSearchParams();
      data.append('commentContent', commentValue);
      data.append('movieId', movie.movieId);
      axios.post("http://localhost:8085/details/commentSave", data, config)
        .then((response) => {
          console.log(response.data);
          setCommentss(response.data);
          
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      setLoggedIn(false);
      console.log('not logged in');
      console.log('token' + token);
      alert('로그인을 해주세요.');
      // 로그인 콘솔 띄우기
    }
  };


  // 보고싶어요 클릭시 서버로 보고싶어요 데이터 보내서 정보저장
  const wantToSee = () => {
    const token = cookies.token;
    console.log(wantTo);

    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      };
      setLoggedIn(true);

      if (!wantTo) {
        // 보고싶어요 등록 처리
        const data = new URLSearchParams();
        data.append('movieId', movie.movieId);
        axios
          .post("http://localhost:8085/details/wantToSee", data, config)
          .then((response) => {
            console.log(response.data);
            
            setWantTo(true);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      } else {
        // 보고싶어요 해제 처리
        const data = new URLSearchParams();
        data.append('movieId', movie.movieId);
        axios
          .post("http://localhost:8085/details/wantToSeeOut", data, config)
          .then((response) => {
            console.log(response.data);
            setWantTo(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }
    } else {
      setLoggedIn(false);
      console.log('not logged in');
      console.log('token' + token);
      alert("로그인하세요");
    }
  }




  //레이팅 클릭시 서버로 데이터 보내서 정보 저장
  const handleRating = (rate) => {
    const token = cookies.token;
    setRating(rate);
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      };
      setLoggedIn(true);

      const data = new URLSearchParams();
      // data.append('token', token);
      data.append('rate', rate);
      data.append('movieId', movie.movieId);
      // data.append('config',config)
      axios.post("http://localhost:8085/details/setRating", data, config)
        .then((response) => {
          console.log(response.data);
          setRatingData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      setLoggedIn(false);
      console.log('not logged in');
      console.log('token' + token);
      alert('로그인하세요');
    }
  }
  const tooltipArray = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];
  const onPointerMove = (rate) => console.log(rate)
  // userCd

  // 상세보기 영화 내용 요약본 글 줄맞춤
  const addLineBreaks = (text) => {
    if(text==null){
      
    }else{
      const sentences = text.split('.');
      let result = [];

      sentences.forEach((sentence) => {
        const words = sentence.trim().split(/\s+/);
        let currentLine = "";

        words.forEach((word) => {
          if (currentLine.length + word.length + 1 <= 75) {
            currentLine += (currentLine.length > 0 ? " " : "") + word;
          } else {
            result.push(currentLine.trim());
            currentLine = word;
          }
        });

        if (currentLine !== "") {
          result.push(currentLine.trim());
        }
      });

      return result.map((sentence, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {index > 0 && <br />}
          {sentence}
        </React.Fragment>
      ));
    }
    };
    if (loading) {
      return <div>Loading...</div>;
    }
  return (

    <div className={styles.wrapper}>
      <div className={styles.smallSizeWrapper}>
        <div className={styles.leftSide}>
          <div className={styles.leftTop}>
            <div className={styles.image}>
              <img src={IMG_BASE_URL + props.item.poster_path} alt="poster" />
            </div>
          </div>
          <div className={styles.leftBottom}>
            <div className={styles.leftBottomTypo}>
              <p>우리 사이트 별점 그래프</p>
              <span>평균 ★{avgs}</span><div className={styles.numPeople}>({ratingData.length}명)</div>
            </div>
            <div className={styles.leftBottom_chart}>
              <Charts ratingData={ratingData} />
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.rightData}>
            <div className={styles.right_top}>
              <div className={styles.right_top_left}>
                <div className={styles.right_top_left_stars}>
                  <div className={styles.rating_result}>
                    <Rating onClick={handleRating} transition size={50} allowFraction tooltipArray={tooltipArray} onPointerMove={onPointerMove} initialValue={rate} />

                  </div>
                </div>
                <p>평가하기</p>
              </div>
              <div className={styles.right_top_middle}>
                <div className={styles.right_top_middle_avg}>
                  {avgs}
                </div>
                <div className={styles.right_top_middle_avg_typo}>
                  평균 별점 ({ratingData.length}명)
                </div>

              </div>
              <div className={styles.right_top_right}>
                {wantTo ? (
                  <>
                    <div
                      className={`${styles.right_top_right_wantToSee} ${hovered ? styles.wantToSee_icon_hovered : ''}`}
                      onClick={() => wantToSee(wantTo)}
                      onMouseEnter={() => setHovered(true)} // 마우스가 컴포넌트에 진입 시 hovered 상태로 설정
                      onMouseLeave={() => setHovered(false)} // 마우스가 컴포넌트에서 나갈 시 hovered 상태 해제
                    >
                      <div className={styles.wantToSee_icon}>
                        <AiOutlineLine size={40} strokeWidth={20} />
                      </div>
                      <p>보고싶어요</p>
                    </div>
                  </>
                ) : (<>
                  <div
                    className={`${styles.right_top_right_wantToSee} ${hovered ? styles.wantToSee_icon_hovered : ''}`}
                    onClick={() => wantToSee(wantTo)}
                    onMouseEnter={() => setHovered(true)} // 마우스가 컴포넌트에 진입 시 hovered 상태로 설정
                    onMouseLeave={() => setHovered(false)} // 마우스가 컴포넌트에서 나갈 시 hovered 상태 해제
                  >
                    <div className={styles.wantToSee_icon}>
                      <AiOutlinePlus size={40} strokeWidth={20} />
                    </div>
                    <p>보고싶어요</p>
                  </div>
                </>
                )}
                <div
                  className={styles.right_top_right_comment} onClick={()=>setShowCommentForm(true)}>
                  <div className={styles.wantToSee_icon}>
                    <BiSolidPencil size={40} strokeWidth={0} />
                  </div>
                  <p>커멘트</p>
                </div>
                <div className={styles.right_top_right_watching}>
                  <div className={styles.wantToSee_icon}>
                    <AiFillEye size={40} />
                  </div>
                  <p>보는중</p>
                </div>
                <div className={styles.right_top_right_more}>
                  <div className={styles.wantToSee_icon}>
                    <BiDotsHorizontalRounded size={40} />
                  </div>
                  <p>더보기</p>
                </div>
              </div>
            </div>
            <div className={styles.right_bottom}>
              <p>{addLineBreaks(props.item.overview)}</p>
              
            </div>
            <div className={styles.right_bottom_ad}></div>

          </div>
        </div>

      </div>
      {showCommentForm && (
        <div className={styles.modalWrapper}>
          <div className={styles.modal}>
            <div onClick={hideModalHandler} className={styles.closeButton}>
              <AiOutlineClose />
            </div>
            <div className={styles.modalContent}>
              <h2>{movie.title}</h2>
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={commentValue}
                  onChange={handleCommentChange}
                  rows={4}
                  cols={50}
                />
                <div className={styles.submitButtonContainer}>

                  <button type="submit" className={styles.submitButton} onClick={sendFormData}>
                    작성하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detailnum2;