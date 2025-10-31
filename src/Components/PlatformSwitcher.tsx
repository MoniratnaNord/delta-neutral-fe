import React from "react";

type Platform = "hyperliquid" | "lighter";

interface PlatformSwitcherProps {
	value: Platform;
	onChange: (platform: Platform) => void;
}

export function PlatformSwitcher({ value, onChange }: PlatformSwitcherProps) {
	return (
		<div className="inline-flex items-center space-x-2">
			<button
				className={`px-3 py-1 text-xs rounded border transition-colors ${
					value === "hyperliquid"
						? "bg-green-900/30 text-green-400 border-green-800/50"
						: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
				}`}
				onClick={() => onChange("hyperliquid")}
			>
				Hyperliquid
			</button>
			<button
				className={`px-3 py-1 text-xs rounded border transition-colors ${
					value === "lighter"
						? "bg-green-900/30 text-green-400 border-green-800/50"
						: "bg-[#15161b] text-gray-300 border-transparent hover:text-green-300"
				}`}
				onClick={() => onChange("lighter")}
			>
				Lighter
			</button>
		</div>
	);
}

export type { Platform };
