import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userAddress: "",
	userBalance: 0,
	hdAddress: "",
	jwtToken: localStorage.getItem("jwtToken") || null, // Initialize from localStorage
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setAddress: (state, action) => {
			state.userAddress = action.payload;
		},
		setBalance: (state, action) => {
			state.userBalance = action.payload;
		},
		setHdAddress: (state, action) => {
			state.hdAddress = action.payload;
		},
		setJwtToken: (state, action) => {
			state.jwtToken = action.payload;
			if (action.payload) {
				localStorage.setItem("jwtToken", action.payload); // Store JWT in localStorage
			} else {
				localStorage.removeItem("jwtToken"); // Remove JWT from localStorage on logout
			}
		},
		clearUserData: (state) => {
			state.userAddress = "";
			state.userBalance = 0;
			state.hdAddress = "";
			state.jwtToken = null;
		},
	},
});

export const {
	setAddress,
	setBalance,
	setHdAddress,
	setJwtToken,
	clearUserData,
} = userSlice.actions;

export const logout = () => (dispatch: any) => {
	localStorage.removeItem("jwtToken");
	dispatch(clearUserData());
	window.location.href = "/"; // Redirect to home or login page
};
export default userSlice.reducer;
