import { useAppKitAccount } from "@reown/appkit/react";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useGetDeposits from "../hooks/useGetDeposits";
import { DepositsTable } from "../Components/DepositsTable";
import useGetWithdraws from "../hooks/useGetWithdraws";
import useGetBridgeIn from "../hooks/useGetBridgeIn";
import useGetBalance from "../hooks/useGetBalance";
import { PlatformSwitcher } from "../Components/PlatformSwitcher";
import { HoldingsOverview } from "../Components/HoldingsOverview";
import { PositionsTable, PositionRow } from "../Components/PositionsTable";
import { TradesTable, TradeRow } from "../Components/TradesTable";
import useFetchDepositAddress from "../hooks/useFetchDepositAddress";

export function Dashboard() {
	const userAddress = useSelector((state: any) => state.user.userAddress);
	const hdAddress = useSelector((state: any) => state.user.hdAddress);

	console.log({ userAddress });
	const { isConnected } = useAppKitAccount();
	const [activeTab, setActiveTab] = useState<string>("TRANSACTIONS");
	const [platform, setPlatform] = useState<"hyperliquid" | "lighter">(
		"hyperliquid"
	);
	const [transactionsData, setTransactionsData] = useState<any>([]);
	const [transactionsSubTab, setTransactionsSubTab] =
		useState<string>("DEPOSITS");
	const [page, setPage] = useState<number>(1);
	console.log(userAddress);
	const {
		data: deposits,
		isLoading: depositsLoading,
		refetch: refetchDeposits,
	} = useGetDeposits(userAddress, page);
	const {
		data: withdraws,
		isLoading: withdrawsLoading,
		refetch: refetchWithdraws,
	} = useGetWithdraws(userAddress, page);
	const {
		data: bridgeIn,
		isLoading: isBridgeInLoading,
		refetch: refetchBridgeIn,
	} = useGetBridgeIn(userAddress, page);
	useEffect(() => {
		if (activeTab === "TRANSACTIONS" && !!userAddress && isConnected) {
			refetchDeposits();
			refetchWithdraws();
			refetchBridgeIn();
		}
	}, [activeTab, userAddress, isConnected, page]);
	useEffect(() => {
		if (activeTab !== "TRANSACTIONS") return;
		const extractArray = (dataWrapper: any) => {
			const payload = dataWrapper?.data as any;
			if (Array.isArray(payload)) return payload;
			if (Array.isArray(payload?.data)) return payload.data;
			if (Array.isArray(payload?.data?.items)) return payload.data.items;
			if (Array.isArray(payload?.results)) return payload.results;
			if (Array.isArray(payload?.deposits)) return payload.deposits;
			if (Array.isArray(payload?.withdraws)) return payload.withdraws;
			return [];
		};
		const classify = (tx: any) => {
			if (transactionsSubTab === "BRIDGE_IN") return "BRIDGE_IN";
			if (transactionsSubTab === "BRIDGE_OUT") return "BRIDGE_OUT";
			if (tx?.withdrawal_address) return "WITHDRAWS";
			if (tx?.deposit_address) return "DEPOSITS";
			if (
				(tx?.bridge === true || tx?.is_bridge === true) &&
				tx?.direction === "in"
			)
				return "BRIDGE_IN";
			if (
				(tx?.bridge === true || tx?.is_bridge === true) &&
				tx?.direction === "out"
			)
				return "BRIDGE_OUT";
			if (tx?.src_chain !== null || tx?.src_chain !== undefined)
				return "BRIDGE_IN";
			if (tx?.dst_address !== null) return "BRIDGE_OUT";
			return "DEPOSITS";
		};
		const depositRows = deposits
			? extractArray(deposits).map((d: any) => ({ ...d, _txType: classify(d) }))
			: [];
		const withdrawRows = withdraws
			? extractArray(withdraws).map((w: any) => ({
					...w,
					_txType: classify(w),
			  }))
			: [];
		const bridgeInRows = bridgeIn
			? extractArray(bridgeIn).map((b: any) => ({
					...b,
					_txType: classify(b),
			  }))
			: [];
		const merged = [...depositRows, ...withdrawRows, ...bridgeInRows].sort(
			(a: any, b: any) => {
				const aTime = new Date(a.created_at || a.createdAt || 0).getTime();
				const bTime = new Date(b.created_at || b.createdAt || 0).getTime();
				return bTime - aTime;
			}
		);
		setTransactionsData(merged);
	}, [deposits, withdraws, bridgeIn, activeTab, page]);

	const {
		data: hlBalance,
		isLoading: isHlBalanceLoading,
		refetch: refetchHlBalance,
		error: hlBalanceError,
	} = useGetBalance(userAddress);

	useEffect(() => {
		if (activeTab === "TRANSACTIONS" && !!userAddress && isConnected) {
			refetchHlBalance();
		}
	}, [activeTab, userAddress, isConnected, page]);

	console.log("checking transactions", transactionsData);
	return (
		<>
			<div className="text-white max-w-5xl mx-auto px-6 py-8">
				{/* Address */}
				<div className="mb-4">
					<span className="bg-[#15161b] px-3 py-1 rounded">
						Address: {isConnected ? hdAddress : "Not connected"}
					</span>
				</div>

				{/* Overview */}
				<div className="bg-[#15161b] p-4 rounded w-64 mb-6">
					<div>Withdrawable balance</div>
					<div className="text-xl font-bold">
						{hlBalance && hlBalance.data.success
							? `$${
									Number(hlBalance.data.data.exchange1.balance) +
									Number(hlBalance.data.data.exchange2.balance)
							  }`
							: 0}
					</div>
				</div>

				{/* Tabs */}
				<div className="flex space-x-4 border-b border-gray-600 mb-4">
					{["TRANSACTIONS"].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`pb-2 text-sm border-b-2 ${
								activeTab === tab
									? "text-green-400 border-green-400"
									: "hover:text-green-400 border-transparent hover:border-green-400"
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* Sub-tabs for Transactions */}
				{activeTab === "TRANSACTIONS" && (
					<div className="flex space-x-3 mb-4">
						{[
							{ key: "DEPOSITS", label: "Deposits" },
							{ key: "WITHDRAWS", label: "Withdraws" },
						].map((t) => (
							<button
								key={t.key}
								onClick={() => setTransactionsSubTab(t.key)}
								className={`px-3 py-1 text-xs rounded ${
									transactionsSubTab === t.key
										? "bg-green-900/30 text-green-400 border border-green-800/50"
										: "bg-[#15161b] text-gray-300 hover:text-green-300"
								}`}
							>
								{t.label}
							</button>
						))}
					</div>
				)}

				{/* Table */}
				{activeTab === "TRANSACTIONS" &&
				(depositsLoading || withdrawsLoading || isBridgeInLoading) ? (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-400"></div>
					</div>
				) : activeTab === "TRANSACTIONS" ? (
					transactionsData.filter((tx: any) => {
						if (!tx?._txType) return transactionsSubTab === "DEPOSITS";
						return tx._txType === transactionsSubTab;
					}).length > 0 ? (
						<DepositsTable
							data={transactionsData.filter((tx: any) => {
								if (!tx?._txType) return transactionsSubTab === "DEPOSITS";
								return tx._txType === transactionsSubTab;
							})}
						/>
					) : (
						<div className="text-center text-gray-400 py-10">
							No transactions found.
						</div>
					)
				) : null}
			</div>
			{/* Pagination */}
			{activeTab === "TRANSACTIONS" && (
				<div className="flex justify-center items-center py-12 space-x-4">
					<button
						disabled={page === 1}
						className={`bg-green-400 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-green-600 ${
							page === 1
								? "bg-gray-200 hover:bg-gray-200 cursor-not-allowed"
								: "bg-green-600"
						}`}
						onClick={() => setPage(page - 1)}
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
						Page {page} of{" "}
						{(() => {
							let totalPages = 1;
							if (
								transactionsSubTab === "DEPOSITS" &&
								deposits?.data?.total_page
							) {
								totalPages = deposits.data.total_page;
							} else if (
								transactionsSubTab === "WITHDRAWS" &&
								withdraws?.data?.total_page
							) {
								totalPages = withdraws.data.total_page;
							} else if (
								transactionsSubTab === "BRIDGE_IN" &&
								bridgeIn?.data?.total_page
							) {
								totalPages = bridgeIn.data.total_page;
							}
							return totalPages;
						})()}
					</span>
					{(() => {
						let totalPages = 1;
						if (
							transactionsSubTab === "DEPOSITS" &&
							deposits?.data?.total_page
						) {
							totalPages = deposits.data.total_page;
						} else if (
							transactionsSubTab === "WITHDRAWS" &&
							withdraws?.data?.total_page
						) {
							totalPages = withdraws.data.total_page;
						} else if (
							transactionsSubTab === "BRIDGE_IN" &&
							bridgeIn?.data?.total_page
						) {
							totalPages = bridgeIn.data.total_page;
						}
						return (
							<button
								disabled={page === totalPages}
								className={`bg-green-400 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-green-600 ${
									page === totalPages
										? "bg-gray-200 hover:bg-gray-200 cursor-not-allowed"
										: "bg-green-600"
								}`}
								onClick={() => setPage(page + 1)}
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
						);
					})()}
				</div>
			)}
		</>
	);
}
