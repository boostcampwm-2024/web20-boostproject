# Node.js 기본 이미지 사용
FROM node:22-alpine AS base

# pnpm 환경 설정
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 작업 디렉토리 설정
WORKDIR /app

# @nestjs/cli만 글로벌 설치
RUN npm install -g @nestjs/cli

# 모노레포 루트의 의존성 파일 복사
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Chat 앱의 package.json 파일 복사
COPY apps/chat/package.json apps/chat/

# 의존성 설치 (devDependencies 포함)
RUN pnpm install --filter=./apps/chat --prod=false

# Chat 서버의 코드 복사
COPY apps/chat ./apps/chat

# Chat 서버 빌드
RUN pnpm --filter=./apps/chat exec nest build

FROM node:22-alpine AS runner

WORKDIR /app

# 환경 변수 설정
ARG CHAT_PORT
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_CHAT
ARG JWT_SECRET

ENV CHAT_PORT=$CHAT_PORT
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT
ENV REDIS_CHAT=$REDIS_CHAT
ENV JWT_SECRET=$JWT_SECRET

COPY --from=base /app/apps/chat/dist ./apps/chat/dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/chat/node_modules ./apps/chat/node_modules

# 포트 노출
EXPOSE ${CHAT_PORT}

# 애플리케이션 실행
CMD ["node", "apps/chat/dist/main"]