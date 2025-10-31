import { useAppKitAccount } from "@reown/appkit/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useChainId, useWalletClient } from "wagmi";
import useDepositTxn from "../hooks/useDepositTxn";
import { SUPPORTED_TOKENS } from "../config/tokens";
import { erc20Abi } from "../abis/erc20abi";
import { parseUnits } from "viem";
import { toast } from "sonner";

export function DepositInput() {
	const walletClient = useWalletClient();
	const chain = useChainId();
	const { mutate: depositTxn } = useDepositTxn();
	const [amount, setAmount] = useState("500");
	const balance = useSelector((state: any) => state.user.userBalance);
	const { address, isConnected } = useAppKitAccount();
	const [asset] = useState("USDC");
	const [isLoading, setIsLoading] = useState(false);
	const depositAddress = useSelector((state: any) => state.user.hdAddress);

	const handleDeposit = async () => {
		if (!amount) return alert("Enter amount");
		console.log("check check", SUPPORTED_TOKENS[chain].tokens["USDC2"].address);
		try {
			setIsLoading(true);
			if (walletClient.data == undefined) {
				console.log(
					"There is an issue with your wallet connection, please reconnect to continue!",
					"autoError"
				);
				return;
			}
			const data = await walletClient.data.writeContract({
				address: SUPPORTED_TOKENS[chain].tokens["USDC2"]
					.address as `0x${string}`,
				abi: erc20Abi,
				functionName: "transfer",
				args: [
					depositAddress,
					parseUnits(amount, SUPPORTED_TOKENS[chain].tokens["USDC2"].decimals),
				],
				// chain: arbitrumSepolia,
			});
			if (data) {
				depositTxn(
					{
						userId: address,
						toAddress: depositAddress,
						amount: amount,
						txnHash: data,
						tokenSymbol: "USDC2",
						network: SUPPORTED_TOKENS[chain].name,
					},
					{
						onSuccess: (data: any) => {
							toast.success("Deposit transaction recorded successfully!");
							console.log("Deposit transaction recorded:", data);
						},
					}
				);
			}
		} catch (error: any) {
			console.log("checking error", error);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<>
			<div className="flex items-center justify-between pt-10">
				<div>
					<h3 className="h-heading text-white text-xl">Fund Asthra</h3>
					<p className="text-sm text-gray-400 mt-1">
						Deposit stablecoins and earn funding-rate based yield.
					</p>
				</div>
				{/* <div className="text-sm text-gray-300">
					Max per user{" "}
					<span className="font-medium text-white ml-1">$1,000,000</span>
				</div> */}
			</div>
			<div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4">
				<div className="md:col-span-2">
					<label className="text-xs text-gray-400">Amount</label>
					<input
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="mt-2 w-full rounded-md p-3 bg-transparent border border-neutral-800 text-white"
					/>
					<div className="flex gap-2 mt-3">
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
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<div className="card p-3 rounded-md flex items-center justify-between">
						<div>
							<div className="text-xs text-gray-400">Asset</div>
							<div className="text-white font-medium mt-1">{asset}</div>
						</div>
						<div>
							<div className="text-xs text-gray-400">Balance</div>
							<div className="text-white font-medium mt-1">{balance}</div>
						</div>
						{/* <button className="text-sm px-3 py-1 rounded-md bg-neutral-800">
							Change
						</button> */}
					</div>
					<button
						onClick={handleDeposit}
						disabled={balance < 5 || isLoading ? true : false}
						className={
							isConnected && balance < 5
								? "bg-gray-400 rounded-md py-3 cursor-not-allowed"
								: "btn-accent rounded-md py-3"
						}
					>
						{isLoading ? "Depositing..." : "Deposit " + asset}
					</button>
					<p className="text-sm text-red-400">
						{isConnected && balance < 5
							? "Wallet doesn't have enough USDC"
							: null}
					</p>
				</div>
			</div>
		</>
	);
}
