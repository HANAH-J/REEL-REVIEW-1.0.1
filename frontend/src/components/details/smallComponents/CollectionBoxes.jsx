import imgs from '../../../img/Detail/poster.jpg';
import styles from '../../../css/details/Detail_num6.module.css';




export default function CollectionBoxes(){
    return (
        <div className={styles.colBox}>
            <div className={styles.colImgBox}>
                <a href='./collection'>
                    <div className={styles.colImg}>
                        <img src={imgs}></img>
                    </div>
                    <div className={styles.colImg}>
                        <img src={imgs}></img>
                    </div>
                    <div className={styles.colImg}>
                        <img src={imgs}></img>
                    </div>
                    <div className={styles.colImg}>
                        <img src={imgs}></img>
                    </div>
                </a>
            </div>
            <h4>컬렉션 제목쏼라쏼라</h4>
            <p>좋아요 102937583</p>
        </div>
    )
}