import styles from '../../css/details/ColDetail.module.css';
import React from 'react';
import Header from "../../components/Header/Header";
import {FaRegThumbsUp } from 'react-icons/fa';
import {ImBubble,ImShare2} from 'react-icons/im'
import {AiOutlineDown} from 'react-icons/ai'
import {BsThreeDotsVertical} from 'react-icons/bs'
import Footer from "../../components/Footer/Footer";
export default function ColDetail(){
    const more = ()=>{

    }
    return(
        <div className={styles.movieCollection_Wrapper}>
            <Header/>
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
                        <p>컬렉션 설명 쏼라쏼라쏼라쏼라쏼라쏼라쏼라쏼라쏼라쏼라</p>
                        <div className={styles.col_title_bot_small}>
                            <p>좋아요</p><span>500</span>
                            <p>댓글</p><span>400</span>
                            <p>2개월전 업데이트</p>
                        </div>
                        <div className={styles.col_title_button}>
                            <div className={styles.col_title_button_like}>
                                <FaRegThumbsUp className={styles.ThumbsUp}/>
                                <p>좋아요</p>
                            </div>
                            <div className={styles.col_title_button_comment}>
                                <ImBubble className={styles.ThumbsUp}/>
                                <p>댓글</p>
                            </div>
                            <div className={styles.col_title_button_sns}>
                                <ImShare2 className={styles.ThumbsUp}/>
                                <p>공유</p>
                            </div>
                        </div>
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
                    <div className={styles.collection_More} onClick={more}>
                        <p>더보기</p>
                        <AiOutlineDown className={styles.arrowDown}/>
                    </div>

                </section>
                <div className={styles.comments}>
                    <h1>댓글</h1>
                </div>
                <div className={styles.commentcommentBox}>
                    <div className={styles.ccImgBox}>
                        <div className={styles.ccimg}></div>
                    </div>
                    <div className={styles.ccDetail}>
                        <div className={styles.ccDetailTop}>
                            <div className={styles.ccName}>강형구</div>
                            <div className={styles.ccDate}>5년 전</div>
                        </div>
                        <div className={styles.ccDetailMiddle}>
                            레이드는 레알s급 입니다만..
                        </div>
                        <div className={styles.ccDetailBottom}>
                            <div className={styles.ccBottomLeft}>
                                <FaRegThumbsUp className={styles.ccLike}/>
                                4
                            </div>
                            <div className={styles.ccBottomRight}>
                                <BsThreeDotsVertical className={styles.dots}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.ccnewComment}>

                        <form>
                            <div className={styles.ccInput}>
                                <input type="text" placeholder="컬렉션에 댓글을 남겨보세요"/>
                            </div>
                            <div className={styles.ccButton}>
                                <button type='submit'className={styles.button}>
                                    <ImBubble className={styles.bubble}/>
                                    등록
                                </button>
                            </div>
                        </form>

                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}

