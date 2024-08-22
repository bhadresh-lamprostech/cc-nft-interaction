import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import { ApolloProvider } from "@apollo/client";
import client from "../../apollo-client";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ApolloProvider client={client}>{children} </ApolloProvider>
        </Providers>
      </body>
    </html>
  );
}
