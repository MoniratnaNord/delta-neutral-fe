import { useAppKitAccount } from "@reown/appkit/react";
import React from "react";
import useFetchTradeDetails from "../hooks/useFetchTradeDetails";
import formatAmount from "../utils/formatAmount";

interface HoldingsOverviewProps {
	market: string;
	balanceUsd: number;
	portfolioValueUsd: number;
	pnlRealizedUsd: number;
	pnlUnrealizedUsd: number;
}

export function HoldingsOverview({
	market,
	balanceUsd,
	portfolioValueUsd,
	pnlRealizedUsd,
	pnlUnrealizedUsd,
}: HoldingsOverviewProps) {
	const { isConnected, address } = useAppKitAccount();
	const { data: tradeData, isLoading: tradeloading } = useFetchTradeDetails(
		address || ""
	);
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">Market</div>
				<div className="mt-2 text-white font-semibold text-xl capitalize">
					{market === undefined ? "-" : market}
				</div>
			</div>
			<div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">Balance</div>
				<div className="mt-2 text-white font-semibold text-xl">
					{tradeloading ? (
						<span className="w-5 h-5 inline-block align-middle">
							<svg
								className="animate-spin h-5 w-5 text-gray-400"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								></path>
							</svg>
						</span>
					) : (
						<>${formatAmount(Number(balanceUsd), 2)}</>
					)}
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
					<div className="text-xs text-gray-400">Funding Earned</div>
					<div
						className={`mt-2 font-semibold text-xl ${
							Number(tradeData?.data.data.total_funding_earned) >= 0
								? "text-green-400"
								: "text-red-400"
						}`}
					>
						$
						{!tradeloading &&
							formatAmount(
								Number(tradeData?.data.data.total_funding_earned),
								2
							)}
					</div>
				</div>
				<div className="card p-4 rounded-lg">
					<div className="text-xs text-gray-400">Fees Paid</div>
					<div
						className={`mt-2 font-semibold text-xl ${
							Number(tradeData?.data.data.total_fees_paid) >= 0
								? "text-green-400"
								: "text-red-400"
						}`}
					>
						$
						{!tradeloading &&
							formatAmount(Number(tradeData?.data.data.total_fees_paid), 2)}
					</div>
				</div>
			</div>
		</div>
	);
}
