/// <reference types="vite/client" />
"use client";
import { useQuery } from "@tanstack/react-query";
import useCheckUserSign from "./useCheckUserSign";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/appkit";

const useGetHdAddress = (userId: string) => {
	const hasSignedAndLoggedIn = useCheckUserSign();
	const jwtToken = useSelector((state: any) => state.user.jwtToken); // Move useSelector here
	return useQuery({
		queryKey: ["fetch-hd-address"],
		queryFn: () => getHdAddress(userId, jwtToken), // Pass jwtToken to getHdAddress
		// staleTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: hasSignedAndLoggedIn && !!userId,
	});
};

const getHdAddress = async (userId: string, jwtToken: string) => {
	try {
		const response = await fetchWithAuth(
			`${import.meta.env.VITE_BACKEND_URL}/user/${userId}/address`,
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
		console.error("Fetch thread list failed:", error);
		throw new Error(error);
	}
};

export default useGetHdAddress;
