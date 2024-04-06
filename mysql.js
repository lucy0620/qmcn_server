// -------------------------------数据库 begin -------------------------------
// 1.引入数据库模块
// const { connections } = require('mongoose')
const mysql = require('mysql')
// 2.创建连接池
// 这个用户可以自己去工作台创建新的哈，我用的是安装的时候就创建的root
// 端口号用的是安装的时候默认的3306
const pool = mysql.createPool({
  // host: '120.79.39.145',
  // port: 3306,
  // user: 'lucy',
  // password: 'qqq123',
  // database: 'qmcn',
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'qqq123',
  database: 'qmcn_local',//qmcn_local只是本地工作台的项目命名，数据库名为进入项目后左侧列表显示库名qmcn_local
  dateStrings: true
})

pool.on('connection', (connection) => {

})
pool.on('enqueue', (connection) => {

})

// 3.封装sql方法
module.exports.query = (sql, params, cb) => {
  if (typeof cb == "function") {
    // 获取连接
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('连接mysql失败')
        conn.release();
        cb(err);
      } else {
        conn.query(sql, params, (error, rows) => {
          conn.release();
          console.log('执行sql语句失败')
          cb(error, rows)
        });
      }
    });
  } else {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log('连接mysql失败')
          conn.release();
          reject(err);
        } else {
          conn.query(sql, params, (error, rows) => {
            conn.release();
            if (error) {
              console.log(sql)
              reject(error);
            } else {
              resolve(rows);
            }
          });
        }
      })
    })
  }
}

// -------------------------------数据库 end -------------------------------