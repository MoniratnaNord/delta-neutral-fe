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
	Customized,
} from "recharts";
import useFetchAPYGraph from "../hooks/useFetchAPYGraph";
import useFetchFundingGraph from "../hooks/useFetchFundingGraph";
import { useAppKitAccount } from "@reown/appkit/react";

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
	const { address, isConnected } = useAppKitAccount();
	const [active, setActive] = useState("userApy");
	const [value, setValue] = useState(7);
	const { data: apyGraph, isLoading: apyGraphLoading } = useFetchAPYGraph(
		address || "",
		value,
		active === "userApy" && !!isConnected
	);
	const { data: fundingGraph, isLoading: fundingGraphLoading } =
		useFetchFundingGraph(
			address || "",
			value,
			active === "fundingApy" && !!isConnected
		);
	return (
		<div className="card rounded-xl p-6 bg-neutral-900 relative">
			{/* <h3 className="text-white text-xl mb-4">Overview Graph</h3> */}
			<div className="flex items-start justify-between p-4 relative z-10">
				<div className="inline-flex items-center space-x-2">
					{/* <button
						className={`px-3 py-1 text-xs rounded border transition-colors ${
							active === "bot"
								? "bg-green-900/30 text-green-400 border-green-800/50"
								: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
						}`}
						// onClick={() => onChange("hyperliquid")}
					>
						Bot APY
					</button> */}
					<button
						className={`px-3 py-1 text-xs rounded border transition-colors ${
							active === "userApy"
								? "bg-green-900/30 text-green-400 border-green-800/50"
								: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
						}`}
						onClick={() => setActive("userApy")}
					>
						User APY
					</button>
					<button
						className={`px-3 py-1 text-xs rounded border transition-colors ${
							active === "fundingApy"
								? "bg-green-900/30 text-green-400 border-green-800/50"
								: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
						}`}
						onClick={() => setActive("fundingApy")}
					>
						Funding Earned
					</button>
				</div>
				<div className="relative z-10">
					<select
						className="px-3 py-1 text-xs rounded border transition-colors bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
						value={value}
						onChange={(e) => setValue(Number(e.target.value))}
					>
						<option value="7">7d</option>
						<option value="30">30d</option>
						<option value="90">90d</option>
					</select>
				</div>
			</div>
			<div className="relative">
				<ResponsiveContainer width="100%" height={450}>
					<AreaChart
						data={
							active === "userApy" && apyGraph
								? apyGraph?.data
								: fundingGraph?.data
						}
						margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
					>
						<CartesianGrid stroke="#444" strokeDasharray="3 3" />
						<XAxis
							dataKey="timestamp"
							tick={{ fill: "#aaa" }}
							tickFormatter={(tick) => {
								try {
									const date = new Date(tick);
									const day = date.getDate().toString().padStart(2, "0");
									const month = date.toLocaleString("default", {
										month: "short",
									});
									return `${day} ${month}`;
								} catch {
									return tick;
								}
							}}
						/>
						<YAxis tick={{ fill: "#aaa" }} />
						<Tooltip
							contentStyle={{ backgroundColor: "#222", border: "none" }}
							labelFormatter={(label) => {
								try {
									const date = new Date(label);
									const day = date.getDate().toString().padStart(2, "0");
									const month = date.toLocaleString("default", {
										month: "short",
									});
									return `${day} ${month}`;
								} catch {
									return label;
								}
							}}
							formatter={(value, name, props) => {
								if (typeof value === "number") {
									return value.toFixed(2);
								}
								// Try to parse float if value is stringified number
								if (typeof value === "string") {
									const num = parseFloat(value);
									if (!isNaN(num)) {
										return num.toFixed(2);
									}
								}
								return value;
							}}
						/>
						<Area
							type="monotone"
							dataKey={active === "userApy" ? "apy" : "funding"}
							stroke="#8884d8"
							fill="#8884d8"
						/>
						<Legend />
					</AreaChart>
				</ResponsiveContainer>
				{/* ✅ Overlay text when no data - positioned only over chart area */}
				{((active === "fundingApy" &&
					(!fundingGraph?.data || fundingGraph.data.length === 0)) ||
					(active === "userApy" &&
						(!apyGraph?.data || apyGraph.data.length === 0))) && (
					<div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg bg-transparent pointer-events-none">
						Graph points not yet available
					</div>
				)}
			</div>
		</div>
	);
}
