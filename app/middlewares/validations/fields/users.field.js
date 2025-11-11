import { body } from "express-validator";


// validator를 사용하지 않을 경우 if문으로 하나하나 다 체크해야 한다 -> 가독성 하락
// 아이디 필드
export const account = body('account') // 유저에게 받은 키 작성
  .trim()
  .notEmpty()
  .withMessage('아이디는 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9]{4,8}$/)
  .withMessage('영어 대/소문자, 숫자, 4~8 글자 허용')
;

// 비밀번호 필드
export const password = body('password') // 유저에게 받은 키 작성
  .trim()
  .notEmpty()
  .withMessage('비밀번호는 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9!@]{4,8}$/)
  .withMessage('영어 대/소문자, 숫자, 특수문자(!@) 4~8 글자 허용')
;

// 이름 필드
export const name = body('name') // 유저에게 받은 키 작성
  .trim()
  .notEmpty()
  .withMessage('이름은 필수 항목입니다.')
  .bail()
  .matches(/^[가-힣]{2,30}$/)
  .withMessage('한글 2~30글자 허용')
;