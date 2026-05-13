import "./globals.css";

export const metadata = {
	description: "E-commerce platform",
	title: "E-commerce App",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
