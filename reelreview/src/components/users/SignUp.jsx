import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OAuth2 from './OAuth2';
import Terms from './Terms';
import styles from '../../css/users/Sign.module.css';
import reel_review_logo from '../../img/users/Reel_Review_logo.png';

// [회원] 회원가입 모달창
export default function SignUp({ setSignInModalState, setSignUpModalState }) {

    // 이름, 이메일, 비밀번호 입력값
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 이름, 이메일, 비밀번호 유효성 검사 통과 여부
    const [isNameValid, setIsNameValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    // 이름, 이메일, 비밀번호 에러 메세지 저장소
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // 각 입력값의 유효성 검사
    const validateField = (value, validationRegex, errorSetter, errorMessage) => {
        const isValid = value.trim() === '' || validationRegex.test(value);
        errorSetter(isValid ? null : errorMessage);
        return isValid;
    };

    // 모든 입력값이 유효성 검사를 통과한 경우
    const isSignUpEnabled = () => {
        return isNameValid && isEmailValid && isPasswordValid && termsModalState == false;
    };

    // 이름 : 유효성 검사 통과 여부 및 에러 메세지 출력값 저장
    useEffect(() => {
        setIsNameValid(validateField(
            name, /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{1,16}$/,
            setNameError, '정확하지 않은 이름입니다.'));
    }, [name]);

    // 이메일 : 유효성 검사 통과 여부 및 에러 메세지 출력값 저장
    useEffect(() => {
        // 이메일 유효성 검사 함수
        const validateEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };
    
        // 이메일 유효성 검사 통과 여부
        const isEmailValid = validateEmail(email);
    
        // 유효성 검사를 통과하지 않은 경우 에러 메시지 출력
        if (email && !isEmailValid) {
            setEmailError('정확하지 않은 이메일입니다.');
            setIsEmailValid(false);
        } else {
            // 이메일 중복 검사 API 호출
            axios
                .post('http://localhost:8085/api/auth/emailCheck', { userEmail: email })
                .then((response) => {
                    const responseData = response.data;
    
                    // 이미 가입된 이메일인 경우 에러 메시지 출력
                    if (responseData === false) {
                        setEmailError('이미 가입된 이메일입니다.');
                        setIsEmailValid(false);
                    } else {
                        // 유효성 검사와 중복 이메일 검사를 모두 통과한 경우 에러 메시지를 비우고 유효성 플래그를 설정
                        setEmailError('');
                        setIsEmailValid(isEmailValid);
                    }
                })
                .catch(function (error) { console.log('회원가입 실패 : ', error); });
        }
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

    // 이름, 이메일, 비밀번호 유효성 검사 통과 마크
    useEffect(() => {
        toggleInputPassClass(document.getElementById('userName'), isNameValid && name);
        toggleInputPassClass(document.getElementById('userEmail'), isEmailValid && email);
        toggleInputPassClass(document.getElementById('userPassword'), isPasswordValid && password);
    }, [isNameValid, isEmailValid, isPasswordValid, name, email, password]);

    // 회원가입 로직
    const onSubmitHandler = (e) => {
        e.preventDefault();

        const data = { username: name, userEmail: email, userPassword: password }
        const config = { headers: { 'Content-Type': 'application/json' } };

        axios.post('http://localhost:8085/api/auth/signUp', data, config)
            .then(() => { setName(''); setEmail(''); setPassword(''); })
            .catch((error) => { console.log('회원가입 실패 : ', error); })
    };



    // 회원가입 모달창 높이
    const [modalHeight, setModalHeight] = useState('');

    // 모달창 외부 클릭 시 닫기
    useEffect(() => {
        document.addEventListener('mousedown', clickOutsideHandler);
        return () => { document.removeEventListener('mousedown', clickOutsideHandler); };
    });

    const clickOutsideHandler = (e) => {
        const modal = document.querySelector(`.${styles.user_login_modal}`);
        if (modal && !modal.contains(e.target) && !termsModalState) {
            if (e.target.classList.contains(styles.user_login_signUp)) { setSignUpModalState(false); setSignInModalState(true); }
            else { setSignUpModalState(false); }
        }
    };

    // 에러 메시지 출력 시 모달창 높이 변경
    useEffect(() => {
        let errorHeight = 460;
        // 전체 에러 메시지
        if (nameError && emailError && passwordError) { errorHeight = 570; }
        // 이름 or 이메일 and 비밀번호 에러 메시지
        else if ((nameError && passwordError) || (emailError && passwordError)) { errorHeight = 540; }
        // 이름 and 이메일 에러 메시지
        else if (nameError && emailError) { errorHeight = 520; }
        // 이름 or 이메일 에러 메시지
        else if (nameError || emailError) { errorHeight = 490; }
        // 비밀번호 에러 메시지
        else if (passwordError) { errorHeight = 510; }
        setModalHeight(errorHeight);
    }, [nameError, emailError, passwordError]);

    // 약관 동의 모달창
    const [termsModalState, setTermsModalState] = useState(false);

    // 약관동의 모달창 스크롤 제어
    useEffect(() => {
        if (termsModalState) { document.body.style.overflow = 'hidden'; }
    }, [termsModalState]);



    return (
        <div className={styles.user_login_modal} style={{ height: `${modalHeight}px` }}>
            <form onSubmit={onSubmitHandler}>
                <div><img src={reel_review_logo} className={styles.user_login_logo} alt='reel_review_logo'></img></div>
                <h2 className={styles.user_login_h2}>회원가입</h2>

                {/* 이름 입력 */}
                <input
                    type='text'
                    id='userName'
                    placeholder='이름'
                    value={name}
                    required
                    autoComplete='off'
                    className={nameError ? `${styles.user_login_input} ${styles.user_sign_inputError}` : styles.user_login_input}
                    onChange={(e) => setName(e.target.value)} />
                {name ? (<div className={styles.user_login_buttonX} onClick={() => { setName(''); }}></div>) : (<div></div>)}
                <div className={styles.user_login_buttonCheck} />
                <br />
                {nameError && <p className={styles.user_login_error}>{nameError}</p>}

                {/* 이메일 입력 */}
                <input type='text'
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
                <input type='password'
                    id='userPassword'
                    placeholder='비밀번호'
                    value={password}
                    required
                    className={passwordError ? `${styles.user_login_input} ${styles.user_sign_inputError}` : styles.user_login_input}
                    onChange={(e) => setPassword(e.target.value)} />
                {password ? (<div className={styles.user_login_buttonX} onClick={() => { setPassword(''); }}></div>) : (<div></div>)}
                <br />
                {passwordError && <p className={styles.user_login_error}>{passwordError}</p>}

                {/* 회원가입 */}
                <button
                    className={styles.user_login_btn}
                    disabled={!isSignUpEnabled()}
                    onClick={() => { setTermsModalState(true) }}
                >회원가입
                </button>
                {termsModalState ? <Terms setSignUpModalState={setSignUpModalState} setTermsModalState={setTermsModalState} onSubmitHandler={onSubmitHandler} /> : null}

            </form>

            {/* 로그인 */}
            <div className={styles.user_sign_messageContainer}>
                <span className={styles.user_login_helpMessage}>이미 가입하셨나요?
                    <span
                        className={styles.user_login_signUp}
                        onClick={() => { setSignUpModalState(false); setSignInModalState(true); }}>
                        로그인
                    </span>
                </span>
            </div>
            <hr className={styles.user_login_hr_2} />

            {/* 소셜 로그인 */}
            <OAuth2 signUpOAuth2={'signUpOAuth2'} />

            {/* 약관 동의 모달창 활성화 시 배경화면 색상 변경 */}
            {termsModalState && (<div className={styles.modalBackground_1} style={{ backgroundColor: 'black' }} />)}
        </div>
    )
}