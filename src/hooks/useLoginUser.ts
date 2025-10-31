/// <reference types="vite/client" />
import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "../utils/appkit";

const useLoginUser = () => {
	return useMutation({
		mutationFn: async ({
			messageSigned,
			walletSignature,
			walletAddress,
		}: any) => {
			return loginUser(messageSigned, walletSignature, walletAddress);
		},
	});
};

const loginUser = async (
	messageSigned: string,
	walletSignature: string,
	walletAddress: string
) => {
	try {
		const response = await fetchWithAuth(
			`${import.meta.env.VITE_BACKEND_URL}/user/login`,
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
		console.log("Login API response:", response);

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Login API error data:", errorData);
			throw new Error(errorData.message || "Unknown Error");
		}
		const res_data = await response.json();
		console.log("Login API response data:", res_data);
		return { data: res_data };
	} catch (error: any) {
		console.error("Login failed:", error);
		throw new Error(error);
	}
};

export default useLoginUser;
