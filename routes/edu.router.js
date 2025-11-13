import express from 'express';
import db from '../app/models/index.js';
import { Op } from 'sequelize';
import dayjs from 'dayjs';
const { sequelize, Employee } = db;

const eduRouter = express.Router();

eduRouter.get('/api/edu', async (request, response, next) => {
  try {
    const fireDate = request.query.date;

    let result = null;

    // ------------------------
    // 평문으로 실행하고 싶을 경우
    // ORM을 사용할 때 복잡한 쿼리문이 아니라면 아래처럼 평문으로 작성하는 경우는 잘 없다
    // 유저가 보내온 값을 쿼리문에 직접적으로 넣을 시 sql 인젝션 공격에 취약하기에
    // ?를 사용해 나중에 값을 넣겠다고 설정한 뒤
    // const sql = `SELECT * FROM employees WHERE fire_at >= ?`;
    // result = await sequelize.query(
    //   sql,
    //   { // replacements에 ?가 많을 경우 넣을 값을 순서대로 적는다
    //     replacements: [fireDate],
    //     type: Sequelize.QueryTypes.SELECT
    //   }
    // );
    
    // ------------------------
    // Model 메소드
    // ------------------------
    // findAll(options) : 조건에 맞는 모든 레코드 전체 조회(조건 설정 가능)
    // 전제 자체가 여러개의 레코드를 가져오는 것이기 때문에 배열 형태의 결과값이 온다
    // SELECT emp_id, name, birth FROM employees WHERE emp_id BETWEEN 50 AND 100 AND deleted_at IS NULL;
    // result = await Employee.findAll({
    //   attributes: ['empId', 'name', 'birth'], // 조회할 컬럼 지정(SELECT절)
    //   where: {
    //     empId: {
    //       // emp_id 가 100 보다 작거나 같다
    //       // [Op.lte]: 100
    //       // emp_id 가 50~100인 사원들
    //       [Op.between]: [50, 100]
    //     }
    //   }
    // });

    // ------------------
    // findOne(options) : 조건에 맞는 첫번째 레코드 조회
    // 전제 자체가 한개의 레코드를 가져오는 것이기에 오브젝트 형태의 결과값이 온다
    // result = await Employee.findOne({
    //   attributes: ['empId', 'name', 'birth'], // 조회할 컬럼 지정(SELECT절)
    //   where: {
    //     empId: {
    //       [Op.between]: [50, 100]
    //     }
    //   }
    // });

    // ------------------
    // findByPk(id, options) : PK 기준 단일 레코드 조회
    // result = await Employee.findByPk(50000, {
    //   attributes: ['emp_id', 'name'],
    // });

    // ------------------
    // count(options), sum(field, options), max(field, options), min(field, options), avg(field, options)
    // 위 속성들이 그룹핑을 하는 것은 아니다
    // SELECT COUNT(*) FROM employees WHERE deleted_at IS NULL;
    // soft delete 설정을 켜놨기 때문에 자동으로 deleted_at IS NULL이 들어간 값이 나온다
    // result = await Employee.count({
    //   // 만약 soft delete 설정에 상관 없이 모든 값을 가져오고 싶다면 아래처럼 paranoid(soft delete 관리 속성) 설정을 끈다
    //   paranoid: false,
    // });
    // result = await Employee.max('empId');

    // ------------------
    // create(values, options) : 새 레코드 생성
    // result = await Employee.create({
    //   name: '테스트',
    //   birth: '2000-01-01',
    //   gender: 'F',
    //   hireAt: dayjs().format('YYYY-MM-DD'),
    // });

    // ------------------
    // update(values, options) : 기존 레코드 수정(영향받은 레코드 수 반환)
    // UPDATE employees SET name = "사자" WHERE emp_id >= 100011;
    // result = await Employee.update(
    //   {
    //   name: '사자'
    //   }
    //   ,{
    //     where: {
    //       empId: {
    //         [Op.gte]: 100011
    //       }
    //     }
    //   }
    // );

    // ------------------
    // save() : 모델 인스턴스를 기반으로 레코드 생성 및 수정
    // 레코드 수정
    // const employee = await Employee.findByPk(100011);
    // employee.name = '둘리';
    // employee.birth = '1900-12-12';
    // result = await employee.save();

    // save()를 이용한 새로운 데이터 생성
    // const employee = await Employee.build(); // 빈 모델 객체 인스턴스
    // employee.name = '또치';
    // employee.birth = '1980-01-01';
    // employee.gender = 'F';
    // employee.hireAt = dayjs().format('YYYY-MM-DD');
    // result = await employee.save();

    // ------------------
    // destroy(options) : 조건에 맞는 레코드 삭제
    // 현재 soft delete가 true로 되어 있기에 물리적 삭제가 아닌 논리적 삭제만 이루어진다
    // result = await Employee.destroy({
    //   where: {
    //     empId: 100012
    //   },
    //   // force: true // 모델에 `paranoid = true`일 경우에도, 물리적 삭제를 위한 옵션
    // });

    // -------------------
    // restore(options) : Soft Delete 된 레코드를 복원
    // result = await Employee.restore({
    //   where: {
    //     empId: 100012
    //   }
    // });

    // -------------------
    // 이름이 '강가람'이고, 성별이 여자인 사원 정보 조회
    // result = await Employee.findAll({
    //   attributes: ['empId', 'name', 'gender'],
    //   where: {
    //     name: '강가람',
    //     gender: 'F',
    //   }
    // });

    // 이름이 '강가람' 또는 '신서연'인 사원 조회
    // result = await Employee.findAll({
    //   attributes: ['empId', 'name', 'gender'],
    //   where: {
    //     [Op.or]: [
    //       { name: '강가람' },
    //       { name: '신서연' }
    //     ],
    //   }
    // });

    // 성별이 여자이고, 이름이 '강가람' 또는 '신서연'인 사원
    // result = await Employee.findAll({
    //   attributes: ['empId', 'name', 'gender'],
    //   where: {
    //     gender: 'F',
    //     [Op.or]: [
    //       { name: '강가람' },
    //       { name: '신서연' },
    //     ]
    //   }
    // });

    // -------------------
    // result = await Employee.findAll({
    //   where: {
    //     // empId: {
    //     //   // 1~100까지
    //     //   // [Op.between]: [1, 100]
    //     //   // 1~100까지를 제외하고
    //     //   // [Op.notBetween]: [1, 100]
    //     //   // 1, 2, 3번 중에
    //     //   [Op.in]: [1, 2, 3]
    //     //   // 1, 2, 3번을 제외하고
    //     //   // [Op.notIn]: [1, 2, 3]
    //     // },
    //     name: {
    //       // 대소문자 구분
    //       [Op.like]: '%가람'
    //       // 대소문자 무시
    //       // [Op.iLike]: '%가람'
    //     },
    //     fireAt: {
    //       // null 조건
    //       [Op.is]: null
    //       // [Op.not]: null
    //     }
    //   }
    // });

    // -------------------
    // result = await Employee.findAll({
    //   where: {
    //     empId: {
    //       [Op.gte]: 10000
    //     }
    //   },
    //   order: [
    //     ['name', 'ASC'],
    //     ['birth', 'DESC'],
    //   ],
    //   limit: 10,
    //   offset: 10,
    // });

    // -------------------
    // groupby, having
    result = await Employee.findAll({
      attributes: [
        'gender',
        [sequelize.fn('COUNT', sequelize.col('*')), 'cnt_gender']
      ],
      group: ['gender'],
      // literal : 작성한 내용을 그대로 쿼리문으로 쓰겠다는 함수
      having: sequelize.literal('cnt_gender >= 40000'),
    });

    return response.status(200).send({
      msg: '정상 처리',
      data: result
    });
  } catch(error) {
    next(error);
  }
});

export default eduRouter;