import React, { useContext, useEffect, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import Charts from './smallComponents/charts';
import { AiOutlinePlus, AiFillEye, AiOutlineLine, AiOutlineClose } from "react-icons/ai";
import { BiSolidPencil, BiDotsHorizontalRounded } from "react-icons/bi";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import UserContext from '../../pages/details/UserContext';
import Alert from '../../components/users/Alert'; import styles from '../../css/details/Detail_num2.module.css';
import styles2 from '../../css/users/Sign.module.css';
import apiUrl from '../../config';


const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";

function Detailnum2(props) {
  const baseUrl = apiUrl;

  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState([]);
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
        .post(baseUrl + "/details/getWantToSee", data, config)
        .then((response) => {
          if (response.data.want == 'want') {
            setWantTo(true);
            const prevRating = response.data.rate;
            if (prevRating) {
              setRating(prevRating);
            }
          } else {
            setWantTo(false);
            const prevRating = response.data.rate;
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
      // 로그인 콘솔 띄우기

      // 데이터 로딩이 완료되면 loading 상태를 false로 설정
      setLoading(false);
    }
  }, []);

  const [rate, setRating] = useState(0);
  const [ratingData, setRatingData] = useState(props.movieData.ratings);
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

  // 비 로그인 모달창
  const [showNeedSignIn, setShowNeedSignIn] = useState(false);

  // 비 로그인 모달창 스크롤 제어
  useEffect(() => {
    if (showNeedSignIn) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = "auto"; }
  }, [showNeedSignIn]);

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

  // 커멘트 비 로그인 확인
  const commentHandler = () => {
    const token = cookies.token;
    if (token) {
      setLoggedIn(true);
      setShowCommentForm(true);
    } else {
      setLoggedIn(false);
      setShowNeedSignIn(true);
    }
  };

  // 커멘트 작성
  const sendFormData = () => {
    const token = cookies.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      },
    };
    const data = new URLSearchParams();
    data.append('commentContent', commentValue);
    data.append('movieId', movie.movieId);
    axios.post(baseUrl + "/details/commentSave", data, config)
      .then((response) => {
        setCommentss(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }


  // 보고싶어요 클릭시 서버로 보고싶어요 데이터 보내서 정보저장
  const wantToSee = () => {
    const token = cookies.token;

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
          .post(baseUrl + "/details/wantToSee", data, config)
          .then((response) => {
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
          .post(baseUrl + "/details/wantToSeeOut", data, config)
          .then(() => {
            setWantTo(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }
    } else {
      setLoggedIn(false);
      setShowNeedSignIn(true);
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
      axios.post(baseUrl + "/details/setRating", data, config)
        .then((response) => {
          setRatingData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      setLoggedIn(false);
      setShowNeedSignIn(true);
    }
  }
  const tooltipArray = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];
  const onPointerMove = (rate) => console.log(rate)
  // userCd

  // 상세보기 영화 내용 요약본 글 줄맞춤
  const addLineBreaks = (text) => {
    if (text == null) {

    } else {
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
                  className={styles.right_top_right_comment} onClick={commentHandler}>
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
                  placeholder='이 작품에 대한 생각을 자유롭게 표현해주세요.'
                />
                <div className={styles.submitButtonContainer}>

                  <button type="submit" className={styles.submitButton} onClick={sendFormData}>
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showNeedSignIn
        ? (<><Alert setShowNeedSignIn={setShowNeedSignIn} resultMessage={'로그인이 필요한 기능이에요.'} />
          <div className={styles2.modalBackground_1} style={{ backgroundColor: 'black' }} /></>)
        : null}
    </div>
  );
}

export default Detailnum2;