import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";

const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [
    solidStart(),
    nitro(),
    tailwindcss(),
  ],
  nitro: {
    static: true, // full static-site generation, no server needed
    prerender: {
      crawlLinks: true, // crawl from "/" and prerender every linked route
      routes: ["/"],    // starting point for the crawl
      failOnError: true,
    },
  },
});
