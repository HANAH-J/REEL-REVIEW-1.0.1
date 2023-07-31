import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

export default function Charts(props) {
  const data = props.ratingData; // ratingData prop을 바로 사용합니다
  console.log(data);
  
  const rateCountMap = {};
  
  data.forEach(item => {
    const rate = item.rate.toString(); // 소수점 정밀도 문제를 처리하기 위해 rate를 문자열로 변환합니다
    if (rateCountMap[rate] === undefined) {
      rateCountMap[rate] = 1;
    } else {
      rateCountMap[rate]++;
    }
  });

  const result = Object.entries(rateCountMap).map(([rate, number]) => ({
    rate: parseFloat(rate),
    number
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={150} height={40} data={result}>
        <XAxis dataKey="rate" />
        <Bar dataKey="number" fill="rgb(255, 172, 187)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
