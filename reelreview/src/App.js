import MainPage from "./pages/main/MainPage";
import "./App.css";
import { Route, Routes } from "react-router-dom";
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
import { useState } from "react";
import { useCookies } from 'react-cookie';
import { useUserStore } from '../src/stores/index.ts';
import base64 from 'base-64'; // base-64 라이브러리 임포트

function App() {
  const [number, setNumber] = useState(0);
  const { role } = useUserStore();
  const [cookies] = useCookies(['token']);
  console.log('초기 권한' + role);

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

  if (decodedToken && decodedToken.role) {
    console.log('디코딩된 역할:', decodedToken.role);
  }



  return (
    <NumberContext.Provider value={{ number, setNumber }}>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path='/details' element={<Details />} />
          <Route path="/searchSuccess" element={<SearchSuccess />} />
          <Route path="/searchSuccessWriter" element={<SearchSuccessWriter />} />

          {decodedToken && (decodedToken.role === 'ROLE_USER' || decodedToken.role === 'ROLE_ADMIN') && (
            <>
              <Route path="/user/csMain" element={<CsMain />} />
              <Route path="/user/csFaq" element={<CsFaq />} />
              <Route path="/user/csQna" element={<CsQna />} />
              <Route path="/user/csBoard" element={<CsBoard />} />
              <Route path="/user/csBoard_modify/:boardCd" element={<ModifyBtn />} />
              <Route path='/user/csBoardDetail/:boardCd' element={<CsBoardDetail />} />
              <Route path="/user/userProfiles" element={<UserProfile />} />
              <Route path='/user/files/:filepath' element={<Imagefileshow />} />
              <Route path="/user/userScoreCollection" element={<UserScoreCollection />} />
              <Route path='/user/colDetail' element={<ColDetail />} />
              <Route path="/user/collection/:collectionCd" element={<CollectionDetail />} />
              <Route path="/user/movieCollection" element={<MovieCollection />} />
              <Route path="/user/movieToWatch" element={<MovieToWatch />} />
              <Route path="/user/userComment" element={<UserComment />} />
              <Route path='/user/commentDetail' element={<CommentDetail />} />
            </>
          )}

          {decodedToken && decodedToken.role === 'ROLE_ADMIN' && (
            <>
              <Route path="/admin/main" element={<MainPageAdmin />} />
            </>
          )}
        </Routes>

      </div>
    </NumberContext.Provider>
  );
}

export default App;

