import { useAppKitAccount } from "@reown/appkit/react";
import { motion, MotionProps } from "framer-motion";
import useGetBalance from "../hooks/useGetBalance";
import React, { useEffect } from "react";
import useGetAccountInfo from "../hooks/useGetAccountInfo";
import useFetchTradeDetails from "../hooks/useFetchTradeDetails";
import formatAmount from "../utils/formatAmount";

export function StatCards(props: MotionProps) {
	const { address, isConnected } = useAppKitAccount();
	// const address = "0x85290Ee672292528376adc10ef1Ff6f4Dbb29bDF";
	// const isConnected = true;
	const {
		data: hlBalance,
		isLoading: isHlBalanceLoading,
		refetch: refetchHlBalance,
		error: hlBalanceError,
	} = useGetBalance(address || "");
	const { data: tradeData } = useFetchTradeDetails(address || "");
	const {
		data: accountInfo,
		isLoading: isAccountInfoLoading,
		refetch: refetchAccountInfo,
		error: accountInfoError,
	} = useGetAccountInfo(address || "");
	const loggedIn = localStorage.getItem(address + "_LoggedIn");
	useEffect(() => {
		if (loggedIn) {
			refetchHlBalance();
			refetchAccountInfo();
		}
	}, [loggedIn]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			className="grid grid-cols-1 sm:grid-cols-4 gap-4"
			{...props}
		>
			<div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">Total Value</div>
				<div className="mt-2 text-white font-semibold text-xl">
					$
					{accountInfo &&
					accountInfo.data.success &&
					!accountInfo.data.data.lighter.error &&
					!accountInfo.data.data.hyperliquid.error
						? formatAmount(
								Number(
									Number(
										accountInfo.data.data.hyperliquid.data.margin_summary
											.account_value
									) +
										Number(accountInfo.data.data.lighter.data.total_asset_value)
								),
								2
						  )
						: 0}
				</div>
				<div className="text-xs text-gray-400 mt-1">Estimated</div>
			</div>
			<div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">HyperLiquid Balance</div>
				<div className="mt-2 text-white font-semibold text-xl">
					$
					{hlBalance &&
					hlBalance?.data?.success &&
					!hlBalance?.data?.data?.exchange1?.error &&
					hlBalance?.data?.data?.exchange1
						? formatAmount(Number(hlBalance.data.data.exchange1.balance), 2)
						: 0}
				</div>
				<div className="text-xs text-gray-400 mt-1">Available</div>
			</div>
			<div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">Lighter Balance</div>
				<div className="mt-2 text-white font-semibold text-xl">
					$
					{hlBalance &&
					hlBalance.data.success &&
					!hlBalance.data.data.exchange2.error &&
					hlBalance?.data?.data?.exchange2
						? formatAmount(Number(hlBalance.data.data.exchange2.balance), 2)
						: 0}
				</div>
				<div className="text-xs text-gray-400 mt-1">Available</div>
			</div>
			<div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">Funding Earned</div>
				<div
					className={
						Number(tradeData?.data?.data.total_funding_earned) < 0
							? "mt-2 text-red-400 font-semibold text-xl"
							: "mt-2 text-green-400 font-semibold text-xl"
					}
				>
					$
					{tradeData && tradeData.data.success && tradeData?.data?.data
						? formatAmount(Number(tradeData.data.data.total_funding_earned), 2)
						: 0}
				</div>
			</div>
		</motion.div>
	);
}
