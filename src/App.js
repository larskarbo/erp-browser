import logo from './logo.svg';
import './App.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE = "https://analyzehost.drowzee.com/"
const API = "https://api.drowzee.com/"

function App() {
	const [data, setData] = useState([]);
	const [selected, setSelected] = useState([]);
	const [show, setShow] = useState(false);

	const fetchData = async () => {
		const result = await axios(
			'https://api.drowzee.com/sessions',
		);

		setData(result.data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const goAll = () => {
		console.log('selected: ', selected);
		if (selected.some(s => {
			return s.procedure != selected[0].procedure
		})) {
			alert("only select from the same procedure please")
			return
		}
		const url = BASE + "geterp?session_id=" + selected.map(s => s.sessionId).join(",") + "&procedure=" + selected[0].procedure
		console.log('url: ', url);
		window.open(url)
	}


	return (
		<div className="App">
			{selected.length ?
				<button onClick={goAll}>ERP all {selected.length} checked</button> : "select some"
			}
			<button onClick={() => setShow(false)}>show all</button>
			<button onClick={() => setShow("n170")}>show n170</button>
			<button onClick={() => setShow("p300")}>show p300</button>

			{data
				.filter(d => d.device && !d.device.includes("mock"))
				.filter(d => {
					if (!show) {
						return true
					}
					return d.procedure == show
				})
				.map((d, i) => (
					<div key={d.sessionId} style={{
						display: 'flex',
						direction: "row",
						// margin: 10,
						background: d.extraInfo.starred ? "#ffffb4" : i % 2 ? "#f4f4f4" : "white",
						padding: 5
					}}>
						<div className="chhh"><input type="checkbox" value={selected.includes(d)} onChange={e => {
							console.log(e.target.checked)
							console.log(' d.sessionId: ', d.sessionId);
							if (e.target.checked) {
								setSelected([...selected, d])
							} else {
								setSelected(selected.filter(s => s.sessionId != d.sessionId))
							}
							console.log(e)
						}} />
							{window.location.href.includes("#admin") &&
								<button onClick={async () => {
									if (window.confirm("Sure you want to delete this?")) {
										// window.open("exit.html", "Thanks for Visiting!");
										console.log('del')
										await axios.post(API + "session/delete", { "session_id": d.sessionId })
										fetchData()
									}
								}}>del</button>
							}
						</div>
						<div className="chhh" style={{
							width: 350,
						}}>{d.sessionId}</div>
						<div className="chhh" style={{
							width: 40,
						}}>
							<button style={{
								color: d.extraInfo.starred ? "black" : "gray"
							}} onClick={async () => {

								console.log({
									"session_id": d.sessionId,

									extraInfo: {
										...d.extraInfo,
										horse: 'green'
									}
								})
								await axios.post(API + "session/update", {
									"sessionId": d.sessionId,

									extraInfo: {
										...d.extraInfo,
										starred: d.extraInfo.starred ? false : true
									}
								})
								fetchData()
								// return requests.post(base_url + "/session/update", data={"sessionId": session_id, **updateProps} ).json()
							}}>★</button>
						</div>
						<div style={{
							width: 100,
						}} className="chhh">{d.device}</div>
						<div style={{
							width: 160,
						}} className="chhh">{d.extraInfo.person}</div>
						<div style={{
							width: 80,
						}} className="chhh">{d.procedure}</div>
						<div style={{
							width: 80,
						}} className="chhh"><a target="_blank" href={BASE + "geterp?session_id=" + d.sessionId + "&procedure=" + d.procedure}>ERPS↗</a></div>
					</div>
				))}
		</div>
	);
}

export default App;
