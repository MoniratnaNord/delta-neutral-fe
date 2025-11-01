import { useAppKitAccount } from "@reown/appkit/react";
import { motion, MotionProps } from "framer-motion";
import useGetBalance from "../hooks/useGetBalance";
import React, { useEffect } from "react";
import useGetAccountInfo from "../hooks/useGetAccountInfo";
import useFetchTradeDetails from "../hooks/useFetchTradeDetails";
import formatAmount from "../utils/formatAmount";
import useFetchPnlData from "../hooks/useFetchPnlData";

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
	const {
		data: pnlData,
		isLoading: isPnlLoading,
		refetch: refetchPnlData,
	} = useFetchPnlData(address || "");
	const { data: tradeData, refetch: refetchTradeDetails } =
		useFetchTradeDetails(address || "");
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
			refetchTradeDetails();
			refetchPnlData();
		}
	}, [
		loggedIn,
		refetchHlBalance,
		refetchAccountInfo,
		refetchTradeDetails,
		refetchPnlData,
	]);

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
					{isPnlLoading ? (
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
						<>
							$
							{formatAmount(
								Number(
									Number(Number(pnlData?.data?.hyperliquid?.account_balance)) +
										Number(pnlData?.data?.lighter?.account_balance)
								),
								2
							) || 0}
						</>
					)}
				</div>
				<div className="text-xs text-gray-400 mt-1">Estimated</div>
			</div>
			<div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">HyperLiquid Balance</div>
				<div className="mt-2 text-white font-semibold text-xl">
					{isPnlLoading ? (
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
						<>
							$
							{formatAmount(
								Number(pnlData?.data?.hyperliquid?.account_balance),
								2
							) || 0}
						</>
					)}
				</div>
				<div className="text-xs text-gray-400 mt-1">Available</div>
			</div>
			<div className="card p-4 rounded-lg">
				<div className="text-xs text-gray-400">Lighter Balance</div>
				<div className="mt-2 text-white font-semibold text-xl">
					{isPnlLoading ? (
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
						<>
							$
							{formatAmount(
								Number(pnlData?.data?.lighter?.account_balance),
								2
							) || 0}
						</>
					)}
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
