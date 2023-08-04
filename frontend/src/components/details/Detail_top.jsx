import { useEffect,useState } from "react";
import Header_Dark from "../../components/Header/Header";
import styles from '../../css/details/Detail_top.module.css';
import { useNavigate } from "react-router-dom";

function Detailtop(props) {
 
  const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";
  const [randomIndex, setRandomIndex] = useState(null);

  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * props.movieData.movieImages.length));
  }, [props.movieData]);

  const backdropPath = props.movieData?.movieImages?.[randomIndex]?.backdropPath || "";
  const backgroundStyle = {
    backgroundImage: backdropPath ? `url(${IMG_BASE_URL + backdropPath})` : "",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "550px",
    fontFamily: 'Roboto, "Noto Sans KR", sans-serif',
  };

  return (
    <div>
      <div className={styles.nav}>
      </div>
      <div className={styles.detail_first} style={backgroundStyle}>
        <div className={styles.detail_movie_back}>
          <div className={styles.detail_movie_top}>
            <h1>{props.item.title}</h1>
            <div className={styles.detail_movie_top_inEn}>
              {props.item.original_title}
            </div>
            <div className={styles.openDate_genre_country}>
              <div className={styles.openDate}>{props.item.release_date}</div>
              <div className={styles.genre}></div> 
              {/* {props.item.genre.map((genre,index)=>genre.genreName)} */}

            </div>
            <div className={styles.playTime_ageRating}>
              <div className={styles.playTime}>{props.item.runtime}분</div>
              <div className={styles.ageRating}>전체</div> 
            </div>
            <div className={styles.boxOfficeData}>
              <div className={styles.boxOfficePercent}>예매 순위 {props.item.rank}위({props.item.salesShare}%)</div>

              <div className={styles.totalAudience}>누적 관객 {props.item.audiAcc}만명</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detailtop;