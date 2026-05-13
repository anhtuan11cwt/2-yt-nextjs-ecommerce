const WebsiteLayout = ({ children }) => {
	return (
		<div>
			<header className="border-b p-4">
				<h2 className="text-xl font-bold">Website Layout</h2>
			</header>

			<main className="p-5">{children}</main>
		</div>
	);
};

export default WebsiteLayout;
