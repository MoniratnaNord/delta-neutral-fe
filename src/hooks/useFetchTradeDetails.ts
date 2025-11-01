/// <reference types="vite/client" />
"use client";
import { useQuery } from "@tanstack/react-query";
import useCheckUserSign from "./useCheckUserSign";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/appkit";

const useFetchTradeDetails = (userId: string) => {
	const hasSignedAndLoggedIn = useCheckUserSign();
	const jwtToken = useSelector((state: any) => state.user.jwtToken); // Move useSelector here
	return useQuery({
		queryKey: ["fetch-trade-details", userId, jwtToken],
		queryFn: () => getTradeDetails(userId, jwtToken), // Pass jwtToken to getAccountInfo
		// staleTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: hasSignedAndLoggedIn && !!userId && !!jwtToken,
	});
};

const getTradeDetails = async (userId: string, jwtToken: string) => {
	try {
		const response = await fetchWithAuth(
			`${import.meta.env.VITE_BACKEND_URL}/user/${userId}/fetch-trade-details`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				},
			}
		);

		const res_data = await response.json();
		return { data: res_data };
	} catch (error: any) {
		console.error("Fetch trade details failed:", error);
		throw new Error(error);
	}
};

export default useFetchTradeDetails;
