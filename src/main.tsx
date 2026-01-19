import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initDevToolsProtection } from "./utils/devToolsProtection";

// Initialize security layer
initDevToolsProtection();

createRoot(document.getElementById("root")!).render(<App />);