import React, { useState } from 'react';
import styles from '../../../css/csMain/CsMain.module.css';
import CsFooter from '../../../components/Footer/CsFooter';
import CsHeader from '../../../components/Header/CsHeader';
import { BiChevronLeft } from "react-icons/bi";
import { Link } from "react-router-dom";

function CsFaq() {
    const [activeItem, setActiveItem] = useState(null);

    const handleItemClick = (index) => {
        setActiveItem(index);
    };

    const faqData = [
        {
            question: '페이스북 로그인 버튼이 보이지 않아요',
            answer: '페이스북 로그인 연동은 종료되었습니다. 페이스북으로 왓챠피디아를 시작하셨다면, 왓챠피디아 이메일 계정은 페이스북 이메일 계정과 동일힙니다'
        },
        {
            question: 'TV 프로그램은 없나요?',
            answer: '현재 시스템에서는 TV 프로그램을 지원하지 않습니다.'
        },
        {
            question: '찾는 영화가 없어요',
            answer: '찾는 영화가 없을 경우 아직 업데이트가 되지 않았거나 업데이트 예정입니다.'
        },
        {
            question: '업데이트 주기는 어떻게 되나요?',
            answer: '업데이트 주기는 매월 첫 주 월요일에 이루어집니다.'
        }
    ];

    return (
        <div className={styles.CsFaq_box}>
            <CsHeader />
            <div className={styles.CsFaq_box_wrapper}>
                <div className={styles.CsFaq_box_body}>
                    <div className={styles.CsFaq_box_body_header}>
                        <div><Link to="/csMain">릴리뷰 문의센터</Link></div>
                        <div className={styles.CsFaq_box_body_header_icon}><BiChevronLeft /></div>
                        <div>자주 묻는 질문</div>
                    </div>
                    <div className={styles.CsFaq_box_box_body2}>
                        <div className={styles.CsFaq_box_box_body2_header}>자주 묻는 질문</div>
                        <div className={styles.CsFaq_box_box_body2_faq}>
                            <ul>
                                {faqData.map((item, index) => (
                                    <li key={index} onClick={() => handleItemClick(index)}>
                                        {activeItem === index ? (
                                            <div>&nbsp; {item.answer}</div>
                                        ) : (
                                            <div>&nbsp; {item.question}</div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <CsFooter />
        </div>
    );
}

export default CsFaq;
