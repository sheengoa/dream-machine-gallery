import { defineConfig } from "vite";

// base './'：构建产物可在任意子路径 / file:// 下直接打开
export default defineConfig({
  base: "./",
  server: { port: 5173 },
  preview: { port: 4173 },
  build: {
    target: "es2022",
    assetsInlineLimit: 4096,
  },
});
