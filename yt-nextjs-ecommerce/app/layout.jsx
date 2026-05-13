import "./globals.css";
import { Toaster } from "react-hot-toast";
import GlobalStoreProvider from "@/components/application/GlobalStoreProvider";

export const metadata = {
	description: "E-commerce platform",
	title: "E-commerce App",
};

export default function RootLayout({ children }) {
	return (
		<html className="font-sans" lang="en" suppressHydrationWarning>
			<body>
				<GlobalStoreProvider>
					{children}
					<Toaster
						position="top-right"
						toastOptions={{
							duration: 3000,
							style: {
								background: "#fff",
								color: "#333",
							},
						}}
					/>
				</GlobalStoreProvider>
			</body>
		</html>
	);
}
