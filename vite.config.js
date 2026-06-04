import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  cacheDir: ".vite-cache",
  server: {
    fs: {
      strict: true,
      allow: [process.cwd()],
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client", "react-router-dom", "lucide-react"],
  },
});
