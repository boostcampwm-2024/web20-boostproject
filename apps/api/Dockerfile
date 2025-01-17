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

# 환경 변수 설정
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG GH_CLIENT_ID
ARG GH_SECRET
ARG GH_CALLBACK_URL
ARG JWT_SECRET
ARG GG_CLIENT_ID
ARG GG_SECRET
ARG GG_CALLBACK_URL
ARG CALLBACK_URI

ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV GH_CLIENT_ID=$GH_CLIENT_ID
ENV GH_SECRET=$GH_SECRET
ENV GH_CALLBACK_URL=$GH_CALLBACK_URL
ENV JWT_SECRET=$JWT_SECRET
ENV GG_CLIENT_ID=$GG_CLIENT_ID
ENV GG_SECRET=$GG_SECRET
ENV GG_CALLBACK_URL=$GG_CALLBACK_URL
ENV CALLBACK_URI=$CALLBACK_URI

# 모노레포 루트의 의존성 파일 복사
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# API 앱의 package.json 파일 복사
COPY apps/api/package.json apps/api/

# 의존성 설치 (devDependencies 포함)
RUN pnpm install --filter=./apps/api --prod=false

# API 서버의 코드 복사
COPY apps/api ./apps/api

# API 서버 빌드
RUN pnpm --filter=./apps/api exec nest build

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "apps/api/dist/main"]