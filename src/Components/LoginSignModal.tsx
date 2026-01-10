"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signMessage } from "wagmi/actions";
import { config } from "../utils/appkit";
import useLoginUser from "../hooks/useLoginUser"; // Import the new hook
import { setJwtToken } from "../features/user"; // Assuming this action exists or will be created
import { handleApiError } from "../utils/errorHandling";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useDisconnect } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

interface LoginSignModalProps {
	isOpen: boolean;
	onClose: () => void;
	setLoginSuccess: any;
}

const LoginSignModal: React.FC<LoginSignModalProps> = ({
	isOpen,
	onClose,
	setLoginSuccess,
}) => {
	const [agreed, setAgreed] = useState(false);
	const dispatch = useDispatch();
	const { address: userAddress } = useAccount();
	const { disconnect } = useDisconnect();
	const { mutate: loginUser } = useLoginUser();
	const queryClient = useQueryClient();

	const generateNonce = () => {
		return crypto.randomUUID();
	};

	if (!isOpen) return null;

	const nonce = generateNonce();
	const time = new Date().getTime();
	const loginMessage = `\nBy signing this message, I confirm that I am the owner of the wallet address ${userAddress?.toLowerCase()} and can access all the apis.\nTimestamp: ${time}\nNonce: ${nonce}\n`;
	const handleAgreeTerms = async () => {
		try {
			if (!userAddress) {
				return;
			}

			const signature = await signMessage(config, {
				account: userAddress as `0x${string}`,
				message: loginMessage,
			});
			if (!signature) {
				onClose();
				return;
			}

			loginUser(
				{
					messageSigned: loginMessage,
					walletSignature: signature,
					walletAddress: userAddress,
				},
				{
					onSuccess: (data: any) => {
						console.log("Login successful:", data.data.data.jwt_token);
						dispatch(setJwtToken(data.data.data.jwt_token)); // Dispatch action to store JWT
						localStorage.setItem(userAddress + "_LoggedIn", "true"); // Set login status
						localStorage.setItem("jwtToken", data.data.data.jwt_token);
						// Invalidate all queries so Home/Dashboard hooks refetch with new auth
						queryClient.invalidateQueries();
						setLoginSuccess(true);
						onClose();
					},
					onError: (error: any) => {
						console.error("Error during login:", error);
						// handleApiError(error, dispatch, disconnect);
						if (error.message === "invalid or expired token") {
							toast.error("Session expired. Please login again.");
							// dispatch(logoutUser());
							disconnect();
						}
						onClose();
					},
				}
			);
		} catch (error: any) {
			console.error("Signing or login process failed:", error);
			toast.error("Signing or login process failed.");
			onClose();
		}
	};
	return (
		<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
			<div className="bg-neutral-900 text-center rounded-2xl shadow-xl p-6 max-w-md w-full border border-neutral-700">
				<h2 className="text-2xl font-bold text-white mb-4">
					Login to <span className="h-heading">Asthra!</span>
				</h2>
				<p className="text-gray-300 mb-6 text-sm leading-relaxed">
					Approve sign-in request in your wallet to confirm you own{" "}
					<span className="text-lime-400 font-mono">{userAddress}</span>
					and get access to all the features.
				</p>
				<label className="flex items-start gap-2 text-gray-300 text-sm mb-6 cursor-pointer">
					<input
						type="checkbox"
						checked={agreed}
						onChange={() => setAgreed(!agreed)}
						className="mt-1 accent-lime-400"
					/>
					<span>
						I have read and agree to the{" "}
						<a href="#" className="text-lime-400 underline">
							Terms & Conditions
						</a>{" "}
						and{" "}
						<a href="#" className="text-lime-400 underline">
							Privacy Policy
						</a>{" "}
						.
					</span>
				</label>
				<button
					disabled={!agreed}
					onClick={handleAgreeTerms}
					className={`w-full py-3 rounded-xl font-semibold transition ${
						agreed
							? "bg-[#ffc300] text-black hover:bg-lime-300"
							: "bg-gray-600 text-gray-400 cursor-not-allowed"
					}`}
				>
					Proceed to Sign
				</button>
			</div>
		</div>
	);
};

export default LoginSignModal;
