// import { useState, useEffect } from "react";
// import {
// 	LineChart,
// 	Line,
// 	XAxis,
// 	YAxis,
// 	CartesianGrid,
// 	Tooltip,
// 	Legend,
// 	ResponsiveContainer,
// 	AreaChart,
// 	Area,
// 	Customized,
// } from "recharts";
// import useFetchAPYGraph from "../hooks/useFetchAPYGraph";
// import useFetchFundingGraph from "../hooks/useFetchFundingGraph";
// import { useAppKitAccount } from "@reown/appkit/react";
// import { useSelector } from "react-redux";

// export function GraphOverview() {
// 	const { address, isConnected } = useAppKitAccount();
// 	const jwtToken = useSelector((state: any) => state.user.jwtToken);
// 	const [active, setActive] = useState("userApy");
// 	const [value, setValue] = useState(7);
// 	const {
// 		data: apyGraph,
// 		isLoading: apyGraphLoading,
// 		refetch: refetchApyGraph,
// 	} = useFetchAPYGraph(
// 		address || "",
// 		value,
// 		active === "userApy" && !!isConnected
// 	);
// 	const {
// 		data: fundingGraph,
// 		isLoading: fundingGraphLoading,
// 		refetch: refetchFundingGraph,
// 	} = useFetchFundingGraph(
// 		address || "",
// 		value,
// 		active === "fundingApy" && !!isConnected && !!address
// 	);

// 	// Refetch graph data when user logs in or jwtToken becomes available
// 	useEffect(() => {
// 		if (isConnected && address && jwtToken) {
// 			const loggedIn = localStorage.getItem(address + "_LoggedIn");
// 			if (loggedIn === "true") {
// 				// Refetch based on active tab
// 				if (active === "userApy") {
// 					refetchApyGraph();
// 				} else if (active === "fundingApy") {
// 					refetchFundingGraph();
// 				}
// 			}
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [jwtToken, active, isConnected, address]);
// 	return (
// 		<div className="card rounded-xl p-6 bg-neutral-900 relative">
// 			{/* <h3 className="text-white text-xl mb-4">Overview Graph</h3> */}
// 			<div className="flex items-start justify-between p-4 relative z-10">
// 				<div className="inline-flex items-center space-x-2">
// 					{/* <button
// 						className={`px-3 py-1 text-xs rounded border transition-colors ${
// 							active === "bot"
// 								? "bg-green-900/30 text-green-400 border-green-800/50"
// 								: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
// 						}`}
// 						// onClick={() => onChange("hyperliquid")}
// 					>
// 						Bot APY
// 					</button> */}
// 					<button
// 						className={`px-3 py-1 text-xs rounded border transition-colors ${
// 							active === "userApy"
// 								? "bg-green-900/30 text-green-400 border-green-800/50"
// 								: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
// 						}`}
// 						onClick={() => setActive("userApy")}
// 					>
// 						User APY
// 					</button>
// 					<button
// 						className={`px-3 py-1 text-xs rounded border transition-colors ${
// 							active === "fundingApy"
// 								? "bg-green-900/30 text-green-400 border-green-800/50"
// 								: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
// 						}`}
// 						onClick={() => setActive("fundingApy")}
// 					>
// 						Funding Earned
// 					</button>
// 				</div>
// 				<div className="relative z-10">
// 					<select
// 						className="px-3 py-1 text-xs rounded border transition-colors bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
// 						value={value}
// 						onChange={(e) => setValue(Number(e.target.value))}
// 					>
// 						<option value="7">7d</option>
// 						<option value="30">30d</option>
// 						<option value="90">90d</option>
// 					</select>
// 				</div>
// 			</div>
// 			<div className="relative">
// 				<ResponsiveContainer width="100%" height={450}>
// 					<AreaChart
// 						data={
// 							active === "userApy" && apyGraph
// 								? apyGraph?.data
// 								: fundingGraph?.data
// 						}
// 						margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
// 					>
// 						<CartesianGrid stroke="#444" strokeDasharray="3 3" />
// 						<XAxis
// 							dataKey="timestamp"
// 							tick={{ fill: "#aaa" }}
// 							tickFormatter={(tick) => {
// 								try {
// 									const date = new Date(tick);
// 									const day = date.getDate().toString().padStart(2, "0");
// 									const month = date.toLocaleString("default", {
// 										month: "short",
// 									});
// 									return `${day} ${month}`;
// 								} catch {
// 									return tick;
// 								}
// 							}}
// 						/>
// 						<YAxis tick={{ fill: "#aaa" }} />
// 						<Tooltip
// 							contentStyle={{ backgroundColor: "#222", border: "none" }}
// 							labelFormatter={(label) => {
// 								try {
// 									const date = new Date(label);
// 									const day = date.getDate().toString().padStart(2, "0");
// 									const month = date.toLocaleString("default", {
// 										month: "short",
// 									});
// 									return `${day} ${month}`;
// 								} catch {
// 									return label;
// 								}
// 							}}
// 							formatter={(value, name, props) => {
// 								if (typeof value === "number") {
// 									return value.toFixed(2);
// 								}
// 								// Try to parse float if value is stringified number
// 								if (typeof value === "string") {
// 									const num = parseFloat(value);
// 									if (!isNaN(num)) {
// 										return num.toFixed(2);
// 									}
// 								}
// 								return value;
// 							}}
// 						/>
// 						<Area
// 							type="monotone"
// 							dataKey={active === "userApy" ? "apy" : "funding"}
// 							stroke="#8884d8"
// 							fill="#8884d8"
// 						/>
// 						<Legend />
// 					</AreaChart>
// 				</ResponsiveContainer>
// 				{/* ✅ Overlay text when no data - positioned only over chart area */}
// 				{((active === "fundingApy" &&
// 					(!fundingGraph?.data || fundingGraph.data.length === 0)) ||
// 					(active === "userApy" &&
// 						(!apyGraph?.data || apyGraph.data.length === 0))) && (
// 					<div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg bg-transparent pointer-events-none">
// 						Graph points not yet available
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

