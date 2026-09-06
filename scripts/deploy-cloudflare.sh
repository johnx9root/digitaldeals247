#!/usr/bin/env bash
# Deploy DigitalDeals24/7 to Cloudflare Workers (run in a normal system terminal)
set -euo pipefail
export PATH="${HOME}/.nvm/versions/node/v22.23.1/bin:${PATH:-}"
cd "$(dirname "$0")/.."

echo "==> Node: $(node -v)"
echo "==> Checking Cloudflare login..."
if ! npx wrangler whoami 2>/dev/null | grep -qiE 'logged in|email|Account'; then
  echo "Not logged in. Opening browser login..."
  npx wrangler login
fi

echo "==> Building OpenNext + deploying..."
npm run deploy

echo "==> Done. Your public URL should look like:"
echo "    https://digitaldeals247.<subdomain>.workers.dev"
