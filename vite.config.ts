import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { solidStart } from "@solidjs/start/config";

const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [
    solidStart({
      ssr: false,
      server: {
        preset: "static",
      },
    }),
    tailwindcss(),
  ]
});
