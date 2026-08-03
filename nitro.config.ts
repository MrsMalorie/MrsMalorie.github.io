export default defineNitroConfig({
  preset: "static",
  prerender: {
    routes: [
      "/",
      "/class-library",
      "/resources",
      "/today",
    ],
  },
});