import { useState, useEffect, useRef } from "react";
import { createChart, IChartApi } from "lightweight-charts";
import useFetchAPYGraph from "../hooks/useFetchAPYGraph";
import useFetchFundingGraph from "../hooks/useFetchFundingGraph";
import { useAppKitAccount } from "@reown/appkit/react";
import { useSelector } from "react-redux";

export function GraphOverview() {
	const { address, isConnected } = useAppKitAccount();
	const jwtToken = useSelector((state: any) => state.user.jwtToken);
	const [active, setActive] = useState<"userApy" | "fundingApy">("userApy");
	const [value, setValue] = useState(7);
	// const [graphType, setGraphType] = useState<
	// 	"normal" | "line" | "candlestick" | "bar"
	// >("line");
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<IChartApi | null>(null);

	const { data: apyGraph, refetch: refetchApyGraph } = useFetchAPYGraph(
		address || "",
		value,
		active === "userApy" && !!isConnected
	);

	const { data: fundingGraph, refetch: refetchFundingGraph } =
		useFetchFundingGraph(
			address || "",
			value,
			active === "fundingApy" && !!isConnected && !!address
		);

	// 🔁 Refetch when user logs in or switches tab
	useEffect(() => {
		if (isConnected && address && jwtToken) {
			const loggedIn = localStorage.getItem(address + "_LoggedIn");
			if (loggedIn === "true") {
				if (active === "userApy") refetchApyGraph();
				else refetchFundingGraph();
			}
		}
	}, [jwtToken, active, isConnected, address]);

	// 📊 Create or update chart when data changes
	useEffect(() => {
		const container = chartContainerRef.current;
		const data =
			active === "userApy" ? apyGraph?.data || [] : fundingGraph?.data || [];

		// 🧹 Clean up previous chart instance before creating a new one
		if (chartRef.current) {
			chartRef.current.remove();
			chartRef.current = null;
		}

		if (!container || data.length === 0) return;

		const chart = createChart(container, {
			width: container.clientWidth,
			height: 450,
			layout: {
				background: { color: "#0c0e12" },
				textColor: "#d1d4dc",
			},
			watermark: {
				visible: false,
			},
			grid: {
				vertLines: { color: "rgba(42, 46, 57, 0.2)" },
				horzLines: { color: "rgba(42, 46, 57, 0.2)" },
			},
			timeScale: {
				borderColor: "rgba(197, 203, 206, 0.8)",
			},
			crosshair: {
				mode: 1,
			},
		});

		chartRef.current = chart;

		const candles = chart.addCandlestickSeries({
			upColor: "#26a69a",
			downColor: "#ef5350",
			wickUpColor: "#26a69a",
			wickDownColor: "#ef5350",
			borderVisible: false,
			priceFormat: {
				type: "custom",
				formatter: (price: number) =>
					active === "userApy"
						? `${(price ?? 0).toFixed(2)}%`
						: `$${(price ?? 0).toFixed(2)}`,
			},
		});
		// Build synthetic OHLC from single value series
		const ohlc = data.map((d, idx, arr) => {
			const val =
				active === "userApy" ? Number(d.apy ?? 0) : Number(d.funding ?? 0);
			const prev =
				idx > 0
					? active === "userApy"
						? Number(arr[idx - 1].apy ?? 0)
						: Number(arr[idx - 1].funding ?? 0)
					: 0; // 👈 Start from 0 for the first candle

			const open = prev;
			const close = val;
			const variation = Math.abs(val) * 0.005 || 0.01;
			const high = Math.max(open, close) + variation;
			const low = Math.min(open, close) - variation;

			return {
				time: new Date(d.timestamp).toISOString().split("T")[0],
				open,
				high,
				low,
				close,
			};
		});

		candles.setData(ohlc);
		if (ohlc.length > 0) {
			const timeScale = chart.timeScale();

			if (ohlc.length <= 10) {
				timeScale.setVisibleRange({
					from: ohlc[0].time,
					to: ohlc[ohlc.length - 1].time,
				});
				chart.applyOptions({ timeScale: { barSpacing: 30 } });
			} else {
				timeScale.fitContent();
				chart.applyOptions({ timeScale: { barSpacing: 8 } });
			}
		}

		// 🔁 Resize handler
		const handleResize = () => {
			if (chartRef.current && container) {
				chartRef.current.applyOptions({ width: container.clientWidth });
			}
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (chartRef.current) {
				chartRef.current.remove();
				chartRef.current = null;
			}
		};
	}, [active, apyGraph, fundingGraph]);

	const isEmpty =
		(active === "userApy" && (!apyGraph?.data || apyGraph.data.length === 0)) ||
		(active === "fundingApy" &&
			(!fundingGraph?.data || fundingGraph.data.length === 0));

	return (
		<div className="card rounded-xl p-6 bg-neutral-900 relative">
			{/* Header Controls */}
			<div className="flex items-start justify-between p-4 relative z-10">
				<div className="inline-flex items-center space-x-2">
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
					{/* <div className="inline-flex items-center space-x-2 mr-3">
						<button
							className={`px-3 py-1 text-xs rounded border transition-colors ${
								graphType === "normal"
									? "bg-green-900/30 text-green-400 border-green-800/50"
									: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
							}`}
							onClick={() => setGraphType("normal")}
						>
							Normal
						</button>
						<button
							className={`px-3 py-1 text-xs rounded border transition-colors ${
								graphType === "line"
									? "bg-green-900/30 text-green-400 border-green-800/50"
									: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
							}`}
							onClick={() => setGraphType("line")}
						>
							Line
						</button>
						<button
							className={`px-3 py-1 text-xs rounded border transition-colors ${
								graphType === "bar"
									? "bg-green-900/30 text-green-400 border-green-800/50"
									: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
							}`}
							onClick={() => setGraphType("bar")}
						>
							Bar
						</button>
						<button
							className={`px-3 py-1 text-xs rounded border transition-colors ${
								graphType === "candlestick"
									? "bg-green-900/30 text-green-400 border-green-800/50"
									: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
							}`}
							onClick={() => setGraphType("candlestick")}
						>
							Candles
						</button>
					</div> */}
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

			{/* Chart Area */}
			<div className="relative">
				<div ref={chartContainerRef} className="w-full h-[450px]" />
				{isEmpty && (
					<div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg bg-transparent pointer-events-none">
						Graph points not yet available
					</div>
				)}
			</div>
		</div>
	);
}
