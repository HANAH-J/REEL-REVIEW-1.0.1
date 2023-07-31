import React from "react";
import styles from '../../css/csMain/CsMain.module.css';

export default function CsFooter() {
    return (
        <div className={styles.CsMain_footer}>
            <div className={styles.CsMain_footer_1}>
              릴리뷰 서비스 이용약관 &nbsp;|&nbsp; 릴리뷰 서비스 이용약관 &nbsp;|&nbsp; 
              개인정보 처리 방침 &nbsp;|&nbsp; 회사소개 &nbsp;|&nbsp; 채용정보
            </div>
            <div  className={styles.CsMain_footer_2}>
              왓챠피디아 광고 문의 &nbsp; | &nbsp; ad@reelreview.com
            </div>
            <div  className={styles.CsMain_footer_3}>
              제휴 및 대외 협력 &nbsp; | &nbsp; https://reelreview.team/contact
            </div>
          </div>
    )
}