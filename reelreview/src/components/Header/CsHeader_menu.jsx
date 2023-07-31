import React, { useState } from "react";
import styles from '../../css/csMain/CsMain.module.css';
import { Link } from "react-router-dom";

export default function CsHeader_menu() {
    
    return (
        <div className={styles.CsHeader_menu_modal}>
            <div className={styles.CsHeader_menu_qustion}>
                <Link to="/CsBoard">문의 내역</Link>
            </div>
            <div className={styles.CsHeader_menu_write}>
                <Link to="/CsQna">문의 등록</Link>
            </div>
            <div className={styles.CsHeader_menu_home}>
                <Link to="/csMain">문의 센터</Link>
            </div>
        </div>
    )
}