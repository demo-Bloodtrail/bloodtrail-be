// // /user/check 구현 시 로그인 한 사용자의 user 정보를 응답으로 보내줌
// export const check = async (ctx) => {
//   const { user } = ctx.state;
//   if (!user) {
//     // 로그인하지 않은 상태
//     ctx.status = 401; // Unauthorized
//     return;
//   }
//   ctx.body = user;
// };
