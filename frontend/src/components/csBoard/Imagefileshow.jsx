import { useParams } from "react-router-dom";
import apiUrl from '../../config';

export default function Imagefileshow(props){
    const baseUrl = apiUrl;

    const filepath = useParams();
    const img = baseUrl + "/files/" + filepath.filepath;
    return(
        <div>
            <img src={img}></img>
            
        </div>
    )
};