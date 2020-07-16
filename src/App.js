import logo from './logo.svg';
import './App.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE="http://localhost:3392/"
const API="https://api.drowzee.com/"

function App() {
	const [data, setData] = useState([]);
	const [selected, setSelected] = useState([]);
	const [show, setShow] = useState(false);

	useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://api.drowzee.com/sessions',
      );

			setData(result.data);
    };

    fetchData();
	}, []);

	const goAll = () => {
		console.log('selected: ', selected);
		if(selected.some(s => {
			return s.procedure != selected[0].procedure
		})){
			alert("only select from the same procedure please")
			return
		}
		const url = BASE + "geterp?session_id="+selected.map(s => s.sessionId).join(",")+"&procedure="+selected[0].procedure
		console.log('url: ', url);
	}


  return (
    <div className="App">
			{selected.length ?
				<button onClick={goAll}>ERP all {selected.length} checked</button> : "select some"
			}
			<button onClick={()=>setShow(false)}>show all</button>
			<button onClick={()=>setShow("n170")}>show n170</button>
			<button onClick={()=>setShow("p300")}>show p300</button>

			{data
			.filter(d => d.device && !d.device.includes("mock"))
			.filter(d => {
				if(!show){
					return true
				}
				return d.procedure == show
			})
			.map((d, i) => (
				<div key={d.sessionId} style={{
					display: 'flex',
					direction: "row",
					margin: 10,
					background: i%2 ? "#f4f4f4" : "white",
					padding: 5
				}}>
					<div className="chhh"><input type="checkbox" value={selected.includes(d)} onChange={e => {
						console.log(e.target.checked)
						if(e.target.checked){
							setSelected([...selected, d])
						} else {
							setSelected([selected.filter(s => s.sessionId != d.sessionId)])
						}
						console.log(e)
					}} /></div>
					<div className="chhh" style={{
					width: 400,
					}}>{d.sessionId}</div>
					<div className="chhh">{d.device}</div>
					<div className="chhh">{d.extraInfo.person}</div>
					<div className="chhh">{d.procedure}</div>
					<div className="chhh">ERPS: <a href={BASE + "geterp?session_id="+d.sessionId+"&procedure="+d.procedure}>here</a></div>
				</div>
			))}
    </div>
  );
}

export default App;
