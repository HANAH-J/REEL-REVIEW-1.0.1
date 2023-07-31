import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../css/csMain/CsMain.module.css';
import axios from 'axios';
import CsHeader from '../Header/CsHeader';
import CsFooter from '../Footer/CsFooter';

export default function CsBoard_modify() {

    const { boardCd } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [writer, setWriter] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, [boardCd]);

    const fetchData = () => {
        axios
            .get(`http://localhost:8085/api/board/boardList`, { params: { boardCd: boardCd } })
            .then((response) => {
                const { title, content, writer } = response.data;
                setTitle(title);
                setContent(content);
                setWriter(writer);
            })
            .catch((error) => {
                console.log('데이터 가져오기 실패');
            });
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', title);
        data.append('content', content);
        data.append('writer', writer);
        data.append('file', file);

        axios
            .post(`http://localhost:8085/api/board/update/${boardCd}`, data)
            .then((response) => {
                console.log('게시글 수정 성공');
                window.alert('게시글 수정 완료');
                // 수정이 완료되면 게시판 세부 페이지로 이동
                navigate(`/CsBoardDetail/${boardCd}`);
            })
            .catch((error) => {
                console.log('게시글 수정 실패');
            });
    };


    return (
        <div className={styles.CsBoard_modify_wrapperBox}>
            <div className={styles.CsBoard_modify_header_wrapper}>
                <CsHeader />
            </div>
            <div className={styles.CsBoard_modify_wrapper}>
                <form onSubmit={onSubmitHandler}>
                    <div className={styles.CsBoard_modify_form}>
                        <div className={styles.CsBoard_modify_title}>
                            <h3>게시글 수정하기</h3>
                        </div>
                        <div className={styles.CsBoard_modify_form_box}>
                            <div className={styles.CsBoard_modify_form_title}>
                                <label htmlFor="title">제목</label>
                                <input type="text" id="title" name="title" value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                readOnly/>
                            </div>
                            <div className={styles.CsQna_hidden}>
                            <div>작성자</div>
                            <div className={styles.CsQna_box_body4_writer}></div>
                            <input type="text"
                                    name="writer"
                                    required value={writer}
                                    onChange={(e) => setWriter(e.target.value)}/>
                        </div>
                            <div className={styles.CsBoard_modify_form_content}>
                                <label htmlFor="content">내용</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                            </div>
                            <div className={styles.CsBoard_modify_form_file}>
                                <label htmlFor="file">첨부 파일을 추가 하시려면 클릭하세요</label>
                                <input type="file" id="file" name="file" onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                        </div>
                        <button type="submit">수정 완료</button>
                    </div>
                </form>
            </div>
            <div className={styles.CsFooter}>
            <CsFooter />
            </div>
        </div>
    )
}