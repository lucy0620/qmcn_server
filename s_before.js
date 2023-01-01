// import * as commen from './commen.js' //js文件不可以這樣引用
const commen = require('./commen')
const express = require('express');
const https = require('https') // 請求別人的鏈接的
const app = express();
const fd = require('formidable');
const fs = require("fs");
const bp = require('body-parser');
const db = require('./mysql');// 把db单独放在一个js文件
app.use(bp.urlencoded({
  extended: false
}));
const cors = require('cors');
const { resolve } = require('path');
const { rejects } = require('assert');
const { resolveSoa } = require('dns');
app.use(cors());
app.all('*', function (mes, res, next) {
  res.setHeader('Access-Control-Allow-Origin',
    'http://localhost:63342')
  next();
})
app.use(express.static('./'));
app.listen(7890, function () {
  console.log('服务器开启监听，7890...')
})
const host = 'https://www.lucy0612.asia'

/************************* 上传图片 Begin *************************/
app.post('/upload', function (mes, res) {
  let uploadObj = new fd.IncomingForm();
  uploadObj.parse(mes, function (e, fields, files) {
    let fileInfos = files.file;
    let filename = fileInfos.name;
    var index = filename.lastIndexOf('\.');
    filename = filename.substring(index + 1, filename.length);
    let tempPath = fileInfos.path;
    let readS = fs.createReadStream(tempPath);
    let rand = Math.floor(Math.random() * 100);
    let targetPath = './upload/' + commen.thisTimenum() + rand + '.' + filename;
    let writeS = fs.createWriteStream(targetPath); //写入路径中
    readS.pipe(writeS);
    console.log('缓存成功:', commen.thisTimenum() + rand + '.' + filename);
    res.json({
      data: host + '/upload/' + commen.thisTimenum() + rand + '.' + filename
    });
  })
})
/************************* 用户 Begin *************************/
app.get('/getUserInfo', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query) // 若是post请求，则用body
  User.getUserInfo(mes, resp, next)
})
app.get('/refresh_get_UserInfo', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  User.refresh_get_UserInfo(mes, resp, next)
})

/************************* 书籍 Begin *************************/
app.get('/getBooks_new', async function (mes, resp, next) {
  console.log('path:', mes.path)
  Book.getBooks_new(mes, resp, next)
})
app.get('/getBooks', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Book.getBooks(mes, resp, next)
})
app.get('/getBooks', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Book.getBooks(mes, resp, next)
})
app.get('/getBooks_filter', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Book.getBooks_filter(mes, resp, next)
})
app.get('/getBook_detail', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Book.getBook_detail(mes, resp, next)
})
app.get('/addBook', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Book.addBook(mes, resp, next)
})
app.get('/editBook', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Book.editBook(mes, resp, next)
})
/************************* 书籍其他属性 Begin *************************/
app.get('/getBook_type', async function (mes, resp, next) {
  console.log('path:', mes.path)
  BookProp.getBook_type(mes, resp, next)
})
app.get('/getBook_label', async function (mes, resp, next) {
  console.log('path:', mes.path)
  BookProp.getBook_label(mes, resp, next)
})
app.get('/getBook_derive', async function (mes, resp, next) {
  console.log('path:', mes.path)
  BookProp.getBook_derive(mes, resp, next)
})
app.get('/getBook_website', async function (mes, resp, next) {
  console.log('path:', mes.path)
  BookProp.getBook_website(mes, resp, next)
})
app.get('/move_type', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  BookProp.move_type(mes, resp, next)
})
app.get('/move_label', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  BookProp.move_label(mes, resp, next)
})
app.get('/move_website', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  BookProp.move_website(mes, resp, next)
})
/************************* 书单 Begin *************************/
app.get('/getUser_bookshelfs', function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Bookshelf.getUser_bookshelfs(mes, resp, next)
})
app.get('/getUser_bookshelfs_index', function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Bookshelf.getUser_bookshelfs_index(mes, resp, next)
})
app.get('/bookshelfs_addBook', function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Bookshelf.bookshelfs_addBook(mes, resp, next)
})
app.get('/add_bookshelf', function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Bookshelf.add_bookshelf(mes, resp, next)
})
app.get('/getUser_bookshelf_detail', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Bookshelf.getUser_bookshelf_detail(mes, resp, next)
})
app.get('/bookshelf_delBook', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Bookshelf.bookshelf_delBook(mes, resp, next)
})
app.get('/bookshelf_del', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Bookshelf.bookshelf_del(mes, resp, next)
})
app.get('/bookshelf_edit', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Bookshelf.bookshelf_edit(mes, resp, next)
})
/************************* 句子 Begin *************************/
app.get('/get_SentenceLabels', async function (mes, resp, next) {
  console.log('path:', mes.path)
  Sentence.get_SentenceLabels(mes, resp, next)
})
app.get('/add_sentence_label', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Sentence.add_sentence_label(mes, resp, next)
})
app.get('/move_sentence_label', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Sentence.move_sentence_label(mes, resp, next)
})
app.get('/book_add_sentence', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Sentence.book_add_sentence(mes, resp, next)
})
app.get('/getBook_Sentences', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Sentence.getBook_Sentences(mes, resp, next)
})
/************************* 推文 Begin *************************/
app.get('/book_add_recommend', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Recommend.book_add_recommend(mes, resp, next)
})
app.get('/getBook_Recommends', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Recommend.getBook_Recommends(mes, resp, next)
})
/************************* 反馈 Begin *************************/
app.get('/add_suggestion', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Suggestion.add_suggestion(mes, resp, next)
})
app.get('/get_suggestion', async function (mes, resp, next) {
  console.log('path:', mes.path)
  Suggestion.get_suggestion(mes, resp, next)
})






