import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import Holdings from "./pages/Holdings";
import Strategy from "./pages/Strategy";

function Referrals() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center text-gray-300">
			Referrals — invite users, earn rewards
		</div>
	);
}
function Stats() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center text-gray-300">
			Stats — analytics and charts (coming soon)
		</div>
	);
}

export default function App() {
	const [account, setAccount] = useState(null);

	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on("accountsChanged", (accounts) => {
				setAccount(accounts[0] || null);
			});
		}
		return () => {
			if (window.ethereum && window.ethereum.removeListener) {
				window.ethereum.removeListener("accountsChanged", () => {});
			}
		};
	}, []);

	const connect = async () => {
		try {
			if (!window.ethereum)
				return alert("No injected wallet found. Install MetaMask.");
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			setAccount(accounts[0]);
		} catch (e) {
			console.error(e);
			alert("Failed to connect wallet");
		}
	};

	const disconnect = () => setAccount(null);

	return (
		<Router>
			<div className="min-h-screen">
				<NavBar
					account={account}
					onConnect={connect}
					onDisconnect={disconnect}
				/>

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/referrals" element={<Referrals />} />
					<Route path="/stats" element={<Stats />} />
					<Route path="/transactions" element={<Dashboard />} />
					<Route path="/holdings" element={<Holdings />} />
					{/* <Route path="/strategy" element={<Strategy />} /> */}
				</Routes>

				<Footer />
			</div>
		</Router>
	);
}
