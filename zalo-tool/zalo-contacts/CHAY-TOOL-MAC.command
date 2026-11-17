#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null; then
  if command -v brew >/dev/null; then brew install node
  else echo "Chưa có Node.js. Tải bản LTS tại https://nodejs.org rồi bấm đúp file này lại."; read -p "Enter để thoát"; exit 1; fi
fi
command -v openzca >/dev/null || npm i -g openzca
openzca --profile default auth status >/dev/null 2>&1 || { echo "Đăng nhập Zalo: quét QR bằng điện thoại"; (for i in 1 2 3 4 5 6 7 8 9 10; do sleep 2; [ -f qr.png ] && open qr.png && break; done) & openzca --profile default auth login; }
export ZALO_PROFILE=default
(sleep 2; open http://127.0.0.1:23388) &
node server.mjs
