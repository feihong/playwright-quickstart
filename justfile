help:
  just --list

install:
  bun install
  # Install playwright browsers
  bunx playwright install
