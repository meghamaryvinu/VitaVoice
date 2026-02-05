
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import "./services/medicalKnowledgeBase"; // Initialize KB globally

  createRoot(document.getElementById("root")!).render(<App />);
  