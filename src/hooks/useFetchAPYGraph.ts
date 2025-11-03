/// <reference types="vite/client" />
"use client";
import { useQuery } from "@tanstack/react-query";
import useCheckUserSign from "./useCheckUserSign";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/appkit";

const useFetchAPYGraph = (userId: string, days: number, enabled: boolean) => {
	const hasSignedAndLoggedIn = useCheckUserSign();
	const jwtToken = useSelector((state: any) => state.user.jwtToken); // Move useSelector here
	return useQuery({
		queryKey: ["use-fetch-apy-graph", userId, days, jwtToken],
		queryFn: () => get_fetch_apy_graph(userId, days, jwtToken), // Pass jwtToken to getDepositAddress
		// staleTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: enabled && hasSignedAndLoggedIn && !!userId && !!jwtToken,
	});
};

const get_fetch_apy_graph = async (
	userId: string,
	days: number,
	jwtToken: string
) => {
	try {
		const response = await fetchWithAuth(
			`${
				import.meta.env.VITE_BACKEND_URL
			}/user/${userId}/fetch-apy-graph?days=${days}`,
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

export default useFetchAPYGraph;
