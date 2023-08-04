
import React from "react";
import styles from "../../../css/details/Detail_num3.module.css";

function MoviePeople(props) {
    const castData = props.castData || [];
    const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";
    return (
        <div className={styles.people1}>
            {castData.map((cast, index) => (
                <div key={index} className={styles.people1_1}>
                    {cast && cast.peopleImage ? (
                        <div className={styles.people_link}>
                            {cast.peopleImage && (
                                <div className={styles.people_img}>
                                    <img src={IMG_BASE_URL + cast.peopleImage} alt='#' className={styles.people_img_img} />
                                </div>
                            )}
                            <div className={styles.people_details}>
                                <h5>{cast.peopleName}</h5>
                                <p>{cast.character}</p>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MoviePeople;