import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useCheckUserSign = () => {
	const [hasSignedAndLoggedIn, setHasSignedAndLoggedIn] = useState(false);
	const userAddress = useSelector((state: any) => state.user.userAddress);

	useEffect(() => {
		if (userAddress) {
			const initialSignedStatus = localStorage.getItem(userAddress);
			const loggedInStatus = localStorage.getItem(userAddress + "_LoggedIn");
			const jwtToken = localStorage.getItem("jwtToken"); // Check for JWT token in local storage

			setHasSignedAndLoggedIn(
				initialSignedStatus === "ReadTermAndCondition" &&
					loggedInStatus === "true" &&
					!!jwtToken // Ensure JWT token is present
			);
		}
	}, [userAddress]);

	return hasSignedAndLoggedIn;
};

export default useCheckUserSign;
