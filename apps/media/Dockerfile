# Node.js 기본 이미지 사용
FROM node:22-alpine AS base

# pnpm 환경 설정
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Python과 빌드 도구 설치
RUN apk add --no-cache python3 py3-pip build-base linux-headers libgcc libstdc++

# 작업 디렉토리 설정
WORKDIR /app

# @nestjs/cli 글로벌 설치
RUN npm install -g @nestjs/cli

# 모노레포 루트의 의존성 파일 복사
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Media 앱의 package.json 파일 복사
COPY apps/media/package.json apps/media/

# 의존성 설치 (devDependencies 포함)
RUN pnpm install --filter=./apps/media --prod=false

# Media 서버의 코드 복사
COPY apps/media ./apps/media

# Media 서버 빌드
RUN pnpm --filter=./apps/media exec nest build

FROM node:22-alpine AS runner

WORKDIR /app

# 환경 변수 설정
ARG MEDIA_PORT
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_MEDIA
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG ANNOUNCED_IP
ARG API_SERVER_URL
ARG HTTP_TIMEOUT

ENV MEDIA_PORT=$MEDIA_PORT
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT
ENV REDIS_MEDIA=$REDIS_MEDIA
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV ANNOUNCED_IP=$ANNOUNCED_IP
ENV API_SERVER_URL=$API_SERVER_URL
ENV HTTP_TIMEOUT=$HTTP_TIMEOUT

# Media 서버 빌드 결과물 복사
COPY --from=base /app/apps/media/dist ./apps/media/dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/media/node_modules ./apps/media/node_modules

# 포트 노출
EXPOSE $MEDIA_PORT

# 애플리케이션 실행
CMD ["node", "apps/media/dist/main"]