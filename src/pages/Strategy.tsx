import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAppKitAccount } from "@reown/appkit/react";
import useGetAccountInfo from "../hooks/useGetAccountInfo";
import useGetBalance from "../hooks/useGetBalance";
import { PlatformSwitcher } from "../Components/PlatformSwitcher";
import { PositionsTable, PositionRow } from "../Components/PositionsTable";

export default function Strategy() {
	const { isConnected, address } = useAppKitAccount();
	const userAddress = useSelector((state: any) => state.user.userAddress);
	const [platform, setPlatform] = useState<"hyperliquid" | "lighter">(
		"hyperliquid"
	);

	const { data: accountInfo } = useGetAccountInfo(address || "");
	const { data: balances } = useGetBalance(userAddress);

	const derived = useMemo(() => {
		const isHL = platform === "hyperliquid";
		const accountValue = (() => {
			if (balances?.data?.success) {
				return isHL
					? Number(balances.data.data?.exchange1?.balance || 0)
					: Number(balances.data.data?.exchange2?.balance || 0);
			}
			return 0;
		})();

		// Pull positions when Hyperliquid; mock for lighter for now
		let positions: PositionRow[] = [];
		if (isHL && accountInfo?.data?.data?.hyperliquid?.data?.positions) {
			positions = accountInfo.data.data.hyperliquid.data.positions;
		} else if (!isHL) {
			positions = [
				{
					id: "1",
					coin: "SOL-PERP",
					size: 10,
					entry_price: 155,
					unrealized_pnl: 30,
					liquidation_price: 90,
				},
			];
		}

		const unrealizedPnlTotal = positions.reduce(
			(sum, p) => sum + (Number(p.unrealized_pnl) || 0),
			0
		);

		// Simple placeholder metrics
		const availableBalance = Math.max(accountValue - 0, 0);
		const marginUsed = Math.max(accountValue - availableBalance, 0);
		const fundingImpact = 0; // placeholder until API available
		const allocationPct =
			accountValue > 0 ? (positions.length > 0 ? 100 : 0) : 0;

		return {
			accountValue,
			availableBalance,
			marginUsed,
			unrealizedPnlTotal,
			fundingImpact,
			allocationPct,
			positions,
		};
	}, [platform, balances, accountInfo]);

	return (
		<div className="text-white max-w-5xl mx-auto px-6 py-8 space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Strategy</h2>
				<PlatformSwitcher value={platform} onChange={setPlatform} />
			</div>

			{/* Strategy Summary Card */}
			<div className="card rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div>
					<div className="text-xs text-gray-400 mb-1">Exchange</div>
					<div className="text-sm font-medium">
						{platform === "hyperliquid" ? "Hyperliquid" : "Lighter"}
					</div>
				</div>
				<div>
					<div className="text-xs text-gray-400 mb-1">Slippage tolerance</div>
					<div className="text-sm font-medium">0.10%</div>
				</div>
				<div>
					<div className="text-xs text-gray-400 mb-1">Leverage mode</div>
					<div className="text-sm font-medium">Cross × 5</div>
				</div>
				<div className="grid grid-cols-3 gap-3 sm:col-span-2 lg:col-span-1">
					<div>
						<div className="text-[10px] text-gray-400">Account Value</div>
						<div className="text-sm font-semibold">
							${derived.accountValue.toLocaleString()}
						</div>
					</div>
					<div>
						<div className="text-[10px] text-gray-400">Available</div>
						<div className="text-sm font-semibold">
							${derived.availableBalance.toLocaleString()}
						</div>
					</div>
					<div>
						<div className="text-[10px] text-gray-400">Margin Used</div>
						<div className="text-sm font-semibold">
							${derived.marginUsed.toLocaleString()}
						</div>
					</div>
				</div>
			</div>

			{/* Open Positions Table */}
			<div>
				<div className="mb-2 text-sm text-gray-300">Open Positions</div>
				<PositionsTable rows={derived.positions} />
			</div>

			{/* Performance Snapshot */}
			<div className="card rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div>
					<div className="text-xs text-gray-400 mb-1">
						Unrealized PnL (Total)
					</div>
					<div
						className={`text-sm font-semibold ${
							derived.unrealizedPnlTotal >= 0
								? "text-green-400"
								: "text-red-400"
						}`}
					>
						${derived.unrealizedPnlTotal.toLocaleString()}
					</div>
				</div>
				<div>
					<div className="text-xs text-gray-400 mb-1">Funding impact</div>
					<div className="text-sm font-semibold">
						${derived.fundingImpact.toLocaleString()}
					</div>
				</div>
				<div>
					<div className="text-xs text-gray-400 mb-1">Allocation</div>
					<div className="text-sm font-semibold">{derived.allocationPct}%</div>
				</div>
			</div>
		</div>
	);
}
