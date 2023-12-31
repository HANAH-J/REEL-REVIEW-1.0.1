import React from "react";
import apiUrl2 from "../configMain";
import styles from '../css/NotFound.module.css';
import logo from '../img/Header/Reel_Review_logo.png';

const NotFound = () => {
  const mainUrl = apiUrl2;

  // 메인 로고 클릭 이벤트
  const reload = () => {
    window.location.href = mainUrl;
  }

  return (
    <div>
      <nav className={styles.topNav}>
        <div className={styles.navWrapper}>
          <ul className={styles.leftNav} onClick={reload}>
            <img src={logo} className={styles.logoSection} />
          </ul>
        </div>
      </nav>
      <div className={styles.noContent}>
        <span className={styles.noContent_image}></span>
        <div className={styles.noContent_text}>이 URL은 존재하지 않는 URL입니다.</div>
      </div>
    </div>
  );
};

export default NotFound;
