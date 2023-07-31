import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import ChangePw from '../../../components/users/ChangePw';
import SignOutAlert from "../../../components/users/SignOutAlert";
import styles from '../../../css/profile/PFPModal.module.css';
import styles2 from '../../../css/users/Alert.module.css';

function PFPModal({ setOpenModal, userCd, userEmail, removeUser }) {
  const [inputValue, setInputValue] = useState(''); //변경할 상태메시지
  const [showEditTextModal, setShowEditTextModal] = useState(false);
  const [showEditPFPModal, setShowEditPFPModal] = useState(false);
  const [showEditPFBModal, setShowEditPFBModal] = useState(false);

  const closePFPModal = (e) => {
    if (e.target !== e.currentTarget) return;
    /* e.target = 실제 클릭 이벤트가 발생한 요소
       e.currentTarget = 이벤트 핸들러가 바인딩된 요소 (현재의 경우, 모달 자체) 
       모달 내부를 클릭한 경우에는 클릭 이벤트의 target과 currentTarget이 동일하게 모달 요소를 가리키므로
       조건문이 false를 반환하며, 조건문 내부의 코드는 실행되지 않음 -> 따라서 모달 내부를 클릭할 때는 모달이 닫히지 않음 */
    setOpenModal(false);
  };

  const [cookies, setCookies] = useCookies();
  const openEditTextModal = () => { setShowEditTextModal(true); }
  const closeEditTextModal = () => { setShowEditTextModal(false); }
  const openEditPFPModal = () => { setShowEditPFPModal(true); }
  const closeEditPFPModal = () => { setShowEditPFPModal(false); }
  const openEditPFBModal = () => { setShowEditPFBModal(true); }
  const closeEditPFBModal = () => { setShowEditPFBModal(false); }
  const openChangePasswordModal = () => { setShowChangePasswordModal(true); }
  const closeChangePasswordModal = () => { setShowChangePasswordModal(false); }

  // 비밀번호 변경 모달창
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);


  // 소셜 로그인 확인 알림창
  const [showProviderAlret, setShowProviderAlret] = useState(false);
  const openProviderAlert = () => { setShowProviderAlret(true); };
  const closeProviderAlert = () => { setShowProviderAlret(false); };

  // 로그아웃 확인 알림창
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  // 회원탈퇴 모달창
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // 회원탈퇴 완료 모달창
  const [showWithdrawCompleteModal, setShowWithdrawCompleteModal] = useState(false);

  // 로그아웃 로직
  const signOutHandler = () => {
    setCookies('token', '', { expires: new Date() });
    removeUser();
    window.location.href = 'http://localhost:3000';
  }

  // 로그아웃, 회원탈퇴 확인 알림창 스크롤 제어
  useEffect(() => {
    if (showSignOutAlert || showWithdrawModal) {
      document.body.style.overflow = "hidden";  // 스크롤 비활성화
    } else {
      document.body.style.overflow = "auto";    // 스크롤 활성화
    }
  }, [showSignOutAlert, showWithdrawModal]);

  // 회원탈퇴
  const signOutForeverHandler = (e) => {
    axios.post('http://localhost:8085/api/auth/signOutForever', {
      userEmail: userEmail
    }).then(() => {
      setShowWithdrawCompleteModal(true);
      setCookies('token', '', { expires: new Date() });
      removeUser();
    }).catch((error) => {
      console.log('데이터 전송 실패 : ', error);
    })
  };

  const goMain = () => {
    window.location.href = 'http://localhost:3000';
  }

  // 비밀번호 변경 전 로그인 상태 확인 : UserController.java - providerCheck()
  const checkSignProvider = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8085/api/auth/providerCheck', {
      userEmail: userEmail
    }).then((response) => {
      if (response.data === 'emailProviderPass') {
        // console.log("일반 로그인");
        openChangePasswordModal();
      } else if (response.data === 'existProvider') {
        // console.log("소셜 로그인");
        openProviderAlert();
      }
    }).catch((error) => {
      console.log('데이터 전송 실패', error);
    });
  };

  // 모달창 외부 클릭 시 닫기
  useEffect(() => {
    document.addEventListener('mousedown', clickOutsideHandler);
    return () => {
      document.removeEventListener('mousedown', clickOutsideHandler);
    };
  });

  const clickOutsideHandler = (e) => {
    const modal = document.querySelector(`.${styles2.forgotPw_alert}`);
    if (modal && !modal.contains(e.target) && !showChangePasswordModal) {
      setShowChangePasswordModal(false);
    }
  };

  // 상태 메시지 변경
  const handleTextSave = () => {
    let statusToSave = inputValue;

    if (!inputValue) {
      statusToSave = "프로필이 없습니다.";
    }

    const dataToSend = {
      userCd: userCd,
      status: statusToSave
    };

    axios.put('http://localhost:8085/userProfiles/updateUserStatus', dataToSend)
      .then(response => {
        setShowEditTextModal(false); //모달닫기
        setOpenModal(false); //모달닫기
        window.location.reload(); //새로고침
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  // 프로필 사진 변경
  const handlePFPSave = () => {
    const fileInput = document.getElementById("pictureForProfile");
    const file = fileInput.files[0];

    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const maxFileLimit = 2 * 1024 * 1024;
    if (file.size > maxFileLimit) {
      alert("프로필 사진의 크기가 2MB를 초과합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("userCd", userCd);
    formData.append("profilePicture", file);

    axios.put('http://localhost:8085/userProfiles/updateUserPFP', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(response => {
        setShowEditPFPModal(false); 
        setOpenModal(false); 
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating PFP:', error);
      });
  };

  // 프로필 사진 삭제
  const handlePFPDelete = () => {
    axios.put('http://localhost:8085/userProfiles/updateProfileToDefault', {
      userCd: userCd,
      imageType: "pfImage",
      imageValue: "defaultPfImage",
    })
      .then(response => {
        setShowEditPFPModal(false); 
        setOpenModal(false); 
        window.location.reload(); 
        //console.log("user PFP updated to default image");
      })
      .catch(error => {
        console.error('Error updating PFP:', error);
      });
  };

  // 배경 사진 변경
  const handlePFBSave = () => {
    const fileInput = document.getElementById("pictureForBG");
    const file = fileInput.files[0];

    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const maxFileLimit = 3 * 1024 * 1024;
    if (file.size > maxFileLimit) {
      alert("배경 사진의 크기가 3MB를 초과합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("userCd", userCd);
    formData.append("backgroundImage", file);

    axios.put('http://localhost:8085/userProfiles/updateUserPFB', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(response => {
        setShowEditPFBModal(false); 
        setOpenModal(false); 
        window.location.reload(); 
      })
      .catch(error => {
        console.error('Error updating PFB:', error);
      });

  };

  // 배경 사진 삭제
  const handlePFBDelete = () => {
    axios.put('http://localhost:8085/userProfiles/updateProfileToDefault', {
      userCd: userCd,
      imageType: "bgImage",
      imageValue: "defaultBgImage",
    })
      .then(response => {
        setShowEditPFBModal(false); 
        setOpenModal(false); 
        window.location.reload(); 
        //console.log("user PFB updated to default image");
      })
      .catch(error => {
        console.error('Error updating PFB:', error);
      });
  };



  return (
    <div className={styles.PFPModal_BG} onClick={closePFPModal}>

      <div className={styles.PFPModal_Wrapper}>
        <div className={styles.PFPModal_Title}>
          <h2>설정</h2>
          <hr className={styles.PFPModal_HR} />
        </div>
        <div className={styles.PFPModal_Content}>
          <p className={styles.PFPModal_Content_P} onClick={openEditPFPModal}>프로필 사진 변경</p>
          <p className={styles.PFPModal_Content_P} onClick={openEditPFBModal}>배경 사진 변경</p>
          <p className={styles.PFPModal_Content_P} onClick={openEditTextModal}>프로필 문구 변경</p>
          <hr className={styles.PFPModal_HR} />
          <p className={styles.PFPModal_Content_P} onClick={checkSignProvider}>비밀번호 변경</p>
          <p className={styles.PFPModal_Content_P} onClick={() => setShowSignOutAlert(true)}>로그아웃</p>
          {showSignOutAlert && <SignOutAlert setShowSignOutAlert={setShowSignOutAlert} signOutHandler={signOutHandler} />}
          <p className={styles.PFPModal_Content_P} onClick={() => { setShowWithdrawModal(true) }}>탈퇴하기</p>
        </div>
        <div className={styles.PFPModal_Logo}>
          <p>로고</p>
        </div>

      </div>

      {showEditPFPModal && (
        <div className={styles.EditPFPModal}>
          <h3>프로필 사진 변경(JPG/PNG, 최대 2MB)</h3>
          <input type="file" id="pictureForProfile" name="pictureForProfile" accept=".jpg, .png" />
          <br></br>
          <button onClick={handlePFPSave}>변경</button>
          <button onClick={closeEditPFPModal}>취소</button>
          <button onClick={handlePFPDelete}> 삭제 </button>
        </div>
      )}

      {showEditPFBModal && (
        <div className={styles.EditPFBModal}>
          <h3>배경 사진 변경 (JPG/PNG, 최대 3MB) </h3>
          <input type="file" id="pictureForBG" name="pictureForBG" accept=".jpg, .png" />
          <br></br>
          <button onClick={handlePFBSave}>변경</button>
          <button onClick={closeEditPFBModal}>취소</button>
          <button onClick={handlePFBDelete}> 삭제 </button>
        </div>
      )}

      {showEditTextModal && (
        <div className={styles.EditTextModal}>
          <h3>프로필 문구 변경</h3>
          <input type="text"
            id="profileText"
            placeholder="프로필 문구를 입력해주세요. (미입력시 삭제)"
            maxLength={100}
            onChange={(e) => setInputValue(e.target.value)} />
          <br></br>
          <button onClick={handleTextSave}>저장</button>
          <button onClick={closeEditTextModal}>취소</button>
        </div>
      )}

      {showChangePasswordModal && (
        <>
          <div className={styles2.modalBackground} style={{ backgroundColor: "black" }} />
          <ChangePw userEmail={userEmail} setShowChangePasswordModal={setShowChangePasswordModal} signOutHandler={signOutHandler} />
        </>
      )}

      {showProviderAlret && (
        <div>
          <div className={styles2.modalBackground} style={{ backgroundColor: "black" }} />
          <div className={styles2.forgotPw_alert} style={{ height: "130px" }}>
            <h2 className={styles2.alert_h2}>알림</h2>
            <p className={styles2.alert_p}>
              {`소셜 계정은 릴리뷰 내에서
                비밀번호 변경이 불가능합니다.`}</p>
            <hr className={styles2.alert_hr} />
            <button className={styles2.alert_btn} onClick={closeProviderAlert}>확인</button>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div>
          <div className={styles2.modalBackground} style={{ backgroundColor: "black" }} />
          <div className={styles2.forgotPw_alert}>
            <h2 className={styles2.alert_h2}>알림</h2>
            <p className={styles2.alert_p}>다시 한번 생각해보세요!</p>
            <hr className={styles2.user_alert_hr} />
            <button className={styles2.alert_dualBtn1} onClick={() => { setShowWithdrawModal(false) }}>취소</button>
            <button className={styles2.alert_dualBtn2} onClick={signOutForeverHandler}>탈퇴하기</button>
          </div>
        </div>
      )}

      {showWithdrawCompleteModal === true && (
        <div className={styles2.forgotPw_alert3}>
          <h2 className={styles2.alert_h2}>알림</h2>
          <p className={styles2.alert_p}>계정이 탈퇴되었습니다.</p>
          <hr className={styles2.user_alert_hr} />
          <button className={styles2.alert_btn} onClick={goMain}>확인</button>
        </div>
      )}

    </div>
  );
}

export default PFPModal;