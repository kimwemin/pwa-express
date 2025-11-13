import express from 'express';
// import pool from '../db/my-db.js';
import db from '../app/models/index.js'
const { sequelize, Employee } = db;

const usersRouter = express.Router();

usersRouter.get('/', (request, response, next) => {
  response.status(200).send('전체 유저 정보 조회 완료')
});

usersRouter.get('/:id', async (request, response, next) => {
  try {
    // 파라미터 체크 후 params는 문자이기에 형변환
    // sql 인젝션의 위험이 있어 유저가 보낸 값을 그대로 사용하는 경우는 거의 없다
    // `emp_id = '' OR 1=1` 같은 공격 구문 사용 시 where절이 무력화 되며 전체 정보를 가져옴
    const id = parseInt(request.params.id);

    // --------------------
    // Sequelize로 DB 연동
    // --------------------
    const result = await Employee.findByPk(id);
    return response.status(200).send(result);


    // --------------------
    // mysql2로 DB 연동
    // --------------------
    // // 쿼리 작성
    // const sql = `
    // SELECT *
    // FROM employees
    // WHERE
    // emp_id = ?
    // `;
    
    // 아래 두가지만 지켜져도 sql 인젝션을 방지할 수 있다
    // validation : 유저가 보낸 값을 검증
    // Prepared Statement : 유저가 보낸 것과 쿼리문을 분리

    // Prepared Statement(execute)를 활용해 간단하게 sql 인젝션을 방지
    // const [result] = await pool.execute(sql, [id]);

    // return response.status(200).send(result)
  } catch(error) {
    next(error);
  }
});

usersRouter.put('/:id', (request, response, next) => {
  response.status(200).send('유저 정보 수정 완료')
});

usersRouter.delete('/:id', (request, response, next) => {
  response.status(200).send('유저 정보 삭제 완료')
});

export default usersRouter;