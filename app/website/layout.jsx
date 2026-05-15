import { Kumbh_Sans } from "next/font/google";
import Footer from "@/components/application/website/footer";
import Header from "@/components/application/website/header";

const kumbh = Kumbh_Sans({
	display: "swap",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
});

export default function WebsiteLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`
          ${kumbh.className}
          min-h-screen
          bg-white
          text-black
          m-0
          p-0
        `}
			>
				<Header />

				<main>{children}</main>

				<Footer />
			</body>
		</html>
	);
}
