import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from '../../../css/csMain/CsMain.module.css';
import CsFooter from '../../../components/Footer/CsFooter';
import CsHeader from '../../../components/Header/CsHeader';
import axios from 'axios';

export default function SearchSuccessWriter() {
    const navigate = useNavigate();
    const location = useLocation();
    const boardList = location.state ? location.state.boardList : [];
    const searchedName = location.state ? location.state.searchedName : "";
    const pageSize = 5;

    const [boardWriter, setBoardWriter] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        setTotalPages(Math.ceil(boardList.length / pageSize));
    }, [boardList]);

    const handleChange = (event) => {
        const { value } = event.target;
        setBoardWriter(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('boardWriter', boardWriter);

        axios
            .get('http://localhost:8085/api/board/searchBoardWriter', {
                params: {
                    writer: boardWriter,
                },
            })
            .then((response) => {
                console.log(response.data);
                const sortedBoardList = response.data.sort((a, b) => b.boardCd - a.boardCd);
                setCurrentPage(0);
                navigate('/searchSuccessWriter', {
                    state: { boardList: response.data, searchedName: boardWriter },
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    const paginatedBoardList = boardList.slice(currentPage * pageSize, (currentPage + 1) * pageSize);



    return (
        <div>
            <CsHeader />
            <div className={styles.CsBoard_box_wrapper}>
                {/* 테이블과 페이지네이션 출력 */}
                <div className={styles.CsBoard_line}>
                    <div className={styles.CsBoard_box}>
                        <div className={styles.CsBoard_header1}>
                            문의 내역 &gt;&gt; "{searchedName}"님의 작성글
                        </div>
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
                                        <input
                                            type="text"
                                            name="writer"
                                            onChange={handleChange}
                                            placeholder="작성자 검색"
                                            autoComplete="off"
                                        />
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
                                    {paginatedBoardList.map((board) => {
                                        const formattedDate = new Date(board.regdate).toLocaleDateString('ko-KR');
                                        return (
                                            <tr key={board.boardCd}>
                                                <td>{board.boardCd}</td>
                                                <td className={styles.CsBoard_hover}>
                                                    <Link to={`/CsBoardDetail/${board.boardCd}`}>{board.title}</Link>
                                                </td>
                                                <td>{formattedDate}</td>
                                                <td>{board.writer}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.CsBoard_pageBox}>
                            <button className={styles.CsBoard_page_right} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>&lt;&lt; </button>
                            <span>{currentPage + 1} p / {totalPages} p</span>
                            <button className={styles.CsBoard_page_right} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>&gt;&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
            <CsFooter />
        </div>
    );
}

