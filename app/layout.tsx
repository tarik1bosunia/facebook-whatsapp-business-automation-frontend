import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers as ReduxProvider } from "../lib/redux/provider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Setup from "@/features/utils/Setup";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

 
export const metadata: Metadata = {
  title: {
    template: '%s | Facebook Business Automation',
    default: 'Facebook Business Automation',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;


}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
            {/* <Setup /> */}
            {children}
            <ToastContainer />
        </ReduxProvider>

      </body>
    </html>
  );
}
