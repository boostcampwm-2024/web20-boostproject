# Node.js 기본 이미지 사용
FROM node:22-alpine AS base

# pnpm 환경 설정
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 작업 디렉토리 설정
WORKDIR /app

# @nestjs/cli 글로벌 설치
RUN npm install -g @nestjs/cli

# 환경 변수 설정
ARG MEDIA_PORT
# ARG REDIS_HOST
# ARG REDIS_PORT
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG BASTION_HOST
ARG BASTION_USERNAME
ARG BASTION_PRIVATE_KEY
ARG DB_DATABASE
ARG DB_SYNC

ENV MEDIA_PORT=$MEDIA_PORT
# ENV REDIS_HOST=$REDIS_HOST
# ENV REDIS_PORT=$REDIS_PORT
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV BASTION_HOST=$BASTION_HOST
ENV BASTION_USERNAME=$BASTION_USERNAME
ENV BASTION_PRIVATE_KEY=$BASTION_PRIVATE_KEY
ENV DB_DATABASE=$DB_DATABASE
ENV DB_SYNC=$DB_SYNC

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

# 포트 노출
EXPOSE $MEDIA_PORT

# 애플리케이션 실행
CMD ["node", "apps/media/dist/main"]