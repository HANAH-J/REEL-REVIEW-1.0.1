import React from "react";
import styles from '../css/NotFound.module.css';
import logo from '../img/Header/Reel_Review_logo.png';

const NotFound = () => {

  // 메인 로고 클릭 이벤트
  const reload = () => {
    window.location.href = 'http://localhost:3000';
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
