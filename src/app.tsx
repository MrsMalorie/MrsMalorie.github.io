import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./globals.css";

export default function App() {
  return (
    <Router base={import.meta.env.BASE_URL}>
      <FileRoutes />
    </Router>
  );
}
