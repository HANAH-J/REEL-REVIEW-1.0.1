import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import MainPage from "./pages/main/MainPage";
import Details from "./pages/details/Details";
import UserProfile from './pages/profile/UserProfile/UserProfile';
import UserScoreCollection from './pages/profile/UserScoreCollection/UserScoreCollection';
import CollectionDetail from './pages/profile/MovieCollection/CollectionDetail';
import UserComment from './pages/profile/UserComment/UserComment';
import MovieToWatch from './pages/profile/MovieToWatch/MovieToWatch';
import CsMain from "./pages/cs/CsMain";
import CsFaq from "./pages/cs/csFaq/CsFaq";
import CsQna from "./pages/cs/csQna/CsQna";
import CsBoard from "./pages/cs/csBoard/CsBoard";
import MovieCollection from './pages/profile/MovieCollection/MovieCollection';
import CsBoardDetail from './pages/cs/csBoardDetail/CsBoardDetail';
import ColDetail from "./pages/details/ColDetail";
import CommentDetail from "./pages/details/CommentDetail";
import MainPageAdmin from "./pages/main/MainPageAdmin";
import ModifyBtn from "./components/csBoard/CsBoard_modify";
import SearchSuccess from "./pages/main/SearchSuccess";
import SearchSuccessWriter from "./pages/cs/csBoard/SearchSuccessWriter";
import Imagefileshow from "./components/csBoard/Imagefileshow";
import NumberContext from "./pages/details/NumberContext";
import { useCookies } from 'react-cookie';
import { useUserStore } from '../src/stores/index.ts';
import base64 from 'base-64';
import "./App.css";
import styles from './css/users/Sign.module.css';
import Alert from "./components/users/Alert";
import NotFound from "./pages/NotFound";

function App() {
  const [number, setNumber] = useState(0);
  const { role } = useUserStore();
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

  // 토큰 디코딩 함수
  const decodeToken = (token) => {
    try {
      const parts = token.split('.'); // 토큰을 세 부분으로 나눕니다.
      const payload = JSON.parse(base64.decode(parts[1])); // 페이로드 부분을 base64 디코딩하고 JSON 파싱합니다.
      return payload;
    } catch (error) {
      console.error('토큰 디코딩 오류:', error);
      return null;
    }
  };

  const token = cookies.token; // 쿠키에서 토큰을 가져옵니다.
  const decodedToken = token ? decodeToken(token) : null;



  return (
    <NumberContext.Provider value={{ number, setNumber }}>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path='/details' element={<Details />} />
          <Route path="/searchSuccess" element={<SearchSuccess />} />
          <Route path="/searchSuccessWriter" element={<SearchSuccessWriter />} />

          <Route path="/user/*" element={decodedToken && (decodedToken.role === 'ROLE_USER' || decodedToken.role === 'ROLE_ADMIN')
            ? <Routes>
              <Route path="" element={<NotFound />} />
              <Route path="csMain" element={<CsMain />} />
              <Route path="csFaq" element={<CsFaq />} />
              <Route path="csQna" element={<CsQna />} />
              <Route path="csBoard" element={<CsBoard />} />
              <Route path="csBoard_modify/:boardCd" element={<ModifyBtn />} />
              <Route path='csBoardDetail/:boardCd' element={<CsBoardDetail />} />
              <Route path="userProfiles" element={<UserProfile />} />
              <Route path='files/:filepath' element={<Imagefileshow />} />
              <Route path="userScoreCollection" element={<UserScoreCollection />} />
              <Route path='colDetail' element={<ColDetail />} />
              <Route path="collection/:collectionCd" element={<CollectionDetail />} />
              <Route path="movieCollection" element={<MovieCollection />} />
              <Route path="movieToWatch" element={<MovieToWatch />} />
              <Route path="userComment" element={<UserComment />} />
              <Route path='commentDetail' element={<CommentDetail />} />
            </Routes>
            : (<><Alert resultMessage={'로그인이.'} navigate={navigate} />
              <div className={styles.modalBackground_1} style={{ backgroundColor: 'black' }} /></>)}
          />

          <Route path="/admin/*" element={decodedToken && decodedToken.role === 'ROLE_ADMIN'
            ? <MainPageAdmin />
            : (<><Alert resultMessage={'접근할 수 없는 페이지입니다.'} navigate={navigate} />
              <div className={styles.modalBackground_1} style={{ backgroundColor: 'black' }} /></>)}
          />

          {/* "Not Found" 페이지 */}
          <Route path="/*" element={<NotFound/>} />
        </Routes>

      </div>
    </NumberContext.Provider>
  );
}

export default App;

