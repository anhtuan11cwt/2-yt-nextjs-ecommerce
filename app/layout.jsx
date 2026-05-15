import GlobalProvider from "@/components/providers/GlobalProvider";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "react-hot-toast";
import GlobalStoreProvider from "@/components/application/GlobalStoreProvider";

export const metadata = {
	description: "E-commerce platform",
	title: "E-commerce App",
};

// Root layout chứa Redux Provider, React Query Provider và Toaster
export default function RootLayout({ children }) {
	return (
		<html className="font-sans" lang="en" suppressHydrationWarning>
			<body>
				<GlobalStoreProvider>
					<GlobalProvider>
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
					</GlobalProvider>
				</GlobalStoreProvider>
			</body>
		</html>
	);
}
