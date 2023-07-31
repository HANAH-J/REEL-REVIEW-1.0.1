import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../../css/csMain/CsMain.module.css';
import CsFooter from '../../../components/Footer/CsFooter';
import CsHeader from '../../../components/Header/CsHeader';
import axios from 'axios';

function CsBoard() {
    const [list, setList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');

    const navigate = useNavigate();

    const [boardWriter, setBoardWriter] = useState('');
    const [boardList, setBoardList] = useState([]);

    const handleChange = (event) => {
        const { value } = event.target;
        setBoardWriter(value);
      };

      const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('boardWriter', boardWriter);
      
        axios.get("http://localhost:8085/api/board/searchBoardWriter", {
            params: {
              writer: boardWriter,
            }
          })
          .then((response) => {
            console.log(response.data);
            const sortedBoardList = response.data.sort((a, b) => b.boardCd - a.boardCd);
            setBoardList(response.data);
            navigate('/searchSuccessWriter', { state: { boardList: response.data, searchedName: boardWriter } });
          })
          .catch((error) => {
            console.error(error);
          });
      };

    useEffect(() => {
        fetchData();
    }, [currentPage, searchKeyword]);

    const fetchData = () => {
        axios.get('http://localhost:8085/api/board/list', {
            params: {
                page: currentPage,
                size: 5,
                searchKeyword: searchKeyword,
            },
        })
            .then((response) => {
                const modifiedData = response.data.content.map((data) => ({
                    ...data,
                    regdate: data.regdate.substring(0, 10), // 'yyyy-MM-dd' 
                }));
                setList(modifiedData);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.log('데이터 전송 실패');
            });
    };

    const goToPrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    return (
        
            
            <div className={styles.CsBoard_box_wrapper}>
                 <CsHeader />
                {/* 테이블과 페이지네이션 출력 */}
                <div className={styles.CsBoard_line}>
                    <div className={styles.CsBoard_box}>
                        <div className={styles.CsBoard_header1}>문의 내역</div>
                        <div className={styles.CsBoard_headerBox}>
                            <div className={styles.CsBoard_header2}>
                                문의하신 내용은 문의센터에서 확인 후 영업일 기준 1~3일 이내에 답변 드리도록 하겠습니다.
                                <br />
                                * 운영 시간: 평일 10:00 ~ 18:00 (주말, 공휴일 제외)
                            </div>
                            <div className={styles.CsBoard_header3_box}>
                                <div className={styles.CsBoard_header3_img}></div>
                                <div className={styles.CsBoard_header3_search}>
                                    <form onSubmit={handleSubmit}>
                                        <input type="text"
                                            name="writer"
                                            onChange={handleChange}
                                            placeholder="작성자 검색"
                                            autoComplete="off" />
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className={styles.CsBoard_table_box}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>글번호</th>
                                        <th>제목</th>
                                        <th>작성일</th>
                                        <th>작성자</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((data) => (
                                        <tr key={data.boardCd}>
                                            <td>{data.boardCd}</td>
                                            <td className={styles.CsBoard_hover}>
                                                <Link to={`/CsBoardDetail/${data.boardCd}`}>
                                                    {data.title}
                                                </Link>
                                            </td>
                                            <td>{data.regdate}</td>
                                            <td>{data.writer}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={styles.CsBoard_pageBox}>
                                <button className={styles.CsBoard_page_right} onClick={goToPrevPage} disabled={currentPage === 0}>&lt;&lt; </button>
                                <span>{currentPage + 1} p / {totalPages} p</span>
                                <button className={styles.CsBoard_page_right} onClick={goToNextPage} disabled={currentPage === totalPages - 1}>&gt;&gt;</button>
                            </div>
                        </div>
                    </div>
                </div>
                <CsFooter />
            </div>
       
    );
}

export default CsBoard;



