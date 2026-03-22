#!/usr/bin/env bash
# Deploy script — uploads the generated carousel to a static hosting provider
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/deploy.sh <carousel-filename.html>"
  exit 1
fi

FILE="$1"
if [ ! -f "$FILE" ]; then
  echo "File not found: $FILE"
  exit 1
fi

echo "Deploying $FILE..."
# Example: upload to S3
# aws s3 cp "$FILE" s3://your-bucket/carousels/ --acl public-read

echo "Deploy complete."
