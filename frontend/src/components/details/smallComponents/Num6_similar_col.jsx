import styles from '../../../css/details/Detail_num6.module.css';
import { useNavigate } from 'react-router-dom';


export default function Num6_similar_col(props) {
    const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const movies = props.movies;
    const navigate = useNavigate();
    const onClickDetailPage = (item) =>{
        navigate('',{state:{item}})
      }
    return (
        <>
        {movies &&(
            <div className={styles.similar_col} onClick={()=>onClickDetailPage(movies)}>
                <div className={styles.similar_col_img}>
                    <img src={IMG_BASE_URL + movies.poster_path} />
                </div>
                <div className={styles.similar_col_title}>
                    <h4>{movies.title}</h4>
                    <div className={styles.similar_col_title_detail}>
                        <p>평균 ★ {movies.vote_average}</p>
                        <span>영화</span>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

