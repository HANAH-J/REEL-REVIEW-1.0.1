import React, { PureComponent } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

const data = [
    {name: '0.5', uv: 5 },{name: '1', uv: 5 },{name: '1.5', uv: 20 },{name: '2', uv: 3 },{name: '2.5', uv: 8 },
    {name: '3', uv: 50 },{name: '3.5', uv: 30 },{name: '4', uv: 100 },{name: '4.5', uv: 37 },{name: '5', uv: 49 }
];

export default class Charts extends PureComponent {
  
    render() {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={150} height={40} data={data}>
            <Bar dataKey="uv" fill="rgb(255, 172, 187)" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  }
  