import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useUserStore } from '../../stores/index.ts';
import axios from 'axios';
import OAuth2 from './OAuth2.jsx';
import ForgotPw from './ForgotPw';
import Alert from './Alert.jsx';
import styles from '../../css/users/Sign.module.css';
import reel_review_logo from '../../img/users/Reel_Review_logo.png';

// [회원] 로그인 모달창
export default function SignIn({ setSignInModalState, setSignUpModalState }) {

    // JWT 저장소
    const [cookies, setCookies] = useCookies();
    const { user, setUser } = useUserStore();

    // 이메일, 비밀번호 입력값
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 이메일, 비밀번호 유효성 검사 통과 여부
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    // 이메일, 비밀번호 에러 메세지 저장소
    const [emailError, setEmailError] = useState();
    const [passwordError, setPasswordError] = useState('');

    // 각 입력값의 유효성 검사
    const validateField = (value, validationRegex, errorSetter, errorMessage) => {
        const isValid = value.trim() === '' || validationRegex.test(value);
        errorSetter(isValid ? null : errorMessage);
        return isValid;
    };

    // 모든 입력값이 유효성 검사를 통과한 경우
    const isSignInEnabled = () => {
        return isEmailValid && isPasswordValid && !forgotPwModalState;
    };

    // 로그인 요청 결과를 저장할 변수
    const [isEmailAvailable, setIsEmailAvailable] = useState(false);

    // 이메일 : 유효성 검사 통과 여부 및 에러 메세지 출력값 저장
    useEffect(() => {
        axios.post('http://localhost:8085/api/auth/emailCheck', { userEmail: email })
            .then((response) => {
                setIsEmailValid(validateField(
                    email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    setEmailError, '정확하지 않은 이메일입니다.'
                ));
                setIsEmailAvailable(response.data); // 회원가입 시 이미 사용 중인 이메일인지 저장
            })
            .catch((error) => {
                console.log('로그인 실패 : ', error);
                setIsEmailValid(false); // 에러 발생 시 유효성 검사를 통과하지 않은 상태로 처리
            });
    }, [email]);

    // 비밀번호 : 유효성 검사 통과 여부 및 에러 메세지 출력값 저장
    useEffect(() => {
        setIsPasswordValid(validateField(
            password, /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{10,}$/,
            setPasswordError, '비밀번호는 영문, 숫자, 특수문자 중 2개 이상을 조합하여 최소 10자리 이상이여야 합니다.'));
    }, [password]);

    // 유효성 검사 통과 여부에 따라 클래스 추가 및 제거
    const toggleInputPassClass = (element, isValid) => {
        if (element && isValid) { element.classList.add(styles.user_sign_inputPass); }
        else if (element) { element.classList.remove(styles.user_sign_inputPass); }
    };

    // 이메일, 비밀번호 유효성 검사 통과 마크
    useEffect(() => {
        toggleInputPassClass(document.getElementById('userEmail'), isEmailValid && email);
        toggleInputPassClass(document.getElementById('userPassword'), isPasswordValid && password);
    }, [isEmailValid, isPasswordValid, email, password]);

    // 로그인 로직
    const onSubmitHandler = (e) => {
        e.preventDefault();

        const data = { userEmail: email, userPassword: password }
        const config = { headers: { 'Content-Type': 'application/json' } };

        axios.post('http://localhost:8085/api/auth/signIn', data, config)
            .then((response) => {
                const responseData = response.data;
                if (!responseData.result) {
                    if (responseData.message === 'noExistEmail') {
                        // console.log('로그인 실패 : 존재하지 않는 이메일');
                        setNoExistEmailAlert(true);
                    } else if (responseData.message === 'deletedUser') {
                        setDeletedUserAlert(true);
                    } else if (responseData.message === 'wrongPassword') {
                        // console.log('로그인 실패 : 잘못된 비밀번호');
                        setWrongPasswordAlert(true);
                    }
                    return;
                }
                document.body.style.overflow = "auto";  // 스크롤 재활성화

                // JWT 로그인 정보 저장
                const { token, exprTime, user } = responseData.data;
                const expires = new Date();
                expires.setMilliseconds(expires.getMilliseconds() + exprTime);

                setCookies('token', token, { exprTime });
                setUser(user);
            }).catch((error) => {
                // console.log('일반 로그인 요청 실패: ', error);
            })
    };



    // 로그인 모달창 높이
    const [modalHeight, setModalHeight] = useState('');

    // 모달창 외부 클릭 시 닫기
    useEffect(() => {
        document.addEventListener('mousedown', clickOutsideHandler);
        return () => { document.removeEventListener('mousedown', clickOutsideHandler); };
    });

    const clickOutsideHandler = (e) => {
        const modal = document.querySelector(`.${styles.user_login_modal}`);
        if (modal && !modal.contains(e.target) && !forgotPwModalState) {
            setSignInModalState(false);
        }
    };

    // 에러 메시지 출력 시 모달창 높이 변경
    useEffect(() => {
        let errorHeight = 460;
        // 전체 에러 메시지 출력 시
        if (emailError && passwordError) { errorHeight = 535; }
        // 이메일 or 비밀번호 에러 메시지 출력 시
        else if (emailError) { errorHeight = 490; }
        else if (passwordError) { errorHeight = 505; }
        setModalHeight(errorHeight);
    }, [emailError, passwordError]);

    // 임시 비밀번호 발급 모달창
    const [forgotPwModalState, setForgotPwModalState] = useState(false);

    // 임시 비밀번호 발급 모달창 스크롤 제어
    useEffect(() => {
        if (forgotPwModalState) {
            document.body.style.overflow = 'hidden';
        }
    }, [forgotPwModalState]);

    // 로그인 실패 알림창
    const [noExistEmailAlert, setNoExistEmailAlert] = useState(false);
    const [deletedUserAlert, setDeletedUserAlert] = useState(false);
    const [wrongPasswordAlert, setWrongPasswordAlert] = useState(false);



    return (
        <div className={styles.user_login_modal} style={{ height: `${modalHeight}px` }}>
            <form onSubmit={onSubmitHandler}>
                <div><img src={reel_review_logo} className={styles.user_login_logo} alt='reel_review_logo'></img></div>
                <h2 className={styles.user_login_h2}>로그인</h2>

                {/* 이메일 입력 */}
                <input
                    type='text'
                    id='userEmail'
                    placeholder='이메일'
                    value={email}
                    required
                    autoComplete='off'
                    className={emailError ? `${styles.user_login_input} ${styles.user_sign_inputError}` : styles.user_login_input}
                    onChange={(e) => setEmail(e.target.value)} />
                {email ? (<div className={styles.user_login_buttonX} onClick={() => { setEmail(''); }}></div>) : (<div></div>)}
                <br />
                {emailError && <p className={styles.user_login_error}>{emailError}</p>}

                {/* 비밀번호 입력 */}
                <input
                    type='password'
                    id='userPassword'
                    placeholder='비밀번호'
                    value={password}
                    required
                    className={passwordError ? `${styles.user_login_input} ${styles.user_sign_inputError}` : styles.user_login_input}
                    onChange={(e) => setPassword(e.target.value)} />
                {password ? (<div className={styles.user_login_buttonX} onClick={() => { setPassword(''); }}></div>) : (<div></div>)}
                <br />
                {passwordError && <p className={styles.user_login_error}>{passwordError}</p>}

                {/* 로그인 */}
                <button
                    className={styles.user_login_btn}
                    disabled={!isSignInEnabled()}
                    onClick={onSubmitHandler}>
                    로그인</button>
                {noExistEmailAlert ? <Alert resultMessage={'가입되지 않은 이메일입니다.'} setNoExistEmailAlert={setNoExistEmailAlert} /> : null}
                {deletedUserAlert ? <Alert resultMessage={'탈퇴된 회원입니다.'} setDeletedUserAlert={setDeletedUserAlert} /> : null}
                {wrongPasswordAlert ? <Alert resultMessage={'비밀번호가 일치하지 않습니다.'} setWrongPasswordAlert={setWrongPasswordAlert} /> : null}
            </form>

            {/* 임시 비밀번호 발급 */}
            <div className={styles.user_sign_messageContainer}>
                <span className={styles.user_login_forgotPw} onClick={() => { setForgotPwModalState(true) }}>비밀번호를 잊어버리셨나요?</span>
                {forgotPwModalState ? <ForgotPw setForgotPwModalState={setForgotPwModalState} setSignInModalState={setSignInModalState} /> : null}

                {/* 회원가입 */}
                <span className={styles.user_login_helpMessage}>계정이 없으신가요?
                    <span
                        className={styles.user_login_signUp}
                        onClick={() => {
                            setSignInModalState(false); setSignUpModalState(true);
                        }}>
                        회원가입
                    </span>
                </span>
            </div>
            <hr className={styles.user_login_hr} />

            {/* 소셜 로그인 */}
            <OAuth2 />

            {/* 임시 비밀번호 발급 모달창 활성화 시 배경화면 색상 변경 */}
            {forgotPwModalState && <div className={styles.modalBackground_2} style={{ backgroundColor: 'black' }} />}
        </div>
    )
}