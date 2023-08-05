import React from 'react';
import { useCookies } from 'react-cookie';
import { useUserStore } from "../../stores/index.ts";
import styles from '../../css/users/Alert.module.css';

// [회원] 로그아웃 확인 알림창
export default function SignOutAlert({ setShowSignOutAlert, SignOutHeader }) {
    const [cookies, setCookies, removeCookies] = useCookies();
    const { user, removeUser } = useUserStore();

    // 로그아웃 로직
    const signOutHandler = () => {
        removeUser();
        removeCookies('token');
        window.location.href = 'http://localhost:3000';
    }

    return (
        <div>
            <div className={SignOutHeader === 'SignOutHeader' ? styles.modalBackground5 : styles.modalBackground2} style={{ backgroundColor: "black" }} />
            <div className={SignOutHeader === 'SignOutHeader' ? styles.signOut_alert : styles.signOut_alert2}>
                <h2 className={styles.alert_h2}>알림</h2>
                <p className={styles.alert_p}>로그아웃 하시겠어요?</p>
                <hr className={styles.alert_hr} />
                <button className={styles.alert_dualBtn1} onClick={() => { setShowSignOutAlert(false) }}>취소</button>
                <button className={styles.alert_dualBtn2} onClick={signOutHandler}>확인</button>
            </div>
        </div>
    )
}