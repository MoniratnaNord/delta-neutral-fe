import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import {
	mainnet,
	polygon,
	arbitrum,
	base,
	arbitrumSepolia,
} from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import React from "react";
import { logout } from "../features/user";
import { store } from "../store/store";

const queryClient = new QueryClient();

// 1) Put your real Project ID from https://dashboard.reown.com
const projectId = "fbe01716742ad041fb0161a939b37f3d";

// 2) Optional app metadata (shows inside the modal)
const metadata = {
	name: "My Dapp",
	description: "My Dapp using Reown AppKit",
	url:
		typeof window !== "undefined"
			? window.location.origin
			: "http://localhost:5173",
	icons: ["https://avatars.githubusercontent.com/u/179229932"], // any 64x64+ icon URL
};

// 3) Choose the EVM networks you need
const networks: any = [arbitrum];

// 4) Create Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
	networks,
	projectId,
	ssr: false,
});
export const config = wagmiAdapter.wagmiConfig;
// 5) Create the AppKit modal (run once, outside React trees)
createAppKit({
	adapters: [wagmiAdapter],
	networks,
	projectId,
	metadata,
	features: {
		analytics: true, // optional
		socials: [],
		email: false,
	},
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
	return (
		<WagmiProvider config={wagmiAdapter.wagmiConfig}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}

export const fetchWithAuth = async (url: string, options?: RequestInit) => {
	const jwtToken = store.getState().user.jwtToken; // Get JWT from Redux store
	const address = store.getState().user.userAddress;
	const headers = {
		...(options?.headers || {}),
		"Content-Type": "application/json",
		...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
	};

	const response = await fetch(url, { ...options, headers });

	if (response.status === 401) {
		const errorData = await response.json();
		if (
			errorData.message &&
			errorData.message.includes("Invalid or expired token")
		) {
			// Clear login status but don't set isDisconnecting flag
			// This way, if wallet is still connected, Home.tsx will show login modal
			localStorage.removeItem(address + "_LoggedIn");
			localStorage.removeItem("jwtToken");
			store.dispatch(logout());
		} else {
			throw new Error(errorData.message || "Unauthorized");
		}
	}

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Unknown Error");
	}

	return response;
};
