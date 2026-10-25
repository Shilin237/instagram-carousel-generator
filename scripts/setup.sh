#!/usr/bin/env bash
# Setup script for Instagram Carousel Generator
set -e

echo "Setting up Instagram Carousel Generator..."

# Install dependencies
npm ci
npm run build

# Copy environment template
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from template. Fill in your API keys."
fi

echo "Setup complete. Run 'npm run dev' and open http://localhost:3200."