let User = {
  // ------------------登录/注册------------------
  getUserInfo: async (mes, resp, next) => {
    let user_info = {
      nickName: '',
      avatarUrl: '',
      phone: ''
    }
    // 0.根据code调取wx接口获取openid
    let jscode_data = {
      appid: 'wx78d9e0fee4fe52f5',
      secret: '310f942962c3668ee77d09ed51e70716',
      js_code: mes.query.js_code,
      grant_type: 'authorization_code',
    }
    let url = "https://api.weixin.qq.com/sns/jscode2session?" + commen.joinParams(jscode_data);
    const resolveRes = await commen.getHttps(url) // await寫法是then((res)=>{})的語法糖
    // 1.根据openid查找数据
    let params = [resolveRes.openid]
    let sql = "select * from user where openid=? ;";
    let result = await db.query(sql, params);
    // 2.找到了就返回昵称头像
    if (result.length > 0) {
      user_info = result[0]
    } else { // 3.找不到就数据库插入该数据即注册
      let params = [resolveRes.openid, mes.query.nickName, mes.query.avatarUrl, 2]
      let sql = "insert into user(openid,nickName,avatarUrl,role) value(?,?,?,?)"
      let result = await db.query(sql, params);
      if (result) {
        user_info.nickName = mes.query.nickName
        user_info.avatarUrl = mes.query.avatarUrl
        user_info.role = 2
      }
      // 查找id
      let result2 = await db.query("select * from user where openid=?", [resolveRes.openid]);
      let id = result2[0].id
      user_info.id = id
      // 初始化书单
      let params2 = [id, '我的已读']
      let sql2 = 'insert into user_bookshelf(user_id,name) value(?,?)'
      db.query(sql2, params2);
    }
    // 4.返回请求
    resp.json({
      user_info: user_info
    })
  },
  // ------------------获取用户信息------------------
  refresh_get_UserInfo: async (mes, resp, next) => {
    let params = [mes.query.id]
    let sql = `select * from user where id=?`
    let result = await db.query(sql, params);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res[0]
    })
  }
}
let Book = {
  // ------------------最新入库书籍列表------------------
  getBooks_new: async (mes, resp, next) => {
    /*
      返回所有列： 表名.* 
      返回固定列： 表名.字段名 
      重命名： 旧名 as 新名
      排序： order by 字段名 desc
      查找固定数量： limit 个数
      联表查询： 表a left join 表b on 表a.字段名 = 表b.字段名
      带逗号的关联查询：group_concat，find_in_set，详见ipad笔记
    */
    let sql = `select b.*, 
    group_concat(distinct b_l.label_name) as label_names, 
    b_t.type_name from qmcn.book b 
    left join qmcn.book_type b_t on b.type_id = b_t.type_id 
    left join qmcn.book_label b_l on find_in_set(b_l.label_id, b.label_ids) 
    group by b.id 
    order by create_time desc limit 5;`
    let params = []
    let result = await db.query(sql, params);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------书籍简单列表------------------
  getBooks: async (mes, resp, next) => {
    /*
      模糊查询： like %字符%
      查找第几条到第几条： limit 开始下标,个数
    */
    let limit = [(mes.query.page - 1) * mes.query.count, mes.query.count]
    let name = mes.query.keyword
    let sql = `select * from book limit ${limit[0]},${limit[1]}`;
    if (name) {
      sql = `select * from book 
      WHERE name LIKE '%${name}%' or author LIKE '%${name}%' or cvName LIKE '%${name}%' 
      limit ${limit[0]},${limit[1]};`;
    }
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------书籍搜索------------------
  getBooks_filter: async (mes, resp, next) => {
    /*
      sort 默认时间 1热度 2收藏
    */
    let limit = [(mes.query.page - 1) * mes.query.count, mes.query.count]
    let type_id = mes.query.type_id == -1 ? '' : mes.query.type_id
    let website_id = mes.query.website_id == -1 ? '' : mes.query.website_id
    let label_ids = mes.query.label_ids
    let sql = `
      select b.*, 
      group_concat(distinct b_l.label_name) as label_names, 
      b_t.type_name 
      from qmcn.book b 
      left join qmcn.book_type b_t on b.type_id = b_t.type_id 
      left join qmcn.book_website b_w on b.website_id = b_w.website_id 
      left join qmcn.book_label b_l on find_in_set(b_l.label_id, b.label_ids) group by b.id 
      having id > 0 `;
    if (type_id) {
      sql += ` and type_id = '${type_id}'`;
    }
    if (website_id) {
      sql += ` and website_id = '${website_id}'`;
    }
    if (label_ids) {
      let label_idsArr = label_ids.split(',')
      for (let i = 0; i < label_idsArr.length; i++) {
        sql += `and find_in_set(${label_idsArr[i]}, label_ids) `
      }
    }
    sql += `
    order by ${mes.query.sort == 1 ? 'likes desc,create_time desc' : mes.query.sort == 2 ? 'collect desc, create_time desc' : 'create_time desc'} 
    limit ${limit[0]},${limit[1]};`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------获取书籍详情------------------
  getBook_detail: async (mes, resp, next) => {
    /*
      嵌套查询： select * from (...) as 新表名 where 新表明 = 条件；
      group_concat函数去除相同字段：distinct 
    */
    /*
      sentence_id 字段 可选
      recommend_id 字段 可选
    */
    let params = [mes.query.id]
    let sql = `select * from 
    (select b.*, 
    group_concat(distinct b_l.label_name) as label_names, 
    group_concat(distinct b_d.derive_name) as derive_names, 
    b_t.type_name,b_w.website_name from qmcn.book b 
    left join qmcn.book_type b_t on b.type_id = b_t.type_id 
    left join qmcn.book_website b_w on b.website_id = b_w.website_id 
    left join qmcn.book_label b_l on find_in_set(b_l.label_id, b.label_ids) 
    left join qmcn.book_derive b_d on find_in_set(b_d.derive_id, b.derive_ids) group by b.id ) 
    as new_b 
    where new_b.id=? ;`;
    let result = await db.query(sql, params);
    let obj = ''
    if (result.length > 0) {
      obj = result[0]
    }
    resp.json({
      data: obj
    })
    // book表热度增加
    let sql1 = `UPDATE book set likes = likes + 1 where id= ${mes.query.id};`
    db.query(sql1, []);
    // 从句子/推荐进入详情
    let sql2 = ''
    if (mes.query.sentence_id && mes.query.sentence_id != 'undefined') {
      sql2 = `UPDATE sentence set likes = likes + 1 where sentence_id= ${mes.query.sentence_id};`
      db.query(sql2, []);
    } else if (mes.query.recommend_id && mes.query.recommend_id != 'undefined') {
      sql2 = `UPDATE recommend set likes = likes + 1 where recommend_id= ${mes.query.recommend_id};`
      db.query(sql2, []);
    }
  },
  // ------------------书籍添加------------------
  addBook: async (mes, resp, next) => {
    let params = [mes.query.name, mes.query.author,
    mes.query.words ? mes.query.words : null,
    mes.query.type_id, mes.query.label_ids, mes.query.website_id ? mes.query.website_id : '',
    mes.query.publish_time, mes.query.images, mes.query.top, mes.query.bottom,
    mes.query.cpName, mes.query.cvName, mes.query.derive_ids,
    mes.query.scoreWriting, mes.query.scoreFeeling, mes.query.scorePlot]
    let sql = `insert into book 
      (name,author,words,type_id,label_ids,website_id,publish_time,images,
      top,bottom,cpName,cvName,derive_ids,scoreWriting,scoreFeeling,scorePlot)
      values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------书籍编辑------------------
  editBook: async (mes, resp, next) => {
    let params = [mes.query.name, mes.query.author, mes.query.words, mes.query.type_id, mes.query.label_ids,
    mes.query.website_id, mes.query.publish_time, mes.query.images, mes.query.top, mes.query.bottom,
    mes.query.cpName, mes.query.cvName, mes.query.derive_ids, mes.query.scoreWriting, mes.query.scoreFeeling,
    mes.query.scorePlot, mes.query.id
    ]
    params = params.map((it, i) => {
      if (i == 2) {
        return it == 'null' ? null : it
      }
      return it == 'null' ? '' : it
    })
    let sql = `UPDATE book set name=?,author=?,words=?,type_id=?,label_ids=?,
      website_id=?,publish_time=?,images=?,top=?,bottom=?,cpName=?,cvName=?,
      derive_ids=?,scoreWriting=?,scoreFeeling=?,scorePlot=?
      where id=?;`;
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
}
let BookProp = {
  // ------------------获取书籍类型------------------
  getBook_type: async (mes, resp, next) => {
    let sql = `select * from book_type order by weight`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------获取书籍标签------------------
  getBook_label: async (mes, resp, next) => {
    let sql = `select * from book_label order by label_type_id,weight`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------获取书籍衍生作品------------------
  getBook_derive: async (mes, resp, next) => {
    let sql = `select * from book_derive`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------获取书籍发布平台------------------
  getBook_website: async (mes, resp, next) => {
    let sql = `select * from book_website order by weight`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------书籍类型修改顺序------------------
  move_type: async (mes, resp, next) => {
    let sql = `UPDATE book_type set weight=? where type_id = ?;`;
    let params = [mes.query.wei, mes.query.type_id]
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------书籍标签修改顺序------------------
  move_label: async (mes, resp, next) => {
    let sql = `UPDATE book_label set weight=? where label_id = ?;`;
    let params = [mes.query.wei, mes.query.label_id]
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------书籍发布平台修改顺序------------------
  move_website: async (mes, resp, next) => {
    let sql = `UPDATE book_website set weight=? where website_id = ?;`;
    let params = [mes.query.wei, mes.query.website_id]
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
}
let Bookshelf = {
  // ------------------获取用户书单------------------
  getUser_bookshelfs: async (mes, resp, next) => {
    /*
      group_concat函数合并拼接
      GROUP_CONCAT(DISTINCT 要拼接的字段 ORDER BY 排序字段 ASC/DESC SEPARATOR '分隔符')
    */
    let sql = `select a.name,a.id,count(b.bookshelf_id) as count,
    group_concat(b.book_id SEPARATOR ',' ) as book_ids 
    from user_bookshelf a
    left join user_bookshelf_mid b on a.id = b.bookshelf_id
    where a.user_id = ? group by a.id order by a.id;`;
    let params = [mes.query.user_id]
    let result = await db.query(sql, params);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------获取用户书单-首页------------------
  getUser_bookshelfs_index: async (mes, resp, next) => {
    let sql = `select a.name,a.id,b.read_time,b.book_id,b.add_time,book.name book_name,book_type.type_name,book.images 
    from user_bookshelf a
    left join user_bookshelf_mid b on a.id = b.bookshelf_id
    left join book on book.id = b.book_id
    left join book_type on book_type.type_id = book.type_id
    where a.user_id = ? order by add_time desc;`;
    let params = [mes.query.user_id]
    let result = await db.query(sql, params);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------书籍加入书单------------------
  bookshelfs_addBook: async (mes, resp, next) => {
    let sql = `insert into user_bookshelf_mid (user_id,book_id,read_time,bookshelf_id) values (?,?,?,?);`;
    let params = [mes.query.user_id, mes.query.book_id, mes.query.read_time, mes.query.id,]
    let result = await db.query(sql, params);
    let code = ''
    console.log(result)
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
    // 书籍收藏数增加
    let sql2 = `UPDATE book set collect = collect + 1 where id= ${mes.query.book_id};`
    db.query(sql2, []);
  },
  // ------------------新增书单------------------
  add_bookshelf: async (mes, resp, next) => {
    let sql = `insert into user_bookshelf (user_id,name) values (?,?);`;
    let params = [mes.query.user_id, mes.query.name]
    let result = await db.query(sql, params);
    let code = ''
    console.log(result)
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------查看书单详情------------------
  getUser_bookshelf_detail: async (mes, resp, next) => {
    let sql = `select a.*,book.*,book_type.type_name,a.id record_id 
    from user_bookshelf_mid a
    left join book on book.id = a.book_id
    left join book_type on book_type.type_id = book.type_id
    where a.user_id = ? and a.bookshelf_id = ? order by ${mes.query.sort ? 'a.read_time' : 'a.add_time'} desc;`;
    let params = [mes.query.user_id, mes.query.id]
    let result = await db.query(sql, params);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------删除书单中的书籍------------------
  bookshelf_delBook: async (mes, resp, next) => {
    let sql = `DELETE FROM user_bookshelf_mid
    where user_id = ? and id = ?;`;
    let params = [mes.query.user_id, mes.query.record_id]
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------删除书单------------------
  bookshelf_del: async (mes, resp, next) => {
    let sql = `DELETE FROM user_bookshelf
    where user_id = ? and id = ?;`;
    let params = [mes.query.user_id, mes.query.id]
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
    // 删除中间记录表中的书单
    let sql2 = `DELETE FROM user_bookshelf_mid
    where user_id = ? and bookshelf_id = ?;`;
    db.query(sql2, params);
  },
  // ------------------修改书单名------------------
  bookshelf_edit: async (mes, resp, next) => {
    let sql = `UPDATE user_bookshelf set name=? where user_id = ? and id=?;`;
    let params = [mes.query.name, mes.query.user_id, mes.query.id]
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  }
}
let Sentence = {
  // ------------------获取句子标签------------------
  get_SentenceLabels: async (mes, resp, next) => {
    let sql = `select * from sentence_label order by weight`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
  // ------------------添加句子标签------------------
  add_sentence_label: async (mes, resp, next) => {
    let sql = `insert into sentence_label 
    (label_id,label_name,weight)
    values (?,?,?);`;
    let result = await db.query(sql, [mes.query.label_id, mes.query.label_name, mes.query.weight]);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------句子标签修改顺序------------------
  move_sentence_label: async (mes, resp, next) => {
    let sql = `UPDATE sentence_label set weight=? where label_id = ?;`;
    let params = [mes.query.wei, mes.query.label_id]
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------添加句子------------------
  book_add_sentence: async (mes, resp, next) => {
    let params = [mes.query.id, mes.query.label_ids, mes.query.content, mes.query.user_id, 0]
    let sql = `insert into sentence 
    (book_id,sentence_label_ids,content,user_id,likes)
    values (?,?,?,?,?);`;
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------获取句子------------------
  getBook_Sentences: async (mes, resp, next) => {
    /*
      返回结果默认按照：添加时间排序
      可选  id       书籍id   int
      可选  random   随机条数  NUMBER
      可选  user_id  用户id - todo
    */
    let sql = `
    select * from 
    (
      select s.*,book.name book_name,group_concat(distinct l.label_name) as label_names
      from sentence s
      left join book on s.book_id = book.id
      left join sentence_label l on find_in_set(l.label_id , s.sentence_label_ids) group by s.sentence_id
      ${mes.query.random ? 'ORDER BY RAND() LIMIT ' + mes.query.random : 'order by creat_time desc'}
    ) 
    as new_t ${mes.query.id ? 'where new_t.book_id = ?' : ''} 
    ;`;
    let result = await db.query(sql, [mes.query.id]);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
}
let Recommend = {
  // ------------------添加推文------------------
  book_add_recommend: async (mes, resp, next) => {
    let params = [mes.query.id, mes.query.title, mes.query.content, mes.query.user_id, 0]
    let sql = `insert into recommend 
    (book_id,title,content,user_id,likes)
    values (?,?,?,?,?);`;
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------获取推文------------------
  getBook_Recommends: async (mes, resp, next) => {
    let sql = `
    select recommend.*,book.name book_name,user.nickName 
    from recommend
    left join book on recommend.book_id = book.id
    left join user on recommend.user_id = user.id 
      ${mes.query.id ? 'where book_id = ?' : ''} 
      ${mes.query.random ? 'ORDER BY RAND() LIMIT ' + mes.query.random : 'order by likes desc,recommend.creat_time desc'};`;
    let result = await db.query(sql, [mes.query.id]);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
}
let Suggestion = {
  // ------------------添加反馈------------------
  add_suggestion: async (mes, resp, next) => {
    let params = [mes.query.content, mes.query.user_id, mes.query.contact ? mes.query.contact : null, mes.query.id ? mes.query.id : null, mes.query.name ? mes.query.name : null]
    let sql = `insert into suggestion 
    (content,user_id,contact,book_id,book_name)
    values (?,?,?,?,?);`;
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------获取反馈------------------
  get_suggestion: async (mes, resp, next) => {
    let sql = `select * from suggestion order by id desc`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res
    })
  },
}