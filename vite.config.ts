import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Served from the domain root locally. The GitHub Pages workflow sets BASE_PATH to "/<repo-name>/".
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: { outDir: "dist", sourcemap: false },
});
