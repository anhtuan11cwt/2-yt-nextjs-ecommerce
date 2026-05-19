import { Kumbh_Sans } from "next/font/google";
import WebsiteShell from "@/components/application/WebsiteShell";
import GlobalProvider from "@/components/providers/GlobalProvider";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "react-hot-toast";
import GlobalStoreProvider from "@/components/application/GlobalStoreProvider";

const kumbh = Kumbh_Sans({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  description: "E-commerce platform",
  title: "E-commerce App",
};

// Layout gốc — font, Redux, providers, shell website
export default function RootLayout({ children }) {
  return (
    <html
      className={`${kumbh.className} font-sans`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white text-black m-0 p-0">
        <GlobalStoreProvider>
          <GlobalProvider>
            <WebsiteShell>{children}</WebsiteShell>
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
