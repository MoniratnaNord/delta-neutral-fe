/// <reference types="vite/client" />
"use client";
import { useQuery } from "@tanstack/react-query";
import useCheckUserSign from "./useCheckUserSign";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/appkit";

const useFetchPnlData = (userId: string) => {
	const hasSignedAndLoggedIn = useCheckUserSign();
	const jwtToken = useSelector((state: any) => state.user.jwtToken); // Move useSelector here
	return useQuery({
		queryKey: ["fetch-pnl-details", userId, jwtToken],
		queryFn: () => getPnl(userId, jwtToken), // Pass jwtToken to getAccountInfo
		// staleTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: hasSignedAndLoggedIn && !!userId && !!jwtToken,
	});
};

const getPnl = async (userId: string, jwtToken: string) => {
	try {
		const response = await fetchWithAuth(
			`${import.meta.env.VITE_BACKEND_URL}/user/${userId}/calculate-pnl`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				},
			}
		);

		const res_data = await response.json();
		return { data: res_data.data };
	} catch (error: any) {
		console.error("Fetch trade details failed:", error);
		throw new Error(error);
	}
};

export default useFetchPnlData;
