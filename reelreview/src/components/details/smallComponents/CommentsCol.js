import styles from '../../../css/details/Detail_num4.module.css';
import { RiStarSFill } from "react-icons/ri";
import { FaThumbsUp } from "react-icons/fa";
import { ImBubble } from "react-icons/im";
import { useEffect, useState } from 'react';
import axios from 'axios';
import userPFP from '../../../img/profile/userProfile/empty_user.svg'
import { Link } from 'react-router-dom';

function CommentsCol(props) {
    const comment = props.comment;
    const userCd = comment.userCd;

    const [rating, setRating] = useState(null);
    
    const onImageError = (event) => {
        const fallbackImageUrl = userPFP;
        event.target.src = fallbackImageUrl;
    };

    useEffect(() => {
        const fetchRatingData = async () => {
          try {
            const response = await axios.get(`http://localhost:8085/getRatingDataForThisComment`, {
              params: {
                movieId: comment.movieId,
                userCd: comment.userCd
              }
            });
                  if (Array.isArray(response.data)) {
              setRating(response.data);
            } else {
              setRating([response.data]);
            }
          } catch (error) {
            console.error('Error fetching rating data:', error);
          }
        };
      
        fetchRatingData();
      }, [comment.movieId, comment.userCd]);

    const getRatingForComment = () => {
        if (rating !== null && comment && comment.userCd && comment.movieId) {
          const foundRating = rating.find((rate) => rate.movieId === comment.movieId && rate.userCd === comment.userCd);
          return foundRating ? foundRating.rate : '평가전';
        } else {
          return '평가전';
        }
    };



    return(
        
        <div className={styles.col}>
            {comment &&(
                <div className={styles.card}>
                <div className={styles.cardTop}>
                    <div className={styles.cardTopInner}>
                        <div className={styles.cardTopLeft}>
                        <img
                            alt="profile"
                            className={styles.cardImg}
                            src={`http://localhost:8085/userProfiles/getProfilePicture?userCd=${userCd}`}
                            onError={onImageError}
                        />
                                <p>{comment.userName}</p>
                        </div>
                        <div className={styles.cardTopRight}>
                            <div className={styles.cardStars}>
                                <RiStarSFill size={20} className={styles.stars}/>
                                <p> {getRatingForComment()} </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.cardMiddle}>
                    <Link to="/commentDetail" state={{"comment":comment}}>  
                        <div className={styles.comment}>
                            <p>
                                {comment.commentContent} {/* cCommentcount로 넣어주면 못불러옴 */}
                            </p>
                        </div>
                    </Link>
                </div>
                <div className={styles.cardBottom}>
                    <span><FaThumbsUp size={14}/></span>
                    <p>{comment.commentGood}</p>
                    <span><ImBubble/></span>
                    <p>{comment.ccommentcount}</p>
                </div>
            </div>
            )}
            
        </div>
    )
}

export default CommentsCol;