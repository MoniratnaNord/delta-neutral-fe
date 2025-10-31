import { useAppKitAccount } from "@reown/appkit/react";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useGetBalance from "../hooks/useGetBalance";
import { PlatformSwitcher } from "../Components/PlatformSwitcher";
import { HoldingsOverview } from "../Components/HoldingsOverview";
import { PositionsTable, PositionRow } from "../Components/PositionsTable";
import { TradesTable, TradeRow } from "../Components/TradesTable";
import useGetAccountInfo from "../hooks/useGetAccountInfo";
import useGetPnl from "../hooks/useGetPnl";

export function Holdings() {
	const userAddress = useSelector((state: any) => state.user.userAddress);
	const { isConnected, address } = useAppKitAccount();
	// const address = "0x85290Ee672292528376adc10ef1Ff6f4Dbb29bDF";
	const { data: accountInfo, isLoading: isAccountLoading } = useGetAccountInfo(
		address || ""
	);
	console.log("Checking accountInfo", accountInfo);
	const [platform, setPlatform] = useState<"hyperliquid" | "lighter">(
		"hyperliquid"
	);

	const { data: hlBalance, isLoading: isBalanceLoading } =
		useGetBalance(userAddress);
	const { data: pnlData, isLoading: isPnlLoading } = useGetPnl(userAddress);
	const mock = useMemo(() => {
		const isHL = platform === "hyperliquid";
		const balance =
			hlBalance && hlBalance?.data?.success
				? isHL
					? hlBalance?.data?.data?.exchange1?.balance
					: hlBalance?.data?.data?.exchange2?.balance
				: 0;

		// Default empty positions array
		let positions: any[] = [];

		if (isHL && accountInfo?.data?.data?.hyperliquid?.data?.positions) {
			positions = accountInfo.data.data.hyperliquid.data.positions;
		} else if (!isHL && accountInfo?.data?.data?.hyperliquid?.data?.positions) {
			// Mock data for lighter platform
			positions = accountInfo.data.data.lighter.data.positions;
		}
		positions = positions.filter((position) => Number(position.position) !== 0);
		let pnlRealizedUsd = 0;
		// Fix: Correctly access the realized PnL for each platform
		if (isHL && pnlData?.data?.data?.hl) {
			const hlPnlArray = pnlData.data.data.hl;
			console.log("inside if", hlPnlArray);
			if (
				hlPnlArray &&
				typeof hlPnlArray === "object" &&
				!Array.isArray(hlPnlArray)
			) {
				// If it's an object, sum the values of realized_pnl_all_time from its properties
				pnlRealizedUsd = Object.values(hlPnlArray).reduce(
					(acc: number, item: any) =>
						acc + Number(item?.realized_pnl_all_time ?? 0),
					0
				);
			}
		} else if (!isHL && pnlData?.data?.data?.lighter) {
			const lighterPnlArray = pnlData.data.data.lighter;
			if (
				lighterPnlArray &&
				typeof lighterPnlArray === "object" &&
				!Array.isArray(lighterPnlArray)
			) {
				pnlRealizedUsd = Object.values(lighterPnlArray).reduce(
					(acc: number, item: any) =>
						acc + Number(item?.realized_pnl_all_time ?? 0),
					0
				);
			}
		}

		return { balance: Number(balance) || 0, positions, pnlRealizedUsd };
	}, [platform, hlBalance, accountInfo, pnlData]);

	const isLoading = isAccountLoading || isBalanceLoading;

	return (
		<div className="text-white max-w-5xl mx-auto px-6 py-8 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Holdings</h3>
				<PlatformSwitcher value={platform} onChange={setPlatform} />
			</div>
			<div
				className={`transition-opacity duration-300 ${
					isLoading ? "opacity-50" : "opacity-100"
				}`}
			>
				<HoldingsOverview
					platform={platform}
					balanceUsd={mock?.balance || 0}
					portfolioValueUsd={mock?.balance || 0}
					pnlRealizedUsd={mock.pnlRealizedUsd}
					pnlUnrealizedUsd={
						mock?.positions?.reduce(
							(acc, p) => acc + Number(p.unrealized_pnl),
							0
						) || 0
					}
				/>
				<div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
					<div>
						<div className="mb-2 text-sm text-gray-300">Current Positions</div>
						<PositionsTable rows={mock?.positions || []} value={platform} />
					</div>
					{/* <div>
						<div className="mb-2 text-sm text-gray-300">Trade History</div>
						<TradesTable rows={mock.trades} />
					</div> */}
				</div>
			</div>
			{isLoading && (
				<div className="absolute inset-0 pointer-events-none">
					<div className="relative w-full h-full">
						{/* Shimmer overlay */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
						<div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"
							style={{ animationDelay: "0.5s" }}
						></div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Holdings;
