import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactGA from "react-ga4";


import {
  PersistQueryClientProvider,
  removeOldestQuery,
} from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryCache = new QueryCache({
  onError: (error) => {
    if (error instanceof Error) {
      if (error?.response?.status !== 401) {
        if (error?.response?.status === 404) {
          toast.error("Whoops! We can not find what you are looking for!");
        } else {
          toast.error(error.message);
        }
      }
    }

    console.log(error);
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
    },
  },
  queryCache,
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  retry: removeOldestQuery,
});

ReactGA.initialize("G-T9NT6GEPZJ");


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ChakraProvider>
        <App />
        <Toaster />
      </ChakraProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>
);
