import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from './Alert';
import styles from '../../css/users/Password.module.css';

// [회원] 임시 비밀번호 발급 모달창
export default function ForgotPw({ setForgotPwModalState, setSignInModalState }) {

    // 임시 비밀번호 발급 결과 알림창
    const [alertModalState, setAlertModalState] = useState(false);

    // 임시 비밀번호 발급 결과 메세지 저장소
    const [tempPsaswordResult, setTempPasswordResult] = useState('');

    // 임시 비밀번호 발급 로직
    const onSubmitHandler = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8085/api/auth/providerCheck', {
            userEmail: email,
        }).then((response) => {
            // console.log('임시 비밀번호 전송 결과 : ' + response.data);
            if (response.data === 'emailProviderPass') {    // 임시 비밀번호 발급 가능
                axios.post('http://localhost:8085/api/auth/resetPw/sendEmail', {
                    userEmail: email,
                }).then(() => {
                    setTempPasswordResult('emailProviderPass');
                    setAlertModalState(true);
                })
            } else if (response.data === 'noExistEmail') {  // 가입되지 않은 이메일
                setTempPasswordResult('noExistEmail');
                setAlertModalState(true);
            } else if (response.data === 'existProvider') { // 소셜 로그인 회원
                setTempPasswordResult('existProvider');
                setAlertModalState(true);
            } else if (response.data === 'deletedUser') {   // 탈퇴 회원
                setTempPasswordResult('deletedUser');
                setAlertModalState(true);
            }
        }).catch((error) => {
            console.log('데이터 전송 실패', error);
        });
    };



    // 이메일 입력값
    const [email, setEmail] = useState('');

    // 이메일 입력값 검사 결과 저장소
    const isAllFieldsFilled = () => {
        const isEmailValid = validateEmail(email);
        return isEmailValid && alertModalState === false;
    };

    // 이메일 유효성 검사 로직
    const validateEmail = (email) => { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); };

    // 이메일 에러 메세지 저장소
    const [emailError, setEmailError] = useState('');

    // 이메일 유효성 검사 및 에러 메세지 출력
    useEffect(() => {
        if (email && !validateEmail(email)) { setEmailError('정확하지 않은 이메일입니다.'); }
        else { setEmailError(''); }
    }, [email]);

    // 이메일 유효성 검사 통과 시 패스 마크 출력
    useEffect(() => {
        const inputEmail = document.getElementById('forgotEmail');

        if (inputEmail) {
            if (validateEmail(email)) { inputEmail.classList.add(styles.user_forgotPw_inputPass); }
            else { inputEmail.classList.remove(styles.user_forgotPw_inputPass); }
        }
    }, [email]);

    // 임시 비밀번호 발급 모달창 높이
    const [modalHeight, setModalHeight] = useState('');

    // ⓧ버튼 클릭 시 작성 내용 비우기
    const handleClearEmail = () => {
        setEmail('');
    }

    // ⓧ버튼 클릭 시 닫기
    const closeForgotPwModal = () => {
        setForgotPwModalState(false);
    };

    // 모달창 외부 클릭 시 닫기
    useEffect(() => {
        document.addEventListener('mousedown', clickOutsideHandler);
        return () => { document.removeEventListener('mousedown', clickOutsideHandler); };
    });

    const clickOutsideHandler = (e) => {
        const modal = document.querySelector(`.${styles.forgotPw_modal}`);
        if (modal && !modal.contains(e.target)) { setForgotPwModalState(false); }
    };

    // 에러 메시지 출력 시 모달창 높이 변경
    useEffect(() => {
        let errorHeight = 345;

        if (emailError) { errorHeight = 375; }
        setModalHeight(errorHeight);
    }, [emailError]);

    // 알림창 스크롤 제어
    useEffect(() => {
        if (alertModalState) {
            document.body.style.overflow = 'hidden';
        }
    }, [alertModalState]);



    return (
        <div className={styles.forgotPw_modal} style={{ height: `${modalHeight}px` }}>
            <div className={styles.user_forgotPw_buttonClose} onClick={closeForgotPwModal}></div>
            <div className={styles.user_forgotPw_title}>임시 비밀번호 발급</div>
            <hr className={styles.user_forgotPw_hr}></hr>
            <div>
                <h2 className={styles.user_forgotPw_h2}>비밀번호를 잊으셨나요?</h2>
                <p className={styles.user_forgotPw_p}>가입했던 이메일을 적어주세요.</p>
                <p className={styles.user_forgotPw_p}>입력하신 이메일 주소로 임시 비밀번호를 보낼게요.</p>
            </div>
            <form onSubmit={onSubmitHandler}>

                {/* 이메일 입력 */}
                <input
                    type='text'
                    id='forgotEmail'
                    required
                    placeholder='이메일'
                    autoComplete='off'
                    className={emailError ? `${styles.user_forgotPw_input} ${styles.user_forgotPw_inputError}` : styles.user_forgotPw_input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                {email ? (<div className={styles.forgotPw_buttonX} onClick={handleClearEmail}></div>) : (null)}
                <br />
                {emailError && <p className={styles.user_forgotPw_error}>{emailError}</p>}

                {/* 임시 비밀번호 발급 */}
                <button className={styles.forgotPw_btn} disabled={!isAllFieldsFilled()}>이메일 보내기</button>

                {/* 임시 비밀번호 발급 완료*/}
                {(tempPsaswordResult === 'emailProviderPass') &&
                    <Alert
                        resultMessage='임시 비밀번호 발급 이메일을 보냈어요.'
                        setAlertModalState={setAlertModalState}
                        setTempPasswordResult={setTempPasswordResult} />}

                {/* 실패 : 가입되지 않은 이메일 */}
                {tempPsaswordResult === 'noExistEmail' &&
                    <Alert resultMessage='가입되지 않은 이메일입니다.'
                        setAlertModalState={setAlertModalState}
                        setTempPasswordResult={setTempPasswordResult} />}

                {/* 실패 : 소셜 로그인 회원 */}
                {tempPsaswordResult === 'existProvider' &&
                    <Alert
                        resultMessage={`소셜 계정은 릴리뷰 내에서
                                        비밀번호 변경이 불가능합니다.`}
                        setAlertModalState={setAlertModalState}
                        setTempPasswordResult={setTempPasswordResult}
                        alertHeight={130} />}

                {/* 실패 : 탈퇴 회원 */}
                {tempPsaswordResult === 'deletedUser' &&
                    <Alert
                        resultMessage='탈퇴된 이메일입니다.'
                        setAlertModalState={setAlertModalState}
                        setTempPasswordResult={setTempPasswordResult} />}
            </form>

            {/* 임시 비밀번호 발급 결과 알림창 활성화 시 배경화면 색상 변경 */}
            {(tempPsaswordResult === 'emailProviderPass' || tempPsaswordResult === 'noExistEmail' || tempPsaswordResult === 'existProvider' || tempPsaswordResult === 'deletedUser')
                && <div className={styles.modalBackground} style={{ backgroundColor: 'black' }} />}
        </div>
    )
}