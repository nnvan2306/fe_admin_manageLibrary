import ReactDOM from "react-dom/client";
import App from "./systems/App";
import { BrowserRouter } from "react-router-dom";
import "./globalStyle/globalStyle.css";
import "./globalStyle/custom.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./app/store";
import "./globalStyle/preview_markdown.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </BrowserRouter>
);
