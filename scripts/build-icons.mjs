// 生成社交分享图与 favicon 的 PNG 位图（一次性工具；改了源图后重跑 node scripts/build-icons.mjs）
import sharp from "sharp";
import { readFileSync } from "node:fs";

// og 分享图：1200×630，JPEG 压缩（社交平台抓取友好，<300KB）
await sharp("docs/hero.png")
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile("public/og-image.jpg");

// favicon PNG fallback + apple-touch-icon（源：public/favicon.svg）
const svg = () => Buffer.from(readFileSync("public/favicon.svg"));
await sharp(svg(), { density: 288 }).resize(32, 32).png().toFile("public/favicon-32.png");
await sharp(svg(), { density: 288 }).resize(180, 180).png().toFile("public/apple-touch-icon.png");

console.log("✓ og-image.jpg / favicon-32.png / apple-touch-icon.png 已生成");
