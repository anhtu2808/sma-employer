import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store, { persistor } from "./store";
import "./index.css";
import App from "./App";
import Preloader from "./components/Preloader";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="655715793583-tsavpaijv2vm9374q2g1ml43i9heugq7.apps.googleusercontent.com">
    <Provider store={store}>
      <PersistGate loading={<Preloader />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>,
);
