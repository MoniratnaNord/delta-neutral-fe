import { useAppKitAccount } from "@reown/appkit/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useChainId, useWalletClient } from "wagmi";
import useDepositTxn from "../hooks/useDepositTxn";
import { SUPPORTED_TOKENS } from "../config/tokens";
import { erc20Abi } from "../abis/erc20abi";
import { parseUnits } from "viem";
import { toast } from "sonner";
import useWithdrawTxn from "../hooks/useWithdrawTxn";
import useGetBalance from "../hooks/useGetBalance";
import useCheckDepositWithdraw from "../hooks/useCheckDepositWithdraw";
import formatAmount from "../utils/formatAmount";
import useFetchPnlData from "../hooks/useFetchPnlData";

export function WithdrawInput() {
	const userAddress = useSelector((state: any) => state.user.userAddress);
	const walletClient = useWalletClient();
	const chain = useChainId();
	const { mutate: withdrawRequest } = useWithdrawTxn();
	const [amount, setAmount] = useState("500");
	const [addressInput, setAddressInput] = useState("");
	const balance = useSelector((state: any) => state.user.userBalance);
	const { address, isConnected } = useAppKitAccount();
	const [isLoading, setIsLoading] = useState(false);
	const [asset] = useState("USDC");
	const { data: withdrawCheck, isLoading: withdrawCheckLoading } =
		useCheckDepositWithdraw(address || "");
	const {
		data: withdrawBalance,
		isLoading: isBalanceLoading,
		isSuccess: balanceSuccess,
	} = useGetBalance(address || "");
	const {
		data: pnlData,
		isLoading: isPnlLoading,
		refetch: refetchPnlData,
	} = useFetchPnlData(address || "");

	const handleWithdraw = async () => {
		if (!amount) return alert("Enter amount");
		setIsLoading(true);
		withdrawRequest(
			{
				userId: address,
				amount: amount,
				tokenSymbol: "USDC2",
				network: SUPPORTED_TOKENS[chain].name,
			},
			{
				onSuccess: (data: any) => {
					toast.success("Withdraw Request recorded successfully!");
					setIsLoading(false);
				},
				onError: (error: any) => {
					toast.error("Withdraw Request failed!");
					setIsLoading(false);
				},
			}
		);
	};
	return (
		<>
			<div className="flex items-center justify-between pt-10">
				<div>
					{/* <h3 className="h-heading text-white text-xl">Withdraw from Asthra</h3> */}
					<p className="text-sm text-gray-400 mt-1">
						Request to close all positions and withdraw funds.
					</p>
				</div>
			</div>
			<div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4">
				<div className="md:col-span-2">
					{/* <label className="text-xs text-gray-400">Amount</label>
					<input
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="mt-2 w-full rounded-md p-3 bg-transparent border border-neutral-800 text-white"
					/>
					<div className="flex">
						{[10, 25, 50, 100].map((n) => (
							<button
								key={n}
								className="text-xs px-3 py-1 border border-neutral-800 rounded-md text-gray-300"
								onClick={() =>
									setAmount(Number(balance * (n / 100)).toFixed(2))
								}
							>
								{n}%
							</button>
						))}
					</div> */}
					{/* <label className="text-xs text-gray-400">Address</label>
					<input
						value={userAddress}
						// onChange={(e) => setAddressInput(e.target.value)}
						className="w-full rounded-md p-3 bg-transparent border border-neutral-800 text-white"
					/> */}
				</div>

				{/* <div className="flex flex-col gap-4">
					<div className="card p-3 rounded-md flex items-center justify-between">
						<div>
							<div className="text-xs text-gray-400">Asset</div>
							<div className="text-white font-medium mt-1">{asset}</div>
						</div>
						<div>
							<div className="text-xs text-gray-400">Withdrawable Balance</div>
							<div className="text-white font-medium mt-1">{balance}</div>
						</div>
						
					</div>
					<button
						onClick={handleWithdraw}
						disabled={balance < 5 ? true : false}
						className={
							isConnected && balance < 5
								? "bg-gray-400 rounded-md py-3 cursor-not-allowed"
								: "btn-accent rounded-md py-3"
						}
					>
						Place Withdraw
					</button>
					<p className="text-sm text-red-400">
						{isConnected && balance < 5
							? "Wallet doesn't have enough USDC"
							: null}
					</p>
				</div> */}
				<div className="mt-8 flex flex-col justify-between">
					<div className="card p-4 rounded-md border border-neutral-800 mb-4">
						<div className="flex justify-between">
							<div>
								<div className="text-xs text-gray-400">Asset</div>
								<div className="text-white font-medium mt-1">{asset}</div>
							</div>
							<div>
								<div className="text-xs text-gray-400">
									Withdrawable Balance
								</div>
								<div className="text-white font-medium mt-1">
									{formatAmount(
										Number(pnlData?.data.hyperliquid.account_balance) +
											Number(pnlData?.data.lighter.account_balance),
										2
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="text-red p-2">
						<p className="text-red-400">
							{!withdrawCheck?.data.enable_withdraw &&
								"There is a pending withdraw you can't submit another"}
						</p>
					</div>
					<button
						onClick={handleWithdraw}
						disabled={
							!withdrawCheck?.data.enable_withdraw ||
							Number(pnlData?.data.hyperliquid.account_balance) +
								Number(pnlData?.data.lighter.account_balance) ===
								0 ||
							isLoading
						}
						className={`w-full rounded-md py-3 ${
							(isConnected && balance < 5) ||
							!withdrawCheck?.data.enable_withdraw
								? "bg-gray-400 cursor-not-allowed"
								: "btn-accent"
						}`}
					>
						{isLoading ? "Withdrawing..." : "Place Withdraw"}
					</button>
				</div>
			</div>
		</>
	);
}
