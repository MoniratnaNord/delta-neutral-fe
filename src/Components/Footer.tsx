export function Footer() {
	return (
		<footer className="border-t-2 border-transparent/8 pt-8 pb-8 text-sm text-gray-400 w-full">
			<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-6">
				<div>
					<div className="h-heading text-white text-lg">Asthra</div>
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
