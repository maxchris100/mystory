# --- Stage 1: Builder ---
FROM node:20-slim AS builder
WORKDIR /app

# Install OS deps needed for build
RUN apt-get update && apt-get install -y \
    python3 g++ make git && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# --- Stage 2: Minimal Runner ---
FROM node:20-slim AS runner
WORKDIR /app

# Copy built standalone app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Optional: if you need custom env
# ENV PORT=3000

EXPOSE 3000
CMD ["node", "server.js"]
