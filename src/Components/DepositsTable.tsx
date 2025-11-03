import React from "react";
export function DepositsTable({ data }: { data: any[] }) {
	const rows = Array.isArray(data) ? data : [];
	console.log("checking data", rows);

	const truncateMiddle = (
		value?: string,
		front: number = 6,
		back: number = 4
	) => {
		if (!value || typeof value !== "string") return "";
		if (value.length <= front + back + 3) return value;
		return `${value.slice(0, front)}...${value.slice(-back)}`;
	};
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full text-sm">
				<thead>
					<tr className="bg-[#15161b]">
						<th className="px-4 py-2 text-left">Hash</th>
						<th className="px-4 py-2 text-left">Method</th>
						<th className="px-4 py-2 text-left">Date</th>
						<th className="px-4 py-2 text-left">From</th>
						<th className="px-4 py-2 text-left">To</th>
						<th className="px-4 py-2 text-left">Amount</th>
						<th className="px-4 py-2 text-left">Token</th>
						<th className="px-4 py-2 text-left">Status</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((tx, i) => (
						<tr key={i} className="border-b border-gray-700 hover:bg-[#0D2F26]">
							<td className="px-4 py-2 text-blue-400">
								{truncateMiddle(tx.tx_hash) || "-"}
							</td>
							<td className="px-4 py-2">
								{tx.withdrawal_address ? "Withdraw" : "Deposit"}
							</td>
							<td className="px-4 py-2">
								{new Date(tx.created_at).toLocaleDateString()}
							</td>
							<td className="px-4 py-2">
								{tx.withdrawal_address
									? "Platform"
									: truncateMiddle(tx.user_id)}
							</td>
							<td className="px-4 py-2">
								{tx._txType === "BRIDGE_IN"
									? "DEX"
									: truncateMiddle(tx.deposit_address || tx.withdrawal_address)}
							</td>
							<td
								className={`px-4 py-2 ${
									tx.amount < 0 ? "text-red-400" : "text-green-400"
								}`}
							>
								{tx.amount || "-"}
							</td>
							<td className="px-4 py-2">{tx.asset}</td>
							<td className="px-4 py-2">{tx.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
