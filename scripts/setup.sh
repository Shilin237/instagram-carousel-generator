#!/usr/bin/env bash
# Setup script for Instagram Carousel Generator
set -e

echo "Setting up Instagram Carousel Generator..."

# Install dependencies
npm install

# Copy environment template
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from template. Fill in your API keys."
fi

echo "Setup complete. Run 'claude' to start."
