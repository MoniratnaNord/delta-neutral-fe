/// <reference types="vite/client" />
"use client";
import { useQuery } from "@tanstack/react-query";
import useCheckUserSign from "./useCheckUserSign";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/appkit";

const useGetBridgeIn = (userId: string, page: number) => {
	const hasSignedAndLoggedIn = useCheckUserSign();
	const jwtToken = useSelector((state: any) => state.user.jwtToken); // Move useSelector here
	return useQuery({
		queryKey: ["fetch-bridge-ins"],
		queryFn: () => getBridgeIn(userId, page, jwtToken), // Pass jwtToken to getBridgeIn
		// staleTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: hasSignedAndLoggedIn && !!userId && !!jwtToken,
	});
};

const getBridgeIn = async (userId: string, page: number, jwtToken: string) => {
	try {
		const response = await fetchWithAuth(
			`${
				import.meta.env.VITE_BACKEND_URL
			}/user/${userId}/get-bridge-in?page=${page}&page_size=10`,
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
		console.error("Fetch bridge in failed:", error);
		throw new Error(error);
	}
};

export default useGetBridgeIn;
