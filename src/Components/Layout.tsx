// src/Layout.jsx
import React from "react";
import { NavBar } from "./Navbar";
import { Footer } from "./Footer";

export default function Layout({ account, onConnect, onDisconnect, children }) {
	return (
		<div className="min-h-screen flex flex-col">
			<NavBar
				account={account}
				onConnect={onConnect}
				onDisconnect={onDisconnect}
			/>
			<main className="flex-grow">{children}</main>
			<Footer />
		</div>
	);
}
