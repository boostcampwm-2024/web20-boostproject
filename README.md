<div align="center">
    <img src="https://github.com/user-attachments/assets/b3d9e371-82a9-4423-9104-0ffcf322ae3a">
    <h2></h2>
    <img src="https://github.com/user-attachments/assets/5dbc8d2a-8819-43bf-9d5e-9fd9237c971d">
    <br />
    <h3>
      <a href='https://intelligent-broker-ff0.notion.site/Cam-on-1290201238ac808ebb56d75e07685ae4'>📒 팀 노션</a> | 
      <a href='https://github.com/boostcampwm-2024/web20-camon/wiki'>🔎 위키</a> | 
      <a href='https://www.figma.com/design/ckY510YXPKJJUoURVxlmYz/Cam'on?node-id=0-1&node-type=canvas&t=BIq7ck3oUBLHea8J-0'>🎨 피그마</a> | 
      <a href='https://github.com/orgs/boostcampwm-2024/projects/85'on?node-id=0-1&node-type=canvas&t=BIq7ck3oUBLHea8J-0'>🗓️ 백로그</a>
    </h3>
    <h4>
      <a href='https://cam-on.site'>👉 camon 서비스 바로가기 👈</a> 
    </h4>
    <br>
    <p>
        <b>Cam’ON</b>은 캠퍼들이 네트워킹과 출석 관리를 한 번에 할 수 있는 실시간 스트리밍 기반 플랫폼입니다.<br>
        방송 송출, 녹화, 채팅 등 다양한 기능으로 새로운 온라인 학습 환경을 경험할 수 있습니다.<br>
        </p>
<!--     <h3>👩‍💻 누가 사용하면 좋을까요?</h3>
    <div>출석을 체계적으로 관리하고 싶은 캠퍼 🙋‍♂️</div>
    <div>학습 경험을 공유하고 싶은 캠퍼 🙋‍♀️</div>
    <div>온라인에서 동료와 소통하고 싶은 캠퍼 🌐</div> -->
<br>
</div>
<br/>

# 🎯 핵심 기능
### 🎥 실시간 방송
> 1️⃣ 캠퍼들은 코어타임 시간에 실시간 방송을 키면서 부스트 캠프 활동에 참여할 수 있습니다.<br>
> 2️⃣ 화면공유 on/off, 캠 on/off, 마이크 on/off 기능으로  캠퍼들이 보다 자유로운 방송을 할 수 있도록 돕습니다.<br>
> 3️⃣ 별도의 송출 소프트웨어 없이 서비스 내에서 방송 송출과 화면 배치 과정이 자동으로 이루어져 캠퍼들이 부담없이 방송할 수 있는 환경을 제공합니다.
> 4️⃣ 캠퍼들은 서로의 방송을 시청하면서 실시간으로 서로의 학습 경험을 공유할 수 있습니다.

