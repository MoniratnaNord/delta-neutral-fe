/// <reference types="vite/client" />
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import useCheckUserSign from "./useCheckUserSign";
import { fetchWithAuth } from "../utils/appkit";

const useDepositTxn = () => {
	const hasSignedAndLoggedIn = useCheckUserSign();
	const jwtToken = useSelector((state: any) => state.user.jwtToken); // Move useSelector here
	return useMutation({
		mutationFn: async ({
			userId,
			toAddress,
			amount,
			txnHash,
			tokenSymbol,
			network,
		}: any) => {
			return depositTxn(
				userId,
				toAddress,
				amount,
				txnHash,
				tokenSymbol,
				network,
				jwtToken // Pass jwtToken to depositTxn
			);
		},
	});
};

const depositTxn = async (
	user_id: string,
	to_address: string,
	amount: string,
	txn_hash: string,
	token_symbol: string,
	network: string,
	jwtToken: string
) => {
	try {
		const response = await fetchWithAuth(
			`${import.meta.env.VITE_BACKEND_URL}/user/${user_id}/deposit-to-hdwallet`,
			{
				method: "POST",
				body: JSON.stringify({
					user_id: user_id,
					to_address: to_address,
					amount: amount,
					txn_hash: txn_hash,
					token_symbol: token_symbol,
					network: network,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				},
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Unknown Error");
		}
		const res_data = await response.json();
		return { data: res_data };
	} catch (error: any) {
		console.error("Fetch thread list failed:", error);
		throw new Error(error);
	}
};
export default useDepositTxn;
