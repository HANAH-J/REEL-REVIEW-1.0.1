import React from 'react'
import axios from 'axios';
import "../../css/Footer/Footer.css";
import { useState, useEffect, useContext } from 'react';
import NumberContext from '../../pages/details/NumberContext';
import apiUrl from '../../config';

export default function Footer() {
  const baseUrl = apiUrl;

  // 총 별점 수
  const [movieList, setMovieList] = useState([]);
  const { number, setNumber } = useContext(NumberContext);

  useEffect(() => { setNumber(movieList.number); })

  useEffect(() => {
    axios.post(baseUrl + "/api/directorNactorNgenreSearchByDate")
      .then((response) => { setMovieList(response.data); })
      .catch((error) => { console.error(error); });
  }, [])

  return (
    <div className='footer-container'>
      <div className="footer-count">
        <span className="footer-span">
          지금까지 <strong>★ {number} 개의 평가가</strong> 쌓였어요.
        </span>
      </div>
      <div className="footer-info">
        <div className="footer-info-left">
          <ul>
            <li className="footerText">
              서비스 이용약관&nbsp; |&nbsp; 개인정보 처리방침 &nbsp;|&nbsp; 회사 안내
            </li>
            <br /><br />
            <li className="footerText">
              고객센터&nbsp; |&nbsp; reelreviewcs@gmail.com, 031-123-4567
            </li>
            <br />
            <li className="footerText">
              제휴 및 대외 협력 &nbsp;| &nbsp; reelreviewcs@gmail.com
            </li>
            <br />
            <li className="footerText">
              주식회사 릴리뷰&nbsp; | &nbsp;경기도 수원시 팔달구 매산로 12-1
            </li>
            <br /><br />
            <li className="footerText">
              사업자 등록 번호 123-45-6789
            </li>
            <br />
            <li className="footerText">
              © 2023 by <strong>Reel Review</strong>, Inc. All rights reserved.
            </li>
          </ul>
        </div>
        <div className="footer-sns">
          <a href="https://github.com/HANAH-J/REEL-REVIEW-1.0.0" target='blank' className='github_team'></a>
          <a href="https://github.com/HANAH-J/REEL-REVIEW-1.0.1" target='blank' className='github_personal'></a>
          <a href="http://project-team-3.notion.site/REEL-REVIEW-eb057e560ac741fdaa5f3767858e8449?pvs=4" target='blank' className='notion_team'></a>
          <a href="https://hanahj-portfolio.notion.site/4b0e2d10ea954d9a8712fabd00d66f7c?pvs=4" target='blank' className='notion_personal'></a>
        </div>
      </div>
    </div>
  );
}