![화면 송출 데모](https://github.com/user-attachments/assets/aaf18b1f-9192-4c3e-8059-0d9c0603184d)
![방송 시청 데모](https://github.com/user-attachments/assets/c63cd77a-cc14-49e4-b3ed-36bc6ec26582)

### 💬 채팅
> 1️⃣ 캠퍼들은 채팅을 통해 실시간으로 소통할 수 있습니다.<br>
> 2️⃣ 방송 송출창과 시청창 모두 채팅 기능을 제공하여 방송중인 캠퍼와 시청하는 캠퍼 모두 자유롭게 지식을 공유하고 유대감을 쌓을 수 있습니다.<br>

### 🔴 녹화
> 1️⃣ 실시간 녹화 기능을 제공하여 코어타임 학습 중 기억하고 싶은 순간을 기록할 수 있습니다.<br>
> 2️⃣ 방송 중 기록한 녹화본들은 출석 내역에서 확인하며 스스로의 학습 경험을 돌아볼 수 있습니다.<br>

![녹화 데모](https://github.com/user-attachments/assets/905fa5b5-3531-4dbc-b92d-1dcf94d5fcc9)

### ✏️ 출석
> 1️⃣ 캠퍼는 마이페이지에서 본인의 출석 내역을 한 눈에 확인할 수 있습니다.<br>
> 2️⃣ 코어타임 시간 내에 송출되는 방송 시간을 기반으로 자동으로 캠퍼들의 출석이 관리됩니다.<br>

![출석 데모](https://github.com/user-attachments/assets/63adc867-a159-4bb4-a7f2-fea5edd892ab)

### 📚 아카이브
> 1️⃣ 캠퍼들은 메인페이지에서 여러개로 나누어진 베이스캠프를 한 번에 모아서 관리할 수 있습니다.<br>
> 2️⃣ 자유롭게 하이퍼링크를 등록하여 맞춤형 온라인 베이스 캠프를 구성할 수 있습니다.<br>

![아카이브 데모](https://github.com/user-attachments/assets/dafcd2ca-df14-4720-8f54-0ae4eb90be50)

# 💻 핵심 개발 일지
### 💡 **방송 송출 및 시청 구현**  
- WebRTC와 Mediasoup을 활용해 실시간 송출 및 시청 환경을 구축  
- 브라우저에서 간편하게 방송을 시작하고 종료할 수 있도록 UI/UX 개선  
  - [방송 송출 및 시청 구현](https://github.com/boostcampwm-2024/web20-camon/wiki/%EB%B0%A9%EC%86%A1-%EC%86%A1%EC%B6%9C-%EB%B0%8F-%EC%8B%9C%EC%B2%AD-%EA%B5%AC%ED%98%84)

### 💡 **Canvas Api를 사용한 방송 송출 화면 구성**  
- Canvas API를 활용해 방송 화면을 실시간으로 커스터마이징
- 두 개의 스트림을 합친 Canvas를 캡처한 스트림을 송출하는 방식<br>
  - [Canvas Api를 사용한 방송 송출 화면 구성](https://github.com/boostcampwm-2024/web20-camon/wiki/Canvas-Api%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%9C-%EB%B0%A9%EC%86%A1-%EC%86%A1%EC%B6%9C-%ED%99%94%EB%A9%B4-%EA%B5%AC%EC%84%B1)

### 💡 **화질 조정 기능 구현**  
- WebRTC 스트림의 화질을 상황에 따라 조정하여 최적의 사용자 경험을 제공  
- 해상도, 비트레이트, 프레임레이트를 유동적으로 설정해 화질 변경   
  - [화질 조정 기능 구현](https://github.com/boostcampwm-2024/web20-camon/wiki/%ED%99%94%EC%A7%88-%EC%A1%B0%EC%A0%95-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84)

### 💡 **실시간 썸네일과 녹화 기능 구현**  
- Mediasoup과 FFmpeg을 활용하여 실시간 스트리밍 중 썸네일을 생성하고, 녹화본을 저장  
- 녹화된 자료는 Object Storage에 저장하고, 스트리밍 종료 후에도 확인 가능  
  - [실시간 썸네일과 녹화 기능 구현](https://github.com/boostcampwm-2024/web20-camon/wiki/%EC%8B%A4%EC%8B%9C%EA%B0%84-%EC%8D%B8%EB%84%A4%EC%9D%BC%EA%B3%BC-%EB%85%B9%ED%99%94-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84)
 
> 🙇‍♀️ 프로젝트의 **핵심 개발 일지**에 대한 더 자세한 사항은 [핵심 개발 일지 한 눈에 보기](https://github.com/boostcampwm-2024/web20-camon/wiki)와 [위키](https://github.com/boostcampwm-2024/web20-camon/wiki)을 참고해 주세요!

<br>

# 🚨 트러블 슈팅

### ❓ Mediasoup 포트 매핑 문제
- **문제**: Mediasoup의 포트가 올바르게 매핑되지 않아 스트림 연결이 실패
- **해결**: ACG와 Docker Compose 설정에서 포트를 명시적으로 매핑하여 문제 해결  
  - [mediasoup 포트 매핑 문제](https://github.com/boostcampwm-2024/web20-camon/wiki/Mediasoup-%ED%8F%AC%ED%8A%B8-%EB%A7%A4%ED%95%91-%EB%AC%B8%EC%A0%9C)

### ❓ Chrome 자동 재생 문제
- **문제**: Chrome의 정책상 음소거되지 않은 영상은 사용자 상호작용(클릭, 탭 등)이 없으면 자동으로 재생되지 않음
- **해결**: muted 속성을 사용해 초기에 음소거 상태로 비디오를 자동 재생하고, 사용자에게 음소거 해제 버튼을 제공하여 수동으로 소리를 켤 수 있도록 구현.   
  - [Chrome 자동 재생이 안되는 문제](https://github.com/boostcampwm-2024/web20-camon/wiki/Chrome-%EC%9E%90%EB%8F%99-%EC%9E%AC%EC%83%9D%EC%9D%B4-%EC%95%88%EB%90%98%EB%8A%94-%EB%AC%B8%EC%A0%9C)

### ❓ Git Action에서 도커 이미지 빌드 시간 단축
- **문제**: GitHub Actions에서 Docker 이미지를 빌드하는 데 시간이 과도하게 소요됨
- **해결**: BuildKit을 활성화하고 type=gha로 Docker 레이어 캐시를 저장 및 재사용하여 빌드 시간 단축  
  - [Git action에서 도커 이미지 빌드 시간을 단축시켜보자](https://github.com/boostcampwm-2024/web20-camon/wiki/Git-action%EC%97%90%EC%84%9C-%EB%8F%84%EC%BB%A4-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B9%8C%EB%93%9C-%EC%8B%9C%EA%B0%84%EC%9D%84-%EB%8B%A8%EC%B6%95%EC%8B%9C%EC%BC%9C%EB%B3%B4%EC%9E%90)

> 🙇‍♀️ 프로젝트의 **트러블 슈팅**에 대한 더 자세한 사항은 [트러블 슈팅 한 눈에 보기](https://github.com/boostcampwm-2024/web20-camon/wiki)와 [위키](https://github.com/boostcampwm-2024/web20-camon/wiki)을 참고해 주세요!

<br>

# 🧐 고민
### 🔍 Release 브랜치? 너 필요해?
- **고민 이유**: ~~~
- **결론**: ~~~
  - [Release 브랜치? 너 필요해?](https://github.com/boostcampwm-2024/web20-camon/wiki/Release-%EB%B8%8C%EB%9E%9C%EC%B9%98%3F-%EB%84%88-%ED%95%84%EC%9A%94%ED%95%B4%3F)
 
### 🔍 실시간 채팅 구현: 인메모리 방식을 선택한 이유
- **고민 이유**: ~~~
- **결론**: ~~~
  - [실시간 채팅 구현: 인메모리 방식을 선택한 이유]([https://github.com/boostcampwm-2024/web20-camon/wiki/Release-%EB%B8%8C%EB%9E%9C%EC%B9%98%3F-%EB%84%88-%ED%95%84%EC%9A%94%ED%95%B4%3F](https://github.com/boostcampwm-2024/web20-camon/wiki/%EC%8B%A4%EC%8B%9C%EA%B0%84-%EC%B1%84%ED%8C%85-%EA%B5%AC%ED%98%84%3A-%EC%9D%B8%EB%A9%94%EB%AA%A8%EB%A6%AC-%EB%B0%A9%EC%8B%9D%EC%9D%84-%EC%84%A0%ED%83%9D%ED%95%9C-%EC%9D%B4%EC%9C%A0))

> 🙇‍♀️ 프로젝트의 **고민**에 대한 더 자세한 사항은 [고민 한 눈에 보기](https://github.com/boostcampwm-2024/web20-camon/wiki)와 [위키](https://github.com/boostcampwm-2024/web20-camon/wiki)을 참고해 주세요!

<br>

## 🙇‍♀️ 프로젝트의 전반적인 상황이 궁금하시다면, [위키](https://github.com/boostcampwm-2024/web20-camon/wiki)와 [팀 노션](https://intelligent-broker-ff0.notion.site/Cam-on-1290201238ac808ebb56d75e07685ae4)을 참고해 주세요!

<br>

# ⚙️ 전체 서비스 아키텍쳐
> 저희 서비스의 전반적인 흐름도를 확인 할 수 있습니다.

![image](https://github.com/user-attachments/assets/f35da73a-0cc6-4aa1-b0aa-36094ffeb87e)

# 🏗️ 시스템 아키텍처
> 저희 서비스의 인프라 구축 환경을 한 눈에 보실 수 있습니다.

<img width="1352" alt="image" src="https://github.com/user-attachments/assets/e8e1eef7-4c3e-46e6-bdae-91934bcc4237">

# 🛠️ 기술 스택

| 분야 | 기술 스택 |
|:---|:---|
| 공통       | ![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220) ![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![TypeScript](https://img.shields.io/badge/mediasoup-895fde?style=for-the-badge&logoColor=white)                                                                                                                                          |
| FE | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| BE     | ![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![Express](https://img.shields.io/badge/express-000000?style=for-the-badge&logo=FFmpeg&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=FFmpeg&logoColor=white)                                      |
| 인프라   |  ![GitHub Actions](https://img.shields.io/badge/Ncloud-03C75A?style=for-the-badge&logo=naver&logoColor=white) ![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![NginX](https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/githubactions-FF4438?style=for-the-badge&logo=githubactions&logoColor=white)                 |

# 👨‍👩‍👧‍👦 팀원 소개
| 김광현| 백지연 | 전희선 | 한승헌 |
|:---:|:---:|:---:|:---:|
| <img src="https://github.com/g00hyun.png" width="150" height="150"> | <img src="https://github.com/zero0205.png" width="150" height="150"> | <img src="https://github.com/huiseon37.png" width="150" height="150"> | <img src="https://github.com/seungheon123.png" width="150" height="150"> |
| [@g00hyun](https://github.com/g00hyun) | [@zero0205](https://github.com/zero0205) | [@huiseon37](https://github.com/huiseon37) | [@seungheon123](https://github.com/seungheon123) |
| BE | FE | BE | BE |
