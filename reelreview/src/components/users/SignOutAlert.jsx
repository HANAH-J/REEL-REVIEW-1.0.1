import React from 'react';
import styles from '../../css/users/Alert.module.css';

// [회원] 로그아웃 확인 알림창
export default function SignOutAlert({ setShowSignOutAlert, signOutHandler, SignOutHeader }) {

    return (
        <div>
            <div className={styles.modalBackground2} style={{ backgroundColor: "black" }} />
            <div className={SignOutHeader === 'SignOutHeader' ? styles.signOut_alert : styles.signOut_alert2}>
                <h2 className={styles.alert_h2}>알림</h2>
                <p className={styles.alert_p}>로그아웃 하시겠어요?</p>
                <hr className={styles.alert_hr} />
                <button className={styles.alert_dualBtn1} onClick={() => {setShowSignOutAlert(false)}}>취소</button>
                <button className={styles.alert_dualBtn2} onClick={signOutHandler}>확인</button>
            </div>
        </div>
    )
}