import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../../css/csMain/CsMain.module.css';
import CsFooter from '../../../components/Footer/CsFooter';
import CsHeader from '../../../components/Header/CsHeader';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Imagefileshow from '../../../components/csBoard/Imagefileshow';

function CsBoardDetail() {

  function getModifiedFilePath(filepath) {
    return `http://localhost:8085` + filepath;
  }

  function getFileNameFromPath(filepath) {
    const parts = filepath.split('/');
    return parts[parts.length - 1];
  }

  const { boardCd } = useParams();
  const [boardData, setBoardData] = useState(null);
  const navigate = useNavigate();
  const [commentContent, setCommentContent] = useState([]);
  const [commentValue, setCommentValue] = useState([]);
  const [commentWriter, setCommentWriter] = useState([]);
  const [userData, setUserData] = useState({});
  const [profileData, setProfileData] = useState({});

  const [loggedIn, setLoggedIn] = useState(false);
  const [userCd, setUserCd] = useState(null);
  const [cookies] = useCookies(['token']);

  const [loggedInToken, setLoggedInToken] = useState('');

  useEffect(() => {
    // 쿠키에서 토큰 정보 가져오기
    const token = cookies.token;

    if (token) {
      setLoggedIn(true);
      setLoggedInToken(token);
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

  const onDeleteHandler = () => { // 글 삭제 하기
    if (boardData) {
      const boardId = boardData.id;
      axios
        .get(`http://localhost:8085/api/board/delete`, { params: { boardCd: boardCd } })
        .then((response) => {
          console.log('글 삭제 성공');
          window.alert('게시글이 삭제되었습니다');
          // Optionally, you can navigate to a different page after successful deletion
          navigate('/CsBoard');
        })
        .catch((error) => {
          console.log('글 삭제 실패');
        });
    }
  };

  const onSubmitHandler = (e) => {  // 댓글 정보 저장하기
    e.preventDefault();

    const data = new FormData();
    data.append('commentValue', commentValue);

    data.append('commentWriter', userData.username);

    data.append('boardcd', boardCd);

    axios
      .post('http://localhost:8085/api/board/addComment', data)
      .then((response) => {
        console.log('댓글 데이터 전송 성공');
        // 전송 성공 시, 받아온 댓글 데이터를 상태에 저장
        fetchData();
        setCommentValue('');
        setCommentWriter('');
      })
      .catch((error) => {
        console.log('React-axios: 데이터 전송 실패');
      });
  };

  useEffect(() => {
    fetchData();
  }, [boardCd]);

  const fetchData = () => {   // 게시글 정보 가져오기
    axios
      .get(`http://localhost:8085/api/board/boardList`, { params: { boardCd: boardCd } })
      .then((response) => {
        setBoardData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log('데이터 가져오기 실패');
      });

    axios
      .get(`http://localhost:8085/api/board/commentList`, { params: { boardCd: boardCd } })
      .then((response) => {
        setCommentContent(response.data);
        setCommentWriter(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log('댓글 데이터 가져오기 실패');
      });
  };


  return (
    <div className={styles.CsBoardDetail_wrapper}>
      <CsHeader />
      <div className={styles.CsBoardDetail_content}>
        <div className={styles.CsBoardDetail_box_wrapper}>
          <div className={styles.CsBoardDetail_box}>
            <div className={styles.CsBoardDetail_line}></div>
            {boardData && (
              <div className={styles.CsBoardDetail_qnaBox}>
                <div className={styles.CsBoardDetail_qnaBox_writer}><strong>{boardData.writer}</strong></div>
                <div className={styles.CsBoardDetail_qnaBox_content}>{boardData.content}</div>
                <div className={styles.CsBoardDetail_qnaBox_bottom}>
                  <div className={styles.CsBoardDetail_qnaBox_img}>
                    {boardData.filepath && (
                      <a href={boardData.filepath} target="_blank" rel="noopener noreferrer" >
                        첨부 파일 : {getFileNameFromPath(boardData.filepath)}
                      </a>
                    )}
                  </div>
                  <div className={styles.CsBoardDetail_btn_box}>
                    <div className={styles.CsBoardDetail_modify_btn}>
                      <button onClick={() => navigate(`/csBoard_modify/${boardData.boardCd}`)}>글 수정</button>
                    </div>
                    <div className={styles.CsBoardDetail_delete_btn}>
                      <button onClick={onDeleteHandler}>글 삭제</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.CsBoardDetail_commentBox}>
              {Array.isArray(commentContent) && commentContent.length > 0 ? (
                commentContent.map((comment) => (
                  <div key={comment.id} className={styles.CsBoardDetail_commentItem}>
                    {loggedIn && <div><span><strong>{comment.commentWriter}</strong></span></div>}
                    <div className={styles.CsBoardDetail_commentItem_box}>{comment.commentContent}</div>
                  </div>
                ))
              ) : (
                <div className={styles.CsBoardDetail_commentRequest}>
                  {commentContent.length === 0 && <div>No comments yet.</div>}
                </div>
              )}
            </div>
            <div className={styles.CsBoardDetail_answer_bottom}>
              {Array.isArray(commentContent) && (
                <form onSubmit={onSubmitHandler}>
                  {boardData && <input type="hidden" name="boardCd" value={boardData.boardCd} />}
                  <input type="hidden"
                    name="commentWriter"
                    required value={userData.username}
                    onChange={(e) => setCommentWriter(e.target.value)} />
                  <textarea
                    name="commentValue"
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                    placeholder="댓글을 입력하세요"
                  ></textarea>
                  <button type="submit">댓글 작성</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.CsBoardDetail_CsFooter}>
        <CsFooter />
      </div>
    </div>
  );
}

export default CsBoardDetail;
