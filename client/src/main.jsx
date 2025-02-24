import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: "http://localhost:5173"
        }}
        audience={import.meta.env.VITE_AUTH0_AUDIENCE}
        scope={import.meta.env.VITE_AUTH0_SCOPE}
      >
        <App />
      </Auth0Provider>
    </MantineProvider>
  </React.StrictMode>
);
