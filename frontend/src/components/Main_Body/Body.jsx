import React from "react";
import "../css/Body.css";
import { boxofficeList } from '../../api/Movies/BoxOffice';
import BoxOffice from "./Main_Body/BoxOffice";


export default function Body() {

    return (

       <div className="body_box">
            <div className="boxoffice_box">
                <div className="boxoffice_box_header"><h3>박스오피스 순위</h3></div>
                <div className="boxoffice_box_poster">
                    {
                        boxofficeList.results.map((item)=>{
                            return (
                                <BoxOffice/>
                            )
                        })
                    }
                </div>
                <div className="boxoffice_box_info">영화정보</div>
            </div>

       </div>

    );


}