import { Poppins, Oxanium, Public_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--poppins-font",
});

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--oxanium-font",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-public-sans",
});

export const metadata = {
  title: "Way Wise Global",
  description:
    "Way Wise Global is a diversified international group developing businesses across multiple industries and markets.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${oxanium.variable} ${publicSans.variable}`}
    >
      {/* The public Navbar and Partner With Us modal live in app/(site)/layout.js */}
      <body className="bg-black font-poppins text-white">{children}</body>
    </html>
  );
}