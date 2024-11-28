FROM node:22-alpine AS base

RUN apk add --no-cache ffmpeg

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

RUN mkdir -p /app/assets/records /app/assets/thumbnails && chmod -R 777 /app/assets

# Environment variables
ARG RECORD_PORT
ARG NCLOUD_ACCESS_KEY
ARG NCLOUD_SECRET_KEY
ARG NCLOUD_BUCKET_NAME

ENV RECORD_PORT=$RECORD_PORT
ENV NCLOUD_ACCESS_KEY=$NCLOUD_ACCESS_KEY
ENV NCLOUD_SECRET_KEY=$NCLOUD_SECRET_KEY
ENV NCLOUD_BUCKET_NAME=$NCLOUD_BUCKET_NAME
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