import axios from 'axios';
import styles from '../../css/details/Detail_num4.module.css';
import CommentsCol from './smallComponents/CommentsCol';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../pages/details/UserContext';

function Detailnum4(props) {
    const movieData = props.movieData;
    const {commentss} = useContext(UserContext);
   
    console.log(commentss);
    return(
        <div className={styles.wrapper}>
            <div className={styles.topHead}>
                <div>
                    <h2>코멘트</h2><h3>{commentss.length}</h3>
                </div>
            </div>

            <div className={styles.cont}>
                <div className={styles.colby}>
                    {commentss.length>0 && (
                        commentss.map((comment, index) => (
                            index < 8 && <CommentsCol key={index} comment={comment} />
                        ))

                    )}
                    
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    );
}

export default Detailnum4;