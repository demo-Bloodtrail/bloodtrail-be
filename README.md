﻿# 🩸 bloodtrail-be
### #헌혈 # 커뮤니티
Blood와 Trail의 합성어로 헌혈 후 이동하는 피를 보며 피의 자취(길)라는 의미를 담아 팀명을 Blood Trail로 정하게 되었습니다.

## 👨🏻‍💻 팀원 소개
|파트|이름|포지션|
|:------:|:---:|:------:|
|백엔드|정채원|서버 배포, DB 및 API 구축|
|백엔드|김지은|DB 및 API 구축|
|백엔드|남구민|DB 및 API 구축|

<br>

## 💻 Technology
<img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=flat-square&logo=Visual Studio Code&logoColor=white">  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>  <img src="https://img.shields.io/badge/Webpack-8DD6F9?style=flat-square&logo=Webpack&logoColor=black"/>

<img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white"/>  <img src="https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=Mongoose&logoColor=white"/>  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white"/>  <img src="https://img.shields.io/badge/JWT-black?style=flat-square&logo=JSON%20web%20tokens">

<img src="https://img.shields.io/badge/GithubActions-2088FF?style=flat-square&logo=GithubActions&logoColor=white">  <img src="https://img.shields.io/badge/AmazonEC2-FF9900?style=flat-square&logo=AmazonEC2&logoColor=white">  <img src="https://img.shields.io/badge/AmazonS3-569A31?style=flat-square&logo=AmazonS3&logoColor=white">  <img src="https://img.shields.io/badge/AmazonElasticBeanstalk-FF9900?style=flat-square&logo=Amazon Elastic Beanstalk&logoColor=white">

<img src="https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=Swagger&logoColor=white"> <img src="https://img.shields.io/badge/slack-4A154B?style=flat-square&logo=slack&logoColor=white"> <img src="https://img.shields.io/badge/notion-000000?style=flat-square&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/discord-5865F2?style=flat-square&logo=discord&logoColor=white">

<br>

## 💻 System Architecture
![bloodtrail 아키텍처](https://github.com/demo-Bloodtrail/bloodtrail-be/assets/97737822/46836afa-ac84-47fc-9ea6-ffa3049b0d89)

<br>

## 🔖 Rules
- ISSUE 작성 > develop에서 브랜치 분기
- develop으로만 PR 날리기 > PR 날린 후 dev action 통과 확인
- dev action 통과 확인하면 main으로 PR!
- 배포 완료되면 health 체크 확인
- env 파일 수정 후 노션으로 공유

<br>

## 🗂️ Commit Convetion

> 커밋태그(# 이슈번호) : 내용
> ex. `deploy(#2) : CI/CD 파이프라인 작성'

| command  | mean                     |
| -------- | ------------------------ |
| feat     | 기능 개발                |
| bug      | 버그 수정                |
| docs     | 문서 수정 (README.md 등) |
| deploy   | 배포 관련                |
| test     | 테스트 코드 추가         |
| refactor | 코드 리팩토링            |
| setting  | 개발 환경 셋팅           |
| chore    | 빌드, 패키지 매니저 수정 |

<br>

## 🎃 Directory Structure
```
┌── node_modules
├── src
│   ├── config // 설정 파일
│   ├── controller // API 요청 처리
│   ├── middleware // API 매개 역할
│   ├── public // css의 집합
│   ├── router // API 라우팅
│   ├── schema // 데이터베이스 스키마
└───└── view // API 테스트 뷰 (.ejs의 집합)
├── .ebextensions
├── Procfile
├── index.js
├── package.json
├── package-lock.json
└── webpack.config.js
```
