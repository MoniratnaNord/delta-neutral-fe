import { motion } from "framer-motion";
import { useState } from "react";
import { DepositInput } from "./DepositInput";
import { WithdrawInput } from "./WithdrawInput";

export function DepositPanel() {
	const [activeTab, setActiveTab] = useState("Deposit");

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			className="card rounded-xl p-6 mt-6"
		>
			<div className="flex items-center space-x-6 justify-start">
				<div>
					<h3
						className={`${
							activeTab === "Deposit" ? "text-white" : "text-gray-500"
						} h-heading text-2xl cursor-pointer`}
						onClick={() => setActiveTab("Deposit")}
					>
						Deposit
					</h3>
				</div>
				<div className="text-sm text-gray-300">
					<h3
						className={`${
							activeTab === "Withdraw" ? "text-white" : "text-gray-500"
						} h-heading text-2xl cursor-pointer`}
						onClick={() => setActiveTab("Withdraw")}
					>
						Withdraw
					</h3>
				</div>
			</div>

			{activeTab === "Deposit" ? <DepositInput /> : <WithdrawInput />}
		</motion.div>
	);
}
