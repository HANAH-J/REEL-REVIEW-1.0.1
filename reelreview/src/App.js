import MainPage from "./pages/main/MainPage";
import "./App.css";
import { Route,Routes } from "react-router-dom";
import Details from "./pages/details/Details";
import UserProfile from './pages/profile/UserProfile/UserProfile';
import UserScoreCollection from './pages/profile/UserScoreCollection/UserScoreCollection';
import CollectionDetail from './pages/profile/MovieCollection/CollectionDetail';
import UserComment from './pages/profile/UserComment/UserComment';
import Upcomming from "./components/Main_Body/Upcomming";
import MovieToWatch from './pages/profile/MovieToWatch/MovieToWatch';
import CsMain from "./pages/cs/CsMain";
import CsFaq from "./pages/cs/csFaq/CsFaq";
import CsQna from "./pages/cs/csQna/CsQna";
import CsBoard from "./pages/cs/csBoard/CsBoard";
import MainPage_loginSuccess from "./pages/main/Mainpage_loginSuccess"
import MovieCollection from './pages/profile/MovieCollection/MovieCollection';
import ActorMovie from "./components/Main_Body/ActorMovie";
import Genre from "./components/Main_Body/Genre";
import DirectorMovie from "./components/Main_Body/DirectorMovie";
import BoxOffice from "./components/Main_Body/BoxOffice";
import CsBoardDetail from './pages/cs/csBoardDetail/CsBoardDetail';
import ColDetail from "./pages/details/ColDetail";
import CommentDetail from "./pages/details/CommentDetail";
import MainPage_admin from "./pages/main/MainPage_admin";
import ModifyBtn from "./components/csBoard/CsBoard_modify";
import SearchSuccess from "./pages/main/SearchSuccess";
import SearchSuccessWriter from "./pages/cs/csBoard/SearchSuccessWriter";
import Imagefileshow from "./components/csBoard/Imagefileshow";
import NumberContext from "./pages/details/NumberContext";
import { useState } from "react";
function App() {
  const [number,setNumber] = useState(0);
  return (
    <NumberContext.Provider value={{ number , setNumber}}>
    <div className="App">
      
      <Routes>
        <Route path="/" Component={MainPage}/>
        <Route path="/mainPage" Component={MainPage}/>
        <Route path="/csMain" Component={CsMain}/>
        <Route path="/csFaq" Component={CsFaq}/>
        <Route path="/csQna" Component={CsQna}/>
        <Route path='/details' Component={Details}/>
        <Route path="/userProfiles" Component={UserProfile} />
        <Route path="/boxOffice" Component={BoxOffice} />
        <Route path="/upComming" Component={Upcomming} />
        <Route path="/actorMovie" Component={ActorMovie} />
        <Route path="/csBoard_modify/:boardCd" Component={ModifyBtn}/>
        <Route path="/genre" Component={Genre} />
        <Route path="/directorMovie" Component={DirectorMovie} />
        <Route path="/searchSuccess" element={<SearchSuccess/>}/>
        <Route path="/searchSuccessWriter" element={<SearchSuccessWriter/>}/>
        <Route path='/csBoardDetail/:boardCd' element={<CsBoardDetail/>}/>
        <Route path="/mainPage_loginSuccess" element={<MainPage_loginSuccess/>} />
        <Route path="/userScoreCollection" element={<UserScoreCollection/>} />
        <Route path="/mainPage_admin" element={<MainPage_admin/>}/>
        <Route path="/movieToWatch" element={<MovieToWatch/>} />
        <Route path="/collection/:collectionCd" element={<CollectionDetail/>}/>
        <Route path="/userComment" element={<UserComment/>}/>
        <Route path="/csBoard" element={<CsBoard/>} />
        <Route path="/movieCollection" element={<MovieCollection/>} />
        <Route path='/colDetail' Component={ColDetail}/>
        <Route path='/commentDetail' Component={CommentDetail}/>
        <Route path='/files/:filepath' Component={Imagefileshow}/>
      </Routes>

    </div>
    </NumberContext.Provider>
  );
}

export default App;

