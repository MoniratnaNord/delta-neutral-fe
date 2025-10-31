import { useAppKitAccount } from "@reown/appkit/react";
import { ActivityList } from "../Components/ActivityList";
import { DepositPanel } from "../Components/DepositPanel";
import { StatCards } from "../Components/StatCards";
import { use, useEffect, useState } from "react";
import WalletSignModal from "../Components/WalletSignModal";
import useFetchDepositAddress from "../hooks/useFetchDepositAddress";
import { useDispatch } from "react-redux";
import { setHdAddress } from "../features/user";
import LoginSignModal from "../Components/loginSignModal";
import { GraphOverview } from "../Components/GraphOverview";

export function Home() {
	const dispatch = useDispatch();
	const { address, isConnected } = useAppKitAccount();
	// const address = "0x85290Ee672292528376adc10ef1Ff6f4Dbb29bDF";
	// const isConnected = true;

	const [termAndConditionModal, setTermAndConditionModal] = useState(false);
	const [isLoginModal, setIsLoginModal] = useState(false);
	const [checkTerms, isCheckTerms] = useState(false);
	const [isOpenLoader, setIsOpenLoader] = useState<boolean>(false);
	const [loginSuccess, setLoginSuccess] = useState(false);
	const {
		data: depositAddress,
		refetch,
		isLoading,
	} = useFetchDepositAddress(address || "");
	useEffect(() => {
		if (depositAddress) {
			console.log("setting address", depositAddress.address);
			dispatch(setHdAddress(depositAddress.address));
		}
	}, [isConnected, depositAddress]);

	useEffect(() => {
		if (isConnected && address) {
			try {
				const termlocalCheck = localStorage.getItem(address);
				if (!termlocalCheck) {
					setTermAndConditionModal(true); // Show terms modal
				}
			} catch (error) {
				console.error("Error accessing localStorage:", error);
			}
			const termlocalCheck = localStorage.getItem(address);
			const isLoggedIn = localStorage.getItem(address + "_LoggedIn"); // Corrected to use userAddress_LoggedIn
			if (!isLoggedIn && termlocalCheck) {
				setIsLoginModal(true); // Show login modal
			}
		} else if (!isConnected) {
		}
		// localStorage.setItem(address + "_LoggedIn", "true"); // Set login status
		// localStorage.setItem("jwtToken", "khgjkhgjhjgv");
		// localStorage.setItem(address, "ReadTermAndCondition");
		// dispatch(setHdAddress(address));
	}, [address, isConnected]); // Added isConnected to dependency array

	const handleWalletSignSuccess = () => {
		setTermAndConditionModal(false);
		setIsLoginModal(true);
	};
	useEffect(() => {
		if (loginSuccess) {
			refetch();
		}
	}, [loginSuccess]);
	return (
		<main className="max-w-7xl mx-auto px-6 py-8">
			<StatCards />
			<div className="grid grid-cols-2">
				<div>
					<GraphOverview />
				</div>
				<div>
					<DepositPanel />
				</div>
			</div>

			<WalletSignModal
				isOpen={termAndConditionModal}
				onClose={() => setTermAndConditionModal(false)}
				onSuccessfulSign={handleWalletSignSuccess}
			/>
			<LoginSignModal
				isOpen={isLoginModal}
				onClose={() => setIsLoginModal(false)}
				setLoginSuccess={setLoginSuccess}
			/>
		</main>
	);
}
