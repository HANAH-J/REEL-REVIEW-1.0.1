import React, { useState, useEffect, useCallback } from 'react';
import TermsContents1 from './TermsContents1';
import TermsContents2 from './TermsContents2';
import Alert from './Alert';
import styles from '../../css/users/Terms.module.css';
import styles2 from '../../css/users/Alert.module.css';

// [회원] 약관 동의 모달창
export default function Terms({ setSignUpModalState, setTermsModalState, onSubmitHandler }) {

    // 약관 동의 입력값
    const [checkItems, setCheckItems] = useState([]);

    // 약관 동의 입력값 검사 결과 저장소
    const isAllTermsAgreed = () => {
        let result = checkItems.includes('check_1') && checkItems.includes('check_2');
        // console.log('약관 동의 결과 :' + result);
        return result;
    };

    // 약관 동의 입력값 검사
    const signUpButtonHandler = (e) => {
        if (isAllTermsAgreed()) {   // 약관 전체 동의
            setSignUpAlert(true);
            onSubmitHandler(e);
        } else {                    // 하나 이상의 약관 미동의
            e.preventDefault();
        }
    };

    // 전체 약관 동의 클릭 : 전체 약관 체크
    const allCheckHandler = (isChecked) => {
        if (isChecked) {
            setCheckItems(['check_1', 'check_2']);
        } else {
            setCheckItems([]);
        }
    };

    // 선택 약관 동의 : 선택 약관 체크
    const specificCheckHandler = (event) => {
        const checkboxId = event.target.id;
        const isChecked = event.target.checked;

        if (isChecked) {
            setCheckItems((prevCheckItems) => [...prevCheckItems, checkboxId]);
        } else {
            setCheckItems((prevCheckItems) => prevCheckItems.filter((id) => id !== checkboxId));
        }
    };

    // 가입하기 버튼 색상 저장소
    const [submitButtonColor, setSubmitButtonColor] = useState('lightgray');

    // 가입하기 버튼 색상 변경
    const updateSubmitButtonColor = useCallback(() => {
        if (isAllTermsAgreed()) { setSubmitButtonColor('#ff2f6e'); }
        else { setSubmitButtonColor('lightgray'); }
    }, [checkItems]);

    useEffect(() => {
        updateSubmitButtonColor();
    }, [checkItems, updateSubmitButtonColor]);



    // 약관 모달창
    const [termsCt1State, setTermsCt1State] = useState(false);
    const [termsCt2State, setTermsCt2State] = useState(false);

    // 회원가입 완료 알림창
    const [signUpAlert, setSignUpAlert] = useState(false);

    // 모달창 외부 클릭 시 닫기
    useEffect(() => {
        document.addEventListener('mousedown', clickOutsideHandler);
        return () => { document.removeEventListener('mousedown', clickOutsideHandler); };
    });

    const clickOutsideHandler = (e) => {
        const modal = document.querySelector(`.${styles.user_terms_modal}`);
        if (modal && !modal.contains(e.target)) { setTermsModalState(false); }
    };


    
    return (
        <div className={styles.user_terms_modal}>
            <div className={styles.user_terms_modal_color}>
                <span className={styles.user_terms_message}>약관에 동의하시면<br></br>가입이 완료됩니다.</span>
            </div>
            <ul>

                {/* 전체 약관 동의 체크박스 */}
                <li className={styles.user_terms_check_all}>
                    <label className={styles.user_terms_all}>
                        <input
                            type='checkbox'
                            id='check_all'
                            className={styles.user_terms_all_check}
                            onChange={(e) => allCheckHandler(e.target.checked)}
                            checked={checkItems.length === 2} />
                        <label htmlFor='check_all'></label>
                        <span className={styles.user_terms_text}>전체 약관 동의</span>
                    </label>
                </li>
                <hr className={styles.user_terms_hr}></hr>

                {/* 서비스 이용약관 체크박스 */}
                <li className={styles.user_terms_check}>
                    <label className={styles.user_terms_specific}>
                        <input
                            type='checkbox'
                            id='check_1'
                            className={styles.user_terms_specific_check}
                            onChange={specificCheckHandler}
                            checked={checkItems.includes('check_1')} />
                        <label htmlFor='check_1'></label>
                        <span className={styles.user_terms_text}>서비스 이용약관</span>
                        <span
                            className={styles.user_terms_check_detail}
                            onClick={() => { setTermsCt1State(true) }}>
                            보기
                        </span>
                        {termsCt1State ? <TermsContents1 setTermsCt1State={setTermsCt1State} /> : null}
                    </label>
                </li>
                
                {/* 개인정보 처리방침 체크박스 */}
                <li className={styles.user_terms_check}>
                    <label className={styles.user_terms_specific}>
                        <input
                            type='checkbox'
                            id='check_2'
                            className={styles.user_terms_specific_check}
                            onChange={specificCheckHandler}
                            checked={checkItems.includes('check_2')}
                        />
                        <label htmlFor='check_2'></label>
                        <span className={styles.user_terms_text}>개인정보 처리방침</span>
                        <span
                            className={styles.user_terms_check_detail}
                            onClick={() => { setTermsCt2State(true) }}>
                            보기
                        </span>
                        {termsCt2State ? <TermsContents2 setTermsCt2State={setTermsCt2State} /> : null}
                    </label>
                </li>
            </ul>

            {/* 가입하기 버튼 */}
            <div>
                <button
                    className={styles.user_terms_btn}
                    style={{ color: submitButtonColor }}
                    onClick={signUpButtonHandler}>
                    가입하기
                </button>
                {signUpAlert ? <Alert signUpAlert={signUpAlert} resultMessage={'회원가입이 완료 되었습니다.'} setSignUpAlert={setSignUpAlert} setTermsModalState={setTermsModalState} setSignUpModalState={setSignUpModalState} /> : null}
            </div>
            
            {/* 회원가입 완료 알림창 활성화 시 배경화면 색상 변경 */}
            {signUpAlert && (<div className={styles2.modalBackground3} style={{ backgroundColor: 'black' }} />)}
        </div>
    )
}