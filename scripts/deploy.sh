#!/usr/bin/env bash
# Deploy the landing page to prod: build it, then publish to the folder nginx serves (/var/www/biveit.com,
# see the nginx site /etc/nginx/sites-available/biveit.com). Builds into dist/ first and only then syncs,
# so a failed build never touches the live site.
# Usage (from the repo root): scripts/deploy.sh
set -euo pipefail

# The build bakes the app/API/site URLs in from .env -- without it, the app links point at this site.
[ -f .env ] || { echo "❌ .env missing (copy .env.example and fill in the prod URLs)"; exit 1; }

npm ci
npm run build

rsync -a --delete dist/ /var/www/biveit.com/
echo "✅ Landing -> /var/www/biveit.com"
