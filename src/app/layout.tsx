import type { Metadata } from "next";
import { Recursive } from 'next/font/google'
import "./globals.css";
import Navbar from "@/components/shared/navbar";
import AppProvider from "../../context/app-state";
import WalletLayout from "../../context/wallet-layout";
const recursive = Recursive({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: "liquidinvest Staking Platform",
  description: "LiquidInvest Staking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
       <main className='flex grainy-light flex-col'>
        <AppProvider>
<WalletLayout>

          {/* <Navbar /> */}
         <div className="h-full bg-bgApp bg-cover  min-h-screen">
         {children}
         </div>
</WalletLayout>
        </AppProvider>

       </main>
      </body>
    </html>
  );
}
