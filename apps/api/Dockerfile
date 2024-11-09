# Node.js 기본 이미지 사용
FROM node:22-alpine

# 환경 변수 설정
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME

ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME

# pnpm 글로벌 설치
RUN npm install -g pnpm

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 모노레포 루트의 의존성 파일 복사 및 설치
COPY package*.json ./
RUN pnpm install

# API 서버의 코드만 복사
COPY . .

# API 서버 빌드
#RUN pnpm run build
RUN pnpm install --frozen-lockfile --prod=false

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "dist/main"]