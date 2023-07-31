import React from 'react';
import Header from "../../../components/Header/Header";
import { Link } from 'react-router-dom';
import styles from '../../../css/profile/CollectionDetail.module.css'

function CollectionDetail() {
    return(
        <div className={styles.collectionDetail_Wrapper}>
          <Header/>
          <div className={styles.collectionDetail_Header}>
            <Link to="/userProfiles"><div className={styles.collectionDetail_Header_Arrow}></div></Link>
            <div className={styles.collectionDetail_Wrapper_Title}> <h2> [CollectionTitle] </h2> </div>
          </div>

          <div className={styles.collectionDetail_List}>
                
                  <ul className={styles.collectionDetail_MovieList}>  
                    <li> 
                      <img className={styles.collectionDetail_MoviePoster} alt="movie" src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" /> {/* src={el.poster_url} 넣어주기 */}
                      <h4 className={styles.collectionDetail_MovieTitle}> 엄청!!나게!!긴!!영화!!제목 </h4> 
                      <h5 className={styles.collectionDetail_Rating}>평균 ★ </h5> 
                    </li>
                  </ul>

                  <ul className={styles.collectionDetail_MovieList}>   {/* key={el.title} */}
                    <li> {/* onClick={() => this.goToContens(el.film_id)} */}
                      <img className={styles.collectionDetail_MoviePoster} alt="movie" src="https://img.cgv.co.kr/Movie/Thumbnail/Poster/000086/86305/86305_1000.jpg" /> {/* src={el.poster_url} 넣어주기 */}
                      <h4 className={styles.collectionDetail_MovieTitle}> Title </h4> 
                      <h5 className={styles.collectionDetail_Rating}>평균 ★ </h5> 
                    </li>
                  </ul>

          </div>

        </div>
    );
}

export default CollectionDetail;