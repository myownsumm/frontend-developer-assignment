import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Provider } from "jotai";
import "./index.css";
import App from "./components/App";

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Provider>
        <App />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
