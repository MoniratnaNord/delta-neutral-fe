import React, { useEffect } from "react";
import { motion } from "framer-motion";
import useGetDeposits from "../hooks/useGetDeposits";
import useGetWithdraws from "../hooks/useGetWithdraws";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAppKitAccount } from "@reown/appkit/react";
export function ActivityList() {
	const [activity, setActivity] = useState<any>([]);
	const { isConnected } = useAppKitAccount();
	const userAddress = useSelector((state: any) => state.user.userAddress);
	const {
		data: deposits,
		isLoading: depositsLoading,
		refetch: refetchDeposits,
	} = useGetDeposits(userAddress, 1);
	const {
		data: withdraws,
		isLoading: withdrawsLoading,
		refetch: refetchWithdraws,
	} = useGetWithdraws(userAddress, 1);
	// Merge deposits and withdraws, sort by timestamp, and take last 5
	// Only update activity when deposits or withdraws change
	// loop through activity and show the latest 5
	activity.forEach((item: any) => {
		console.log("checking item", item);
	});
	useEffect(() => {
		if (
			deposits?.data?.success &&
			withdraws?.data?.success &&
			deposits?.data.data &&
			withdraws?.data.data
		) {
			// Merge deposits and withdraws, then sort by timestamp descending to mix them by recency
			const allItems = [
				...(deposits?.data?.data?.items || []),
				...(withdraws?.data?.data?.items || []),
			];
			const mergedActivity = allItems
				.sort((a, b) => {
					// Use created_at or timestamp, fallback to 0 if missing
					const aTime = new Date(a.created_at || a.timestamp || 0).getTime();
					const bTime = new Date(b.created_at || b.timestamp || 0).getTime();
					return bTime - aTime;
				})
				.slice(0, 5);
			setActivity(mergedActivity);
		}
		// setActivity([]);
	}, [deposits?.data.data, withdraws?.data.data]);
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="card p-4 rounded-lg mt-6"
		>
			<div className="flex items-center justify-between">
				<div className="text-sm text-gray-300 font-medium">Recent Activity</div>
				<div className="text-xs text-gray-400">Showing last 5</div>
			</div>

			<ul className="mt-3 space-y-3">
				{activity.map((item: any) => (
					<li className="flex items-center justify-between bg-transparent p-3 rounded-md border border-transparent/6">
						<div>
							<div className="text-sm text-white font-medium">
								{item.deposit_address ? "Deposit" : "Withdraw"}
							</div>
							<div className="text-xs text-gray-400">
								{item.amount} {item.asset}
							</div>
						</div>
						<div className="text-xs text-green-400">
							<a
								href={
									item.deposit_address
										? `https://sepolia.arbiscan.io/tx/${item.tx_hash}`
										: `https://sepolia.arbiscan.io//tx/${item.tx_hash}`
								}
								target="_blank"
								rel="noopener noreferrer"
							>
								Info
							</a>
						</div>
					</li>
				))}
				{/* <li className="flex items-center justify-between bg-transparent p-3 rounded-md border border-transparent/6">
					<div>
						<div className="text-sm text-white font-medium">Deposit</div>
						<div className="text-xs text-gray-400">0.50 USDT — on-chain</div>
					</div>
					<div className="text-xs text-green-400">Success</div>
				</li>
				<li className="flex items-center justify-between bg-transparent p-3 rounded-md border border-transparent/6">
					<div>
						<div className="text-sm text-white font-medium">
							Strategy Update
						</div>
						<div className="text-xs text-gray-400">Rebalanced positions</div>
					</div>
					<div className="text-xs text-yellow-300">Info</div>
				</li> */}
			</ul>
		</motion.div>
	);
}
