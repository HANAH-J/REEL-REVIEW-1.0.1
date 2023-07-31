import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../../../css/profile/MovieCollection.module.css'
import Header from "../../../components/Header/Header";
import { Link } from 'react-router-dom';

function MovieCollection() {
  
  const navigate = useNavigate();
  console.log('유저 무비컬렉션');

  const collection_Detail = () => {
    navigate('/collection/:collectionCd');
    //컬렉션번호 collectionCd
  }
  
  return (
    <div className={styles.movieCollection_Wrapper}>
      <Header/>
      <div className={styles.movieCollection_Header}>
        <Link to="/userProfiles"><div className={styles.movieCollection_Header_Arrow}></div></Link>
        <div className={styles.movieCollection_Wrapper_Title}> <h2>[NAME]님의 컬렉션</h2> </div>
      </div>

      <div className={styles.collection_container}>
        <header className={styles.collection_header}>
          <div className={styles.collection_h_container}>
            <div className={styles.collection_h_poster1}>
              <img src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" alt="movie"></img>
            </div>
            <div className={styles.collection_h_poster2}>
            <img src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" alt="movie"></img>
            </div>
            <div className={styles.collection_h_poster3}>
            <img src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" alt="movie"></img>
            </div>
            <div className={styles.collection_h_poster4}>
            <img src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" alt="movie"></img>
            </div>
            <div className={styles.collection_h_poster5}>
            <img src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" alt="movie"></img>
            </div>
            <div className={styles.collection_h_poster6}>
            <img src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" alt="movie"></img>
            </div>
          </div>
        </header>
        <section className={styles.collection_title_container}>
            <div className={styles.collection_title}>
              <h1>Collection Title</h1>
            </div>
        </section>
        <section>
            <div className={styles.collection_movies}>
              <h1>작품들</h1>
            </div>
            <div className={styles.collection_movies_grid}>
              
                  <ul className={styles.collection_ul}>   
                    <li> 
                      <img className={styles.collection_MoviePoster} alt="movie" src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" /> {/* src={el.poster_url} 넣어주기 */}
                      <h4 className={styles.collection_MovieTitle}> Title </h4> 
                    </li>
                  </ul>

                  <ul className={styles.collection_ul}>   
                    <li> 
                      <img className={styles.collection_MoviePoster} alt="movie" src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" /> {/* src={el.poster_url} 넣어주기 */}
                      <h4 className={styles.collection_MovieTitle}> Title </h4> 
                    </li>
                  </ul>

                  <ul className={styles.collection_ul}>   
                    <li> 
                      <img className={styles.collection_MoviePoster} alt="movie" src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" /> {/* src={el.poster_url} 넣어주기 */}
                      <h4 className={styles.collection_MovieTitle}> Title </h4> 
                    </li>
                  </ul>

                  <ul className={styles.collection_ul}>   
                    <li> 
                      <img className={styles.collection_MoviePoster} alt="movie" src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" /> {/* src={el.poster_url} 넣어주기 */}
                      <h4 className={styles.collection_MovieTitle}> Title </h4> 
                    </li>
                  </ul>

            </div>
        </section>
        <div className={styles.collection_More} onClick={collection_Detail}> 
          <p>더보기</p>
        </div>
      </div>
              
    </div>
  );
}

export default MovieCollection;