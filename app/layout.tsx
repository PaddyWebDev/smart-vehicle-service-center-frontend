import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/tanstack-query";

export const metadata: Metadata = {
	title: "Vehicle Service",
	description: "created using nextjs",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" >
			<body className="font-sans" suppressHydrationWarning>
				<QueryClientProvider client={queryClient}>
					<Toaster
						position="top-right"
						reverseOrder={false}
					/>
					{children}
				</QueryClientProvider>
			</body>

		</html>
	);
}
