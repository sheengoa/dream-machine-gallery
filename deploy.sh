#!/usr/bin/env bash
# 造梦机器® — 一键部署：构建 + 同步到服务器 + 线上验证
# 用法：./deploy.sh          构建并同步 dist/
#       ./deploy.sh --full   额外同步整个仓库源码（不含 node_modules / .git）
set -euo pipefail

HOST="45.207.222.131"
PORT="60433"
REMOTE_DIR="project/dream-machine-gallery"
URL="https://shiqing.cc/"

cd "$(dirname "$0")"

echo "==> 构建"
npm run build

echo "==> 同步 dist/ → ${HOST}:${REMOTE_DIR}/dist/"
rsync -az --delete -e "ssh -p ${PORT}" dist/ "${HOST}:${REMOTE_DIR}/dist/"

if [ "${1:-}" = "--full" ]; then
  echo "==> 同步仓库源码（--full）"
  rsync -az --exclude node_modules --exclude .git --exclude dist \
        -e "ssh -p ${PORT}" ./ "${HOST}:${REMOTE_DIR}/"
fi

echo "==> 线上验证"
sleep 1
code=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$code" = "200" ]; then
  echo "✅ 部署成功：${URL}"
else
  echo "⚠️  线上返回 HTTP ${code}，请手动检查 ${URL}"
  exit 1
fi
