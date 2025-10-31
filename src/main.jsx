import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppKitProvider } from "./utils/appkit";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Toaster richColors />
			<Provider store={store}>
				<AppKitProvider>
					<App />
				</AppKitProvider>
			</Provider>
		</QueryClientProvider>
	</React.StrictMode>
);
