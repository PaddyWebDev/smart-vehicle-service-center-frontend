import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/tanstack-query";
import { SidebarProvider } from "@/components/ui/sidebar";

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
				<SidebarProvider>
					<QueryClientProvider client={queryClient}>
						<Toaster
							position="top-right"
							reverseOrder={false}
						/>
						{children}
					</QueryClientProvider>
				</SidebarProvider>
			</body>

		</html>
	);
}
