/// <reference types="vite/client" />
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "../utils/appkit";

const useCreateUser = () => {
	return useMutation({
		mutationFn: async ({
			messageSigned,
			walletSignature,
			walletAddress,
		}: any) => {
			return createUser(messageSigned, walletSignature, walletAddress);
		},
	});
};

const createUser = async (
	messageSigned: string,
	walletSignature: string,
	walletAddress: string
) => {
	try {
		const response = await fetchWithAuth(
			`${import.meta.env.VITE_BACKEND_URL}/user/create`,
			{
				method: "POST",
				body: JSON.stringify({
					messageSigned: messageSigned,
					walletSignature: walletSignature,
					walletAddress: walletAddress,
				}),
				headers: {
					"Content-Type": "application/json",
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
export default useCreateUser;
