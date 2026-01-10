import React, { useEffect } from "react";
import {
	useAppKit,
	useAppKitAccount,
	useAppKitBalance,
	useAppKitConnection,
	useAppKitNetwork,
	useAppKitProvider,
	useDisconnect,
} from "@reown/appkit/react";
import { FiMenu, FiZap } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
	clearUserData,
	setAddress,
	setBalance,
	setHdAddress,
} from "../features/user";
import { createPublicClient, formatUnits, getContract, http } from "viem";
import { arbitrum, arbitrumSepolia, mainnet } from "viem/chains";
import { erc20Abi } from "../abis/erc20abi";
import useGetHdAddress from "../hooks/useGetHdAddress";

export function NavBar({ account, onConnect, onDisconnect }) {
	const dispatch = useDispatch();
	const balance = useSelector((state: any) => state.user.userBalance);
	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();
	// const address = "0x85290Ee672292528376adc10ef1Ff6f4Dbb29bDF";
	// const isConnected = true;
	const { caipNetwork, chainId } = useAppKitNetwork();
	const { fetchBalance } = useAppKitBalance();
	const { disconnect } = useDisconnect();
	const { walletProvider } = useAppKitProvider("eip155");
	const { data: hdAddressData, isLoading: addressLoading } = useGetHdAddress(
		address || ""
	);
	useEffect(() => {
		if (!isConnected || !walletProvider || !address) return;

		const fetchBalance = async () => {
			const client = createPublicClient({
				chain: arbitrum, // 🔑 you can swap this with polygon, arbitrum, etc. based on chainId
				transport: http(),
			});

			const contract = getContract({
				address: "0x1baAbB04529D43a73232B713C0FE471f7c7334d5",
				abi: erc20Abi,
				client,
			});

			const [rawBal, decimals, symbol]: any = await Promise.all([
				contract.read.balanceOf([address]),
				contract.read.decimals(),
				contract.read.symbol(),
			]);

			dispatch(setBalance(formatUnits(rawBal, decimals)));
		};

		fetchBalance();
	}, [isConnected, walletProvider, address, chainId]);
	const imageUrl = caipNetwork?.assets?.imageId
		? `https://explorer-api.walletconnect.com/v3/logo/${caipNetwork.assets.imageId}`
		: null;

	useEffect(() => {
		if (isConnected) {
			dispatch(setAddress(address));
			dispatch(setHdAddress(hdAddressData?.data.data.address));
		}
	}, [address, isConnected]);
	const shorten = (addr = "") =>
		addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
	return (
		<header className="max-w-full border-b border-transparent/10">
			<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
				<div className="flex items-center gap-4">
					{/* <div className="p-2 rounded-md bg-gradient-to-tr from-accent-500 to-accent-400 shadow-lg">
						<div className="w-8 h-8 rounded flex items-center justify-center text-black font-bold">
							N
						</div>
					</div>
					<div className="flex flex-col">
						<div className="h-heading text-white text-lg">Asthra</div>
						
					</div> */}
					<svg
						width="160"
						height="40"
						viewBox="0 0 320 80"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g transform="translate(0,5)">
							<path
								d="M40 5 L70 65 L55 65 L48 50 H32 L25 65 H10 L40 5 Z"
								fill="#FFC300"
							/>

							<path d="M40 22 L47 38 H33 L40 22 Z" fill="#0E172A" />

							<ellipse
								cx="40"
								cy="40"
								rx="38"
								ry="14"
								transform="rotate(-20 40 40)"
								stroke="#FFC300"
								strokeWidth="6"
								fill="none"
							/>
						</g>

						<text
							x="95"
							y="55"
							fontSize="42"
							fontWeight="600"
							letterSpacing="1"
							fill="#FFC300"
							fontFamily="Inter, system-ui, -apple-system, sans-serif"
						>
							asthra
						</text>
					</svg>
				</div>

				<nav className="hidden md:flex items-center gap-4 text-sm">
					<NavLink
						to="/"
						className={({ isActive }) =>
							isActive ? "text-white font-medium" : "text-gray-400"
						}
					>
						Dashboard
					</NavLink>
					<NavLink
						to="/transactions"
						className={({ isActive }) =>
							isActive ? "text-white font-medium" : "text-gray-400"
						}
					>
						Transactions
					</NavLink>
					<NavLink
						to="/holdings"
						className={({ isActive }) =>
							isActive ? "text-white font-medium" : "text-gray-400"
						}
					>
						Holdings
					</NavLink>
					{/* <NavLink
						to="/strategy"
						className={({ isActive }) =>
							isActive ? "text-white font-medium" : "text-gray-400"
						}
					>
						Strategy
					</NavLink> */}
					{/* <NavLink
						to="/referrals"
						className={({ isActive }) =>
							isActive ? "text-white font-medium" : "text-gray-300"
						}
					>
						Referrals
					</NavLink>
					<NavLink
						to="/stats"
						className={({ isActive }) =>
							isActive ? "text-white font-medium" : "text-gray-300"
						}
					>
						Stats
					</NavLink> */}
				</nav>

				<div className="flex items-center gap-3">
					{/* <div className="hidden md:flex items-center text-sm text-gray-300 gap-2 p-2 rounded-md card">
						<FiZap />
						<div className="text-xs">
							APY: <span className="font-semibold text-white ml-1">9.8%</span>
						</div>
					</div> */}

					{!isConnected ? (
						<button
							// onClick={onConnect}
							onClick={() => open({ view: "Connect", namespace: "eip155" })}
							className="px-4 py-2 rounded-md bg-[#ffc300] text-black shadow-sm"
						>
							{/* <appkit-button /> */}
							Connect Wallet
						</button>
					) : (
						<div className="flex items-center gap-3">
							<div className="text-sm text-gray-200 card px-3 py-2 rounded-md">
								{shorten(address!)}
							</div>
							<button
								onClick={() => {
									// Set a flag to indicate we're disconnecting
									localStorage.setItem("isDisconnecting", "true");
									disconnect();
									localStorage.removeItem(address + "_LoggedIn");
									localStorage.removeItem("jwtToken");
									dispatch(clearUserData());
									window.location.href = "/";
								}}
								className="px-3 py-1 rounded-md bg-[#ffc300] text-black text-sm"
							>
								Disconnect
							</button>
						</div>
					)}

					<button className="md:hidden p-2 rounded-md card">
						<FiMenu />
					</button>
				</div>
			</div>
		</header>
	);
}
