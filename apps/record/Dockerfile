FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Environment variables
ARG RECORD_PORT

ENV RECORD_PORT=$RECORD_PORT

# Copy dependency files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/record/package.json apps/record/

# Install dependencies
RUN pnpm install --filter=./apps/record --prod=false

# Copy source code
COPY apps/record ./apps/record

# Build
RUN pnpm --filter=./apps/record run build

EXPOSE ${RECORD_PORT}

CMD ["node", "apps/record/dist/index.js"]