import React from "react";

export interface TradeRow {
	id: string;
	timestamp: string;
	side: "buy" | "sell";
	symbol: string;
	size: number;
	price: number;
	feeUsd?: number;
	realizedPnlUsd?: number;
}

interface TradesTableProps {
	rows: TradeRow[];
}

export function TradesTable({ rows }: TradesTableProps) {
	return (
		<div className="card rounded-lg">
			<div className="overflow-x-auto">
				<table className="min-w-[720px] w-full text-sm">
					<thead className="bg-[#121318] text-gray-400">
						<tr>
							<th className="text-left px-4 py-2 whitespace-nowrap">Time</th>
							<th className="text-left px-4 py-2 whitespace-nowrap">Side</th>
							<th className="text-left px-4 py-2 whitespace-nowrap">Symbol</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">Size</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">Price</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">Fee</th>
							<th className="text-right px-4 py-2 whitespace-nowrap">
								Realized PnL
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.length === 0 ? (
							<tr>
								<td colSpan={7} className="text-center text-gray-400 px-4 py-6">
									No trades yet
								</td>
							</tr>
						) : (
							rows.map((r) => (
								<tr key={r.id} className="border-t border-white/5">
									<td className="px-4 py-2 text-white whitespace-nowrap">
										{new Date(r.timestamp).toLocaleString()}
									</td>
									<td
										className={`px-4 py-2 capitalize whitespace-nowrap ${
											r.side === "buy" ? "text-green-400" : "text-red-400"
										}`}
									>
										{r.side}
									</td>
									<td className="px-4 py-2 whitespace-nowrap">{r.symbol}</td>
									<td className="px-4 py-2 text-right whitespace-nowrap">
										{r.size}
									</td>
									<td className="px-4 py-2 text-right whitespace-nowrap">
										${r.price.toLocaleString()}
									</td>
									<td className="px-4 py-2 text-right whitespace-nowrap">
										{r.feeUsd ? `$${r.feeUsd.toLocaleString()}` : "-"}
									</td>
									<td
										className={`px-4 py-2 text-right whitespace-nowrap ${
											r.realizedPnlUsd && r.realizedPnlUsd >= 0
												? "text-green-400"
												: "text-red-400"
										}`}
									>
										{r.realizedPnlUsd !== undefined
											? `$${r.realizedPnlUsd.toLocaleString()}`
											: "-"}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
