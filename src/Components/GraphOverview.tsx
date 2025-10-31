import { useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	AreaChart,
	Area,
} from "recharts";
import useFetchAPYGraph from "../hooks/useFetchAPYGraph";

const mockData = [
	{ name: "Jan", valueA: 400, valueB: 240 },
	{ name: "Feb", valueA: 300, valueB: 139 },
	{ name: "Mar", valueA: 200, valueB: 980 },
	{ name: "Apr", valueA: 278, valueB: 390 },
	{ name: "May", valueA: 189, valueB: 480 },
	{ name: "Jun", valueA: 239, valueB: 380 },
	{ name: "Jul", valueA: 349, valueB: 430 },
];
export function GraphOverview() {
	const address = "0x85290Ee672292528376adc10ef1Ff6f4Dbb29bDF";
	const [active, setActive] = useState("bot");
	const { data: apyGraph } = useFetchAPYGraph(address, 7);
	console.log("graph", apyGraph?.data);
	return (
		<div className="card rounded-xl p-6 bg-neutral-900">
			{/* <h3 className="text-white text-xl mb-4">Overview Graph</h3> */}
			<div className="flex items-start justify-between p-4">
				<div className="inline-flex items-center space-x-2">
					<button
						className={`px-3 py-1 text-xs rounded border transition-colors ${
							active === "bot"
								? "bg-green-900/30 text-green-400 border-green-800/50"
								: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
						}`}
						// onClick={() => onChange("hyperliquid")}
					>
						Bot APY
					</button>
					<button
						className={`px-3 py-1 text-xs rounded border transition-colors ${
							active === "lighter"
								? "bg-green-900/30 text-green-400 border-green-800/50"
								: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
						}`}
						// onClick={() => onChange("lighter")}
					>
						User APY
					</button>
					<button
						className={`px-3 py-1 text-xs rounded border transition-colors ${
							active === "lighter"
								? "bg-green-900/30 text-green-400 border-green-800/50"
								: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
						}`}
						// onClick={() => onChange("lighter")}
					>
						Funding Earned
					</button>
				</div>
				<div>
					<select
						className="px-3 py-1 text-xs rounded border transition-colors bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
						defaultValue="7d"
						// onChange={...} // Add a handler if you want to do something when changed
					>
						<option value="7d">7d</option>
						<option value="30d">30d</option>
						<option value="90d">90d</option>
					</select>
				</div>
			</div>
			<ResponsiveContainer width="100%" height={450}>
				<AreaChart
					data={apyGraph?.data}
					margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
				>
					<CartesianGrid stroke="#444" strokeDasharray="3 3" />
					<XAxis dataKey="timestamp" tick={{ fill: "#aaa" }} />
					<YAxis tick={{ fill: "#aaa" }} />
					<Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
					<Area type="monotone" dataKey="apy" stroke="#8884d8" fill="#8884d8" />
					<Legend />
					{/* <Line
						type="monotone"
						dataKey="valueA"
						stroke="#82ca9d"
						strokeWidth={2}
						dot={{ r: 3 }}
					/>
					<Line
						type="monotone"
						dataKey="valueB"
						stroke="#8884d8"
						strokeWidth={2}
						dot={{ r: 3 }}
					/> */}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
