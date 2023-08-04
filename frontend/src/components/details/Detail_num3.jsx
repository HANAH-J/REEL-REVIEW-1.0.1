import styles from '../../css/details/Detail_num3.module.css';
import MoviePeople from './smallComponents/people';




function Detailnum3(props){
    const castData = props.movieData.movieCasts;
    const crewData = props.movieData.movieCrews;
    const first = [];
    first.push(crewData[0]);
    first.push(castData[0]);
    first.push(castData[1]);
    first.push(castData[2]);
    const second = [];
    second.push(castData[3]);
    second.push(castData[4]);
    second.push(castData[5]);
    second.push(castData[6]);
    const third = [];
    third.push(castData[7]);
    third.push(castData[8]);
    third.push(castData[9]);
    third.push(castData[10]);
    
    return(
        <div className={styles.wrapper}>
            <div className={styles.people}>

                <div className={styles.topHead}>
                    <h2>출연/제작</h2>
                </div>

                <div className={styles.cont}>
                    <MoviePeople key="first" castData={first}></MoviePeople>
                    <MoviePeople key="second" castData={second}></MoviePeople>
                    <MoviePeople key="third" castData={third} ></MoviePeople>
                </div>
                
            </div>
        </div>
    );
}


export default Detailnum3;