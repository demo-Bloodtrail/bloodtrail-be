# bloodtrail-be

# 🖤bloodtrail-be🖤

bloodtrail backend repository

## 1️⃣ Rules

- ISSUE 작성 > develop에서 브랜치 분기
- develop으로만 PR 날리기 > PR 날린 후 dev action 통과 확인
- dev action 통과 확인하면 main으로 PR!
- 배포 완료되면 health 체크 확인
- env 파일 수정 후 카톡으로 공유

## 2️⃣ Commit Message Convention

> 커밋태그(# 이슈번호) : 내용
> ex. `feat(#2) : CI/CD 파이프라인 작성'

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
