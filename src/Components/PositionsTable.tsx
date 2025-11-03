import React, { useState, useMemo } from "react";
import formatAmount from "../utils/formatAmount";

export interface PositionRow {
	id: string;
	coin: string;
	size: number;
	entry_price: number;
	side: string;
	platform: string;
	// markPrice: number;
	unrealized_pnl: number;
	liquidation_price?: number;
	avg_entry_price?: number;
	symbol?: string; // Add symbol property
	position?: number; // Add position property
	sign?: number;
}

interface PositionsTableProps {
	rows: PositionRow[];
}

export function PositionsTable({ rows }: PositionsTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 2;
	const currentItems = useMemo(() => {
		const indexOfLastItem = currentPage * itemsPerPage;
		const indexOfFirstItem = indexOfLastItem - itemsPerPage;
		return rows.slice(indexOfFirstItem, indexOfLastItem);
	}, [rows, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(rows.length / itemsPerPage);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	return (
		<div className="card rounded-lg">
			<div className="overflow-x-auto">
				<table className="min-w-[720px] w-full text-sm">
					<thead className="bg-[#121318] text-gray-400">
						<tr>
							<th className="text-left px-4 py-2 whitespace-nowrap">Market</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">Size</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">
								Platform
							</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">Side</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">
								Position Value
							</th>
							{/* <th className="text-right px-4 py-2 whitespace-nowrap">
								Liq. Price
							</th> */}
						</tr>
					</thead>
					<tbody>
						{currentItems.length === 0 ? (
							<tr>
								<td colSpan={6} className="text-center text-gray-400 px-4 py-6">
									No open positions
								</td>
							</tr>
						) : (
							currentItems.map((r: any) => (
								<tr key={r.id} className="border-t border-white/5">
									<td className="px-4 py-2 text-white whitespace-nowrap">
										{r.coin || r.symbol}
										<>
											{(r.platform === "Hyperliquid" ||
												r.platform === "Lighter") && (
												<a
													href={
														r.platform === "Hyperliquid"
															? `https://app.hyperliquid.xyz/trade/${
																	r.coin || r.symbol
															  }`
															: `https://app.lighter.xyz/trade/${
																	r.coin || r.symbol
															  }`
													}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center ml-2 text-green-400 hover:text-green-300"
													style={{ verticalAlign: "middle" }}
													title={`Open on ${r.platform}`}
												>
													<svg
														width="13"
														height="13"
														viewBox="0 0 20 20"
														fill="none"
													>
														<path
															d="M14 3H17V6"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M13.75 6.25L7.5 12.5"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M17 3L10 10"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</a>
											)}
										</>
									</td>
									<td className="px-4 py-2 text-right whitespace-nowrap">
										{r.size || r.position}
									</td>
									<td className="px-4 py-2 text-right whitespace-nowrap">
										{r.platform}
									</td>

									<td className="px-4 py-2 text-right whitespace-nowrap">
										{r.sign === 1 ? "LONG" : "SHORT"}
									</td>
									<td
										className={`px-4 py-2 text-right whitespace-nowrap ${
											r.position_value >= 0 ? "text-green-400" : "text-red-400"
										}`}
									>
										${formatAmount(r.position_value, 2)}
									</td>
									{/* <td className="px-4 py-2 text-right whitespace-nowrap">
										{r.liquidation_price
											? `$${Number(r.liquidation_price).toFixed(5)}`
											: "-"}
									</td> */}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="flex justify-center items-center py-12 space-x-4">
					<button
						disabled={currentPage === 1}
						onClick={() => paginate(currentPage - 1)}
						className={`bg-green-400 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-green-600 ${
							currentPage === 1
								? "bg-green-600 hover:bg-gray-200 cursor-not-allowed"
								: "bg-green-400"
						}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 inline"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<span className="text-white px-4 py-2">
						Page {currentPage} of {totalPages}
					</span>
					<button
						disabled={currentPage === totalPages}
						onClick={() => paginate(currentPage + 1)}
						className={`bg-green-400 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-green-600 ${
							currentPage === totalPages
								? "bg-green-600 hover:bg-gray-200 cursor-not-allowed"
								: "bg-green-400"
						}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 inline"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
			)}
		</div>
	);
}
