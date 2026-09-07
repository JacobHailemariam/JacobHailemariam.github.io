#!/usr/bin/env bash
#
# Pulls the result images for the ViT and URL-shortener projects straight out
# of their own repositories, so you don't have to clone, hunt, and drag files.
#
#   ./scripts/fetch-project-assets.sh
#
# It downloads from raw.githubusercontent.com, which serves the files directly
# with no API token and no rate limit worth worrying about. If you rename a
# file in either repo, update the mapping below.
#
# After it runs, set the matching `src` values in lib/site-content.ts — the
# script tells you which ones.

set -euo pipefail

TARGET_DIR="public/images"
VIT_RAW="https://raw.githubusercontent.com/JacobHailemariam/cifar10-vision-transformer/main/assets"
API_RAW="https://raw.githubusercontent.com/JacobHailemariam/url-shortener/main/screenshots"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Run this from the project root (couldn't find $TARGET_DIR)." >&2
  exit 1
fi

# Format: "<source url>|<destination filename>"
ASSETS=(
  "$VIT_RAW/train_val_accuracy.png|vit-accuracy.png"
  "$VIT_RAW/confusion_matrix.png|vit-confusion.png"
  "$API_RAW/api-docs.png|url-shortener-docs.png"
)

for entry in "${ASSETS[@]}"; do
  url="${entry%%|*}"
  filename="${entry##*|}"
  echo "→ $filename"
  if curl --fail --silent --show-error --location "$url" -o "$TARGET_DIR/$filename"; then
    echo "  saved to $TARGET_DIR/$filename"
  else
    echo "  FAILED — check the path is still correct in the repo" >&2
  fi
done

cat <<'NEXT'

Downloaded. Now open lib/site-content.ts and set these:

  projects → "vit" → images[0].src            = "/images/vit-accuracy.png"
  projects → "vit" → images[1].src            = "/images/vit-confusion.png"
  projects → "url-shortener" → images[0].src  = "/images/url-shortener-docs.png"

Then reload. The dashed "asset pending" frames will be replaced.
NEXT
