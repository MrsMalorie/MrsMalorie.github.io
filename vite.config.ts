import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

import tailwindcss from "@tailwindcss/vite";
import { solidStart } from "@solidjs/start/config";

const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [
    solidStart(),
    tailwindcss(),
  ]
});
