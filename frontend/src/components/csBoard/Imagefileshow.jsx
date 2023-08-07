import { useParams } from "react-router-dom";

export default function Imagefileshow(props){
    const baseUrl = "http://localhost:8085";

    const filepath = useParams();
    const img = baseUrl + "/files/" + filepath.filepath;
    return(
        <div>
            <img src={img}></img>
            
        </div>
    )
};