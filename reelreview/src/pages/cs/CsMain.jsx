import React from 'react'
import styles from '../../css/csMain/CsMain.module.css';
import { Link } from "react-router-dom";
import CsHeader from '../../components/Header/CsHeader';  
import CsFooter from '../../components/Footer/CsFooter';

export default function CsMain(){

    return(
        <div className={styles.CsMain_container}>
          <CsHeader/>
          <div className={styles.CsMain_big_logo_container}>
            <div className={styles.CsMain_big_logo}></div>
          </div>
          <div className={styles.CsMain_body}>
            <div className={styles.CsMain_body_inbox}>
              <div className={styles.CsMain_body_faq}>
                <Link to="/CsFaq"><strong>자주 묻는 질문</strong></Link>
              </div>
              <div className={styles.CsMain_body_qna}>
                <Link to="/CsQna"><strong>문의등록</strong></Link>
              </div>
            </div>
          </div>
          <CsFooter/>
        </div>
    )
}
