import { Instrument_Sans, Public_Sans } from "next/font/google";

export const instrumentSans = Instrument_Sans({
    subsets: ["latin"],
    weight: ["500", "600"],
    variable: "--font-display",
    display: "swap",
});

export const publicSans = Public_Sans({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-sans",
    display: "swap",
});