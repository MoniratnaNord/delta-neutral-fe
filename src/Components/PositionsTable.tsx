import React, { useState, useMemo } from "react";

export interface PositionRow {
	id: string;
	coin: string;
	size: number;
	entry_price: number;
	side: string;
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
	value: any;
}

export function PositionsTable({ rows, value }: PositionsTableProps) {
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
							<th className="text-left px-4 py-2 whitespace-nowrap">Symbol</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">Size</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">Entry</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">Side</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">
								Unrealized PnL
							</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">
								Liq. Price
							</th>
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
									</td>
									<td className="px-4 py-2 text-right whitespace-nowrap">
										{r.size || r.position}
									</td>
									<td className="px-4 py-2 text-right whitespace-nowrap">
										$
										{r.entry_price === undefined
											? r.avg_entry_price?.toLocaleString() // Use optional chaining
											: r.entry_price.toLocaleString()}
									</td>
									<td className="px-4 py-2 text-right whitespace-nowrap">
										{value === "lighter"
											? r.sign === 1
												? "LONG"
												: "SHORT"
											: r.size > 0 || r.position > 0
											? "LONG"
											: "SHORT"}
									</td>
									<td
										className={`px-4 py-2 text-right whitespace-nowrap ${
											r.unrealized_pnl >= 0 ? "text-green-400" : "text-red-400"
										}`}
									>
										${r.unrealized_pnl.toLocaleString()}
									</td>
									<td className="px-4 py-2 text-right whitespace-nowrap">
										{r.liquidation_price
											? `$${Number(r.liquidation_price).toFixed(5)}`
											: "-"}
									</td>
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
