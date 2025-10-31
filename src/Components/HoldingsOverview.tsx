import React from "react";

interface HoldingsOverviewProps {
	platform: "hyperliquid" | "lighter";
	balanceUsd: number;
	portfolioValueUsd: number;
	pnlRealizedUsd: number;
	pnlUnrealizedUsd: number;
}

export function HoldingsOverview({
	platform,
	balanceUsd,
	portfolioValueUsd,
	pnlRealizedUsd,
	pnlUnrealizedUsd,
}: HoldingsOverviewProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">Platform</div>
				<div className="mt-2 text-white font-semibold text-xl capitalize">
					{platform}
				</div>
			</div>
			<div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">Balance</div>
				<div className="mt-2 text-white font-semibold text-xl">
					${balanceUsd.toLocaleString()}
				</div>
			</div>
			{/* <div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">Portfolio Value</div>
				<div className="mt-2 text-white font-semibold text-xl">
					${portfolioValueUsd.toLocaleString()}
				</div>
			</div> */}
			<div className="grid grid-cols-2 gap-4">
				<div className="card p-4 rounded-lg">
					<div className="text-xs text-gray-400">PnL Realized</div>
					<div
						className={`mt-2 font-semibold text-xl ${
							pnlRealizedUsd >= 0 ? "text-green-400" : "text-red-400"
						}`}
					>
						${pnlRealizedUsd.toLocaleString()}
					</div>
				</div>
				<div className="card p-4 rounded-lg">
					<div className="text-xs text-gray-400">PnL Unrealized</div>
					<div
						className={`mt-2 font-semibold text-xl ${
							pnlUnrealizedUsd >= 0 ? "text-green-400" : "text-red-400"
						}`}
					>
						${pnlUnrealizedUsd.toLocaleString()}
					</div>
				</div>
			</div>
		</div>
	);
}
