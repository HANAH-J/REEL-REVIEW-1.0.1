import styles from '../../../css/details/Detail_num5.module.css';


export default function ImageModal(props){
    const closeModal = () =>{
        props.setModalOpen(false);
    }
    const backdropPath = props.backdropPath;
    const IMG_BASE_URL = "https://image.tmdb.org/t/p/original/";
    return(
      <div className={styles.modalImg}>
          <div className={styles.modalbox}>
              <img src={IMG_BASE_URL+backdropPath.backdropPath} alt='#'/>
              <button className={styles.close} onClick={closeModal}/>
          </div>
      </div>
    )
}