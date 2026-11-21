import { Londrina_Solid, Rubik } from "next/font/google";
import localFont from "next/font/local";

export const satoshi = localFont({
  src: "../app/fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  variable: "--font-satoshi",
  display: "swap",
});

export const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik-family",
});

export const londrina = Londrina_Solid({
  subsets: ["latin"],
  weight: ["400", "900"],
  variable: "--font-londrina",
});
