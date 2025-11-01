export const SUPPORTED_TOKENS = {
	42161: {
		name: "arbitrum",
		chain_id: 42161,
		rpc_url: `https://arb-mainnet.g.alchemy.com/v2/${
			import.meta.env.VITE_ALCHEMY_RPC_API_KEY
		}`,
		native_symbol: "ETH",
		tokens: {
			USDC: {
				address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
				decimals: 6,
				spender: "0x2df1c51e09aecf9cacb7bc98cb1742757f163df7",
			},
		},
	},
	// only for development
	// 421614: {
	// 	name: "arbitrum_sepolia",
	// 	chain_id: 421614,
	// 	rpc_url: `https://arb-sepolia.g.alchemy.com/v2/${
	// 		import.meta.env.VITE_ALCHEMY_RPC_API_KEY
	// 	}`,
	// 	native_symbol: "ETH",
	// 	tokens: {
	// 		USDC: {
	// 			address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
	// 			decimals: 6,
	// 			version: "2",
	// 		},
	// 		USDC2: {
	// 			address: "0x1baAbB04529D43a73232B713C0FE471f7c7334d5",
	// 			decimals: 6,
	// 			version: "1",
	// 			spender: "0x08cfc1B6b2dCF36A1480b99353A354AA8AC56f89",
	// 		},
	// 	},
	// },
};
