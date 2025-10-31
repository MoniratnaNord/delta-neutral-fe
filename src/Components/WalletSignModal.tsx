"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signMessage } from "wagmi/actions";
import { config } from "../utils/appkit";
import useCreateUser from "../hooks/useCreateUser";
import { setHdAddress } from "../features/user";
import { useDisconnect } from "@reown/appkit/react";

export default function WalletSignModal({ isOpen, onClose, onSuccessfulSign }) {
	const dispatch = useDispatch();
	const { disconnect } = useDisconnect();
	const { mutate: createUser } = useCreateUser();
	const [agreed, setAgreed] = useState(false);
	const userAddress = useSelector((state: any) => state.user.userAddress);
	const generateNonce = () => {
		// You can use any random string generator
		return crypto.randomUUID(); // or Date.now().toString()
	};
	if (!isOpen) return null;
	const nonce = generateNonce();
	const time = new Date().getTime();
	console.log("userAddress", userAddress.toLowerCase());
	const termsAndConditions = `\nBy signing this message, I confirm that I am the owner of the wallet address ${userAddress.toLowerCase()} and authorize the execution of a Delta Neutral Strategy on my behalf.\nI understand the risks involved and consent to the execution of this strategy.\nTimestamp: ${time}\nNonce: ${nonce}\n`;
	console.log("termsAndConditions", termsAndConditions);
	const handleAgreeTerms = async () => {
		try {
			if (!userAddress) {
				// toastify("Address not found!", "autoError");
				return;
			}
			//   setIsOpenLoader(true);
			const signature = await signMessage(config, {
				account: userAddress as `0x${string}`,
				message: termsAndConditions,
			});
			console.log("signature", signature);

			if (signature == null || signature == undefined) {
				// toastify("Signature failed!", "autoError");
				console.log("signature failed");
				// setIsOpenLoader(false);
				// setTermAndConditionModal(false);
				onClose();
				// return;
			}
			createUser(
				{
					messageSigned: termsAndConditions,
					walletSignature: signature,
					walletAddress: userAddress,
				},
				{
					onSuccess: (data: any) => {
						console.log("User created:", data.data.data.address0);
						dispatch(setHdAddress(data.data.data.address0));
						localStorage.setItem(userAddress, "ReadTermAndCondition");
						onSuccessfulSign(); // Call new prop on success
					},
					onError: (error: any) => {
						console.error("Error creating user:", error);
						// toastify(error.message || "Error creating user", "autoError");
						// setIsOpenLoader(false);
						// setTermAndConditionModal(false);
						onClose();
						disconnect();
					},
				}
			);

			//   setIsOpenLoader(false);
			//   setTermAndConditionModal(false);

			onClose();
			//   router.push("/my-bets");
		} catch (error) {
			//   setIsOpenLoader(false);
			console.log(error);
			//   toastify("User rejected wallet signature process.", "autoError");
			return;
		}
	};
	return (
		<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
			<div className="bg-neutral-900 text-center rounded-2xl shadow-xl p-6 max-w-md w-full border border-neutral-700">
				{/* Title */}
				<h2 className="text-2xl font-bold text-white mb-4">
					Welcome to <span className="h-heading">Asthra!</span>
				</h2>

				{/* Message */}
				<p className="text-gray-300 mb-6 text-sm leading-relaxed">
					Approve sign-in request in your wallet to confirm you own{" "}
					<span className="text-lime-400 font-mono">{userAddress}</span>
				</p>

				{/* Checkbox */}
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

				{/* Button */}
				<button
					disabled={!agreed}
					onClick={handleAgreeTerms}
					className={`w-full py-3 rounded-xl font-semibold transition ${
						agreed
							? "btn-accent text-black hover:bg-lime-300"
							: "bg-gray-600 text-gray-400 cursor-not-allowed"
					}`}
				>
					Proceed to Sign
				</button>
			</div>
		</div>
	);
}
