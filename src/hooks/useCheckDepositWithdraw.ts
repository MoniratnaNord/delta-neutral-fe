/// <reference types="vite/client" />
"use client";
import { useQuery } from "@tanstack/react-query";
import useCheckUserSign from "./useCheckUserSign";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/appkit";

const useCheckDepositWithdraw = (userId: string) => {
	const hasSignedAndLoggedIn = useCheckUserSign();
	const jwtToken = useSelector((state: any) => state.user.jwtToken); // Move useSelector here
	return useQuery({
		queryKey: ["check-deposit-withdraw"],
		queryFn: () => checkDepositWithdraw(userId, jwtToken), // Pass jwtToken to getDepositAddress
		// staleTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: hasSignedAndLoggedIn && !!userId && !!jwtToken,
	});
};

const checkDepositWithdraw = async (userId: string, jwtToken: string) => {
	try {
		const response = await fetchWithAuth(
			`${
				import.meta.env.VITE_BACKEND_URL
			}/user/${userId}/check-deposit-withdraw`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				},
			}
		);
		console.log("checking status", response);

		const res_data = await response.json();
		return { data: res_data.data };
	} catch (error: any) {
		console.error("Fetch thread list failed:", error);
		throw new Error(error);
	}
};

export default useCheckDepositWithdraw;
