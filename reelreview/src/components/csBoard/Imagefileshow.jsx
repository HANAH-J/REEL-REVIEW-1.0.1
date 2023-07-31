import { useParams } from "react-router-dom";

export default function Imagefileshow(props){

    const filepath = useParams();
    console.log(filepath);
    const img = "http://localhost:8085/files/"+filepath.filepath;
    return(
        <div>
            <img src={img}></img>
            
        </div>
    )
};