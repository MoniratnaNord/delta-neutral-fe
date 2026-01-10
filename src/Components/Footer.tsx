export function Footer() {
	return (
		<footer className="border-t-2 border-transparent/8 pt-8 pb-8 text-sm text-gray-400 w-full">
			<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-6">
				<div>
					<div className="h-heading text-white text-lg">
						<svg
							width="160"
							height="40"
							viewBox="0 0 320 80"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g transform="translate(0,5)">
								<path
									d="M40 5 L70 65 L55 65 L48 50 H32 L25 65 H10 L40 5 Z"
									fill="#FFC300"
								/>

								<path d="M40 22 L47 38 H33 L40 22 Z" fill="#0E172A" />

								<ellipse
									cx="40"
									cy="40"
									rx="38"
									ry="14"
									transform="rotate(-20 40 40)"
									stroke="#FFC300"
									strokeWidth="6"
									fill="none"
								/>
							</g>

							<text
								x="95"
								y="55"
								fontSize="42"
								fontWeight="600"
								letterSpacing="1"
								fill="#FFC300"
								fontFamily="Inter, system-ui, -apple-system, sans-serif"
							>
								asthra
							</text>
						</svg>
					</div>
					{/* <div className="text-xs text-gray-400 mt-2">
						Built with care. Inspired by ideas — not copied.
					</div> */}
				</div>

				{/* <div className="flex gap-8 text-gray-300">
					<div>
						<div className="font-medium text-white">Platform</div>
						<div className="text-xs mt-2">
							Dashboard
							<br />
							Stats
							<br />
							Referrals
						</div>
					</div>
				</div> */}
			</div>
		</footer>
	);
}
