import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import styles from '../../../css/csMain/CsMain.module.css';
import { Link, useNavigate } from "react-router-dom";
import CsFooter from '../../../components/Footer/CsFooter';
import CsHeader from '../../../components/Header/CsHeader';
import { BiChevronLeft } from "react-icons/bi";
import { useCookies } from 'react-cookie';

function CsQna() {

  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const [loggedInToken, setLoggedInToken] = useState('');
  const [cookies] = useCookies(['token']);
  const [userData, setUserData] = useState({});
  const [userCd, setUserCd] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState({});


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

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", title);
    data.append("content", content);
    data.append("file", file);
    data.append("writer", userData.username);


    axios.post('http://localhost:8085/api/board/writepro', data).then((response) => {
      alert('작성 완료!!'); navigate('/CsBoard');
    }).catch((error) => {
      console.log('React-axios : 데이터 전송 실패');
    })

  };

  return (

    <div className={styles.CsQna_box_wrapper}>
      <CsHeader />
      <div className={styles.CsQna_box2}>
        <div className={styles.CsQna_box_body}>
          <div className={styles.CsQna_box_body_header}>
            <div>
              <Link to="/csMain">
                <a>릴리뷰 문의센터</a>
              </Link>
            </div>
            <div className={styles.CsQna_box_body_header_icon}><BiChevronLeft /></div>
            <div>문의 하기</div>
          </div>
          <div className={styles.CsQna_box_box_body2}>
            <form onSubmit={onSubmitHandler}>
              <div className={styles.CsQna_box_box_body2_header}>문의 등록</div>
              <div className={styles.CsQna_box_box_body2_header_info}>문의하신 내용은 문의센터에서 확인 후 영업일 기준 1~3일 이내에 답변 드리도록 하겠습니다.<br />
                * 운영 시간: 평일 10:00 ~ 18:00 (주말, 공휴일 제외)
              </div>
              <div className={styles.CsQna_box_body4}>
                <div>문의 제목</div>
                <div className={styles.CsQna_box_body4_title}>
                  <input type="text" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
              </div>
              <div className={styles.CsQna_hidden}>
                <div>작성자</div>
                <div className={styles.CsQna_box_body4_writer}></div>
                <input type="text"
                  name="writer"
                  required value={userData.username}
                  onChange={(e) => setWriter(e.target.value)} />
              </div>
              <div className={styles.CsQna_box_body3}>
                <div>문의 내용</div>
                <div className={styles.CsQna_box_body3_info}>
                  <textarea name="content" cols="60" rows="9" required placeholder="문의 내용을 최대한 자세하게 작성해 주세요. 
                            - 부적절한 내용이 포함되어 있는 경우 답변이 어려울 수 있는 점 양해 부탁드립니다 -"
                    value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                </div>
              </div>
              <div className={styles.CsQna_box_body5}>
                <div>첨부파일 (선택사항)</div>
                <div className={styles.CsQna_box_body5_file}>
                  <input type="file" name='file' onChange={(e) => setFile(e.target.files[0])} /><a>파일추가</a>
                </div>
              </div>
              <button className={styles.CsQna_button} type='submit'>제출</button>
            </form>
          </div>
        </div>
      </div>
      <CsFooter />
    </div>

  );
}


export default CsQna;