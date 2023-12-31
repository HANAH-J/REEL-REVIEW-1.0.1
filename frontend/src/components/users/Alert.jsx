import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useUserStore } from "../../stores/index.ts";
import apiUrl2 from '../../configMain.js';
import styles from '../../css/users/Alert.module.css';

// [회원] 알림창
export default function Alert({
    setNoExistEmailAlert, setDeletedUserAlert, setWrongPasswordAlert,       // 로그인
    signUpAlert, setSignUpAlert, setTermsModalState, setSignUpModalState,   // 회원가입
    setAlertModalState, setTempPasswordResult,                              // 임시 비밀번호 발급
    setChangePasswordAlert,                                                 // 비밀번호 변경
    setShowWithdrawCompleteModal, goMain,                                   // 회원탈퇴
    setShowWithdrawFailureModal, setShowWithdrawModal,                      // 소셜 회원탈퇴
    setShowNeedSignIn,                                                      // 비 로그인
    alertHeight, navigate, resultMessage }) {
    const mainUrl = apiUrl2;

    const [cookies, setCookies, removeCookies] = useCookies();
    const { user, removeUser } = useUserStore();

    // 로그아웃 로직
    const signOutHandler = () => {
        setCookies('token', '', { expires: new Date() });
        removeUser();
        removeCookies('token');
        window.location.href = mainUrl;
    }

    const confirmHandler = () => {
        if (typeof setNoExistEmailAlert === 'function') {               // 로그인 : 가입되지 않은 이메일
            setNoExistEmailAlert(false);
        } else if (typeof setDeletedUserAlert === 'function') {         // 로그인 : 탈퇴된 이메일
            setDeletedUserAlert(false);
        } else if (typeof setWrongPasswordAlert === 'function') {       // 로그인 : 일치하지 않는 비밀번호
            setWrongPasswordAlert(false);
        } else if (typeof setSignUpAlert === 'function') {              // 회원가입 : 회원가입 완료
            setSignUpAlert(false);
            setTermsModalState(false);
            setSignUpModalState(false);
        } else if (typeof setAlertModalState === 'function') {          // 임시 비밀번호 발급
            setAlertModalState(false);
            setTempPasswordResult('');
        } else if (typeof setChangePasswordAlert === 'function') {      // 비밀번호 변경
            setChangePasswordAlert(false);
            signOutHandler();
        } else if (typeof setShowWithdrawCompleteModal === 'function') { // 회원탈퇴
            setShowWithdrawCompleteModal(false);
            goMain();
        } else if (typeof setShowWithdrawFailureModal === 'function') { // 소셜 회원탈퇴
            setShowWithdrawFailureModal(false);
            setShowWithdrawModal(false);
        } else if (typeof setShowNeedSignIn === 'function') {           // 비 로그인
            setShowNeedSignIn(false);
        } else {
            navigate('/');
        }
    };

    // 모달창 스크롤 제어
    useEffect(() => {
        if (signUpAlert) { document.body.style.overflow = 'hidden'; }
    }, [signUpAlert]);

    return (
        <div className={alertHeight === 130 ? styles.forgotPw_alert2 : styles.forgotPw_alert}>
            <h2 className={styles.alert_h2}>알림</h2>
            <p className={styles.alert_p}>{resultMessage}</p>
            <hr className={styles.alert_hr} />
            <button className={styles.alert_btn} onClick={confirmHandler}>확인</button>
        </div>
    )
}