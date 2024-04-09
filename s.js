// import * as commen from './commen.js' //js文件不可以這樣引用
const commen = require('./commen')
const host = require('./host')
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
  res.setHeader('Access-Control-Allow-Origin', host.hostHeader)
  next();
})
app.use(express.static('./'));
app.listen(7890, function () {
  console.log('服务器开启监听，7890...')
})

let nnArr = []
/************************* 上传图片 Begin *************************/
app.post('/upload', function (mes, res) {
  // 测试环境下传完图片记得把本机的图片复制到服务器上去
  let uploadObj = new fd.IncomingForm();
  uploadObj.parse(mes, function (e, fields, files) {
    let fileInfos = files.file;
    let filename = fileInfos.name;
    var index = filename.lastIndexOf('\.');
    filename = filename.substring(index + 1, filename.length);
    let tempPath = fileInfos.path;
    let readS = fs.createReadStream(tempPath);
    let rand = Math.floor(Math.random() * 100);
    let targetPath = './upload/' + commen.getTimeNum() + rand + '.' + filename;
    let writeS = fs.createWriteStream(targetPath); //写入路径中
    readS.pipe(writeS);
    console.log('缓存成功:', commen.getTimeNum() + rand + '.' + filename);
    res.json({
      data: 'https://www.lucy0612.asia' + '/upload/' + commen.getTimeNum() + rand + '.' + filename
    });
  })
})
/************************* 用户 Begin *************************/
app.get('/getUserInfo', async function (mes, resp, next) {
  nnArr = [mes.query.js_code]
  commen.isExsist(mes, resp, nnArr, () => { User.getUserInfo(mes, resp, next) })
})
app.get('/refresh_get_UserInfo', async function (mes, resp, next) {
  nnArr = [mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { User.refresh_get_UserInfo(mes, resp, next) })
})
/************************* 书籍 Begin *************************/
app.get('/getBooks', async function (mes, resp, next) {
  nnArr = [mes.query.page, mes.query.count]
  commen.isExsist(mes, resp, nnArr, () => { Book.getBooks(mes, resp, next) })
})
app.get('/getBook_detail', async function (mes, resp, next) {
  nnArr = [mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { Book.getBook_detail(mes, resp, next) })
})
app.get('/addBook', async function (mes, resp, next) {
  nnArr = [mes.query.name, mes.query.author, mes.query.type_id]
  commen.isExsist(mes, resp, nnArr, () => { Book.addBook(mes, resp, next) })
})
app.get('/editBook', async function (mes, resp, next) {
  nnArr = [mes.query.name, mes.query.author, mes.query.type_id, mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { Book.editBook(mes, resp, next) })
})
app.get('/del_book', async function (mes, resp, next) {
  nnArr = [mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { Book.del_book(mes, resp, next) })
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
  nnArr = [mes.query.wei, mes.query.type_id]
  commen.isExsist(mes, resp, nnArr, () => { BookProp.move_type(mes, resp, next) })
})
app.get('/move_label', async function (mes, resp, next) {
  nnArr = [mes.query.wei, mes.query.label_id]
  commen.isExsist(mes, resp, nnArr, () => { BookProp.move_label(mes, resp, next) })
})
app.get('/move_website', async function (mes, resp, next) {
  nnArr = [mes.query.wei, mes.query.website_id]
  commen.isExsist(mes, resp, nnArr, () => { BookProp.move_website(mes, resp, next) })
})
/************************* 书单 Begin *************************/
app.get('/getUser_bookshelfs', function (mes, resp, next) {
  nnArr = [mes.query.user_id]
  commen.isExsist(mes, resp, nnArr, () => { Bookshelf.getUser_bookshelfs(mes, resp, next) })
})
app.get('/bookshelfs_addBook', function (mes, resp, next) {
  nnArr = [mes.query.user_id, mes.query.book_id, mes.query.read_time, mes.query.id,]
  commen.isExsist(mes, resp, nnArr, () => { Bookshelf.bookshelfs_addBook(mes, resp, next) })
})
app.get('/add_bookshelf', function (mes, resp, next) {
  nnArr = [mes.query.user_id, mes.query.name,]
  commen.isExsist(mes, resp, nnArr, () => { Bookshelf.add_bookshelf(mes, resp, next) })
})
app.get('/getUser_bookshelf_detail', async function (mes, resp, next) {
  nnArr = [mes.query.user_id, mes.query.id,]
  commen.isExsist(mes, resp, nnArr, () => { Bookshelf.getUser_bookshelf_detail(mes, resp, next) })
})
app.get('/getUser_bookshelf_timeline', async function (mes, resp, next) {
  nnArr = [mes.query.id,]
  commen.isExsist(mes, resp, nnArr, () => { Bookshelf.getUser_bookshelf_timeline(mes, resp, next) })
})
app.get('/bookshelf_delBook', async function (mes, resp, next) {
  nnArr = [mes.query.user_id, mes.query.record_id,]
  commen.isExsist(mes, resp, nnArr, () => { Bookshelf.bookshelf_delBook(mes, resp, next) })
})
app.get('/bookshelf_del', async function (mes, resp, next) {
  nnArr = [mes.query.user_id, mes.query.id,]
  commen.isExsist(mes, resp, nnArr, () => { Bookshelf.bookshelf_del(mes, resp, next) })
})
app.get('/bookshelf_edit', async function (mes, resp, next) {
  nnArr = [mes.query.name, mes.query.user_id, mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { Bookshelf.bookshelf_edit(mes, resp, next) })
})
/************************* 句子 Begin *************************/
app.get('/get_SentenceLabels', async function (mes, resp, next) {
  console.log('path:', mes.path)
  Sentence.get_SentenceLabels(mes, resp, next)
})
app.get('/add_sentence_label', async function (mes, resp, next) {
  nnArr = [mes.query.label_name, mes.query.weight]
  commen.isExsist(mes, resp, nnArr, () => { Sentence.add_sentence_label(mes, resp, next) })
})
app.get('/move_sentence_label', async function (mes, resp, next) {
  nnArr = [mes.query.wei, mes.query.label_id]
  commen.isExsist(mes, resp, nnArr, () => { Sentence.move_sentence_label(mes, resp, next) })
})
app.get('/book_add_sentence', async function (mes, resp, next) {
  nnArr = [mes.query.id, mes.query.label_ids, mes.query.content, mes.query.user_id]
  commen.isExsist(mes, resp, nnArr, () => { Sentence.book_add_sentence(mes, resp, next) })
})
app.get('/getBook_Sentences', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Sentence.getBook_Sentences(mes, resp, next)
})
app.get('/getUser_Sentences_timeline', async function (mes, resp, next) {
  nnArr = [mes.query.user_id]
  commen.isExsist(mes, resp, nnArr, () => { Sentence.getUser_Sentences_timeline(mes, resp, next) })
})
app.get('/del_sentence', async function (mes, resp, next) {
  nnArr = [mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { Sentence.del_sentence(mes, resp, next) })
})

/************************* 推文 Begin *************************/
app.get('/book_add_recommend', async function (mes, resp, next) {
  nnArr = [mes.query.id, mes.query.title, mes.query.content, mes.query.user_id]
  commen.isExsist(mes, resp, nnArr, () => { Recommend.book_add_recommend(mes, resp, next) })
})
app.get('/getBook_Recommends', async function (mes, resp, next) {
  console.log('path:', mes.path)
  console.log('query:', mes.query)
  Recommend.getBook_Recommends(mes, resp, next)
})
app.get('/del_recommend', async function (mes, resp, next) {
  nnArr = [mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { Recommend.del_recommend(mes, resp, next) })
})

/************************* 反馈 Begin *************************/
app.get('/add_suggestion', async function (mes, resp, next) {
  nnArr = [mes.query.content, mes.query.user_id]
  Suggestion.add_suggestion(mes, resp, next)
})
app.get('/get_suggestion', async function (mes, resp, next) {
  console.log('path:', mes.path)
  Suggestion.get_suggestion(mes, resp, next)
})
/************************* 捏脸 Begin *************************/
app.get('/get_nshFace', async function (mes, resp, next) {
  nnArr = [mes.query.page, mes.query.count]
  commen.isExsist(mes, resp, nnArr, () => { nshFace.get_nshFace(mes, resp, next) })
})
app.get('/add_nshFace', async function (mes, resp, next) {
  nnArr = [mes.query.name,mes.query.type_id,mes.query.user_id,mes.query.data]
  commen.isExsist(mes, resp, nnArr, () => { nshFace.add_nshFace(mes, resp, next) })
})
app.get('/edit_nshFace', async function (mes, resp, next) {
  nnArr = [mes.query.name,mes.query.type_id,mes.query.data,mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { nshFace.edit_nshFace(mes, resp, next) })
})
app.get('/del_nshFace', async function (mes, resp, next) {
  nnArr = [mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { nshFace.del_nshFace(mes, resp, next) })
})
app.get('/get_nshFace_type', async function (mes, resp, next) {
  console.log('path:', mes.path)
  nshFace.get_nshFace_type(mes, resp, next)
})
app.get('/add_nshFace_like', async function (mes, resp, next) {
  nnArr = [mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { nshFace.add_nshFace_like(mes, resp, next) })
})
app.get('/get_nshFace_detail', async function (mes, resp, next) {
  nnArr = [mes.query.id]
  commen.isExsist(mes, resp, nnArr, () => { nshFace.get_nshFace_detail(mes, resp, next) })
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
      let params = [resolveRes.openid, commen.isExsistfilterEmoji(mes.query.nickName), mes.query.avatarUrl, 2]
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
      data: user_info,
      code: 200
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
      data: res[0],
      code: 200
    })
  }
}
let Book = {
  // ------------------书籍搜索------------------
  getBooks: async (mes, resp, next) => {
    /*
      返回所有列： 表名.* 
      返回固定列： 表名.字段名 
      重命名： 旧名 as 新名
      排序： order by 字段名 desc
      查找固定数量： limit 个数
      模糊查询： like %字符%
      查找第几条到第几条： limit 开始下标,个数
      联表查询： 表a left join 表b on 表a.字段名 = 表b.字段名
      带逗号的关联查询：group_concat，find_in_set，详见ipad笔记
    */
    /*
      page 必填
      count 必填
      sort 默认时间 1热度 2收藏 -1随机
    */
    let keyword = commen.isExsistfilterEmoji(mes.query.keyword)
    let limit = [(mes.query.page - 1) * mes.query.count, mes.query.count]
    let type_id = mes.query.type_id == -1 ? '' : mes.query.type_id
    let website_id = mes.query.website_id == -1 ? '' : mes.query.website_id
    let label_ids = mes.query.label_ids
    let sql = `
      select b.*, 
      group_concat(distinct b_l.label_name) as label_names, 
      b_t.type_name 
      from book b 
      left join book_type b_t on b.type_id = b_t.type_id 
      left join book_website b_w on b.website_id = b_w.website_id 
      left join book_label b_l on find_in_set(b_l.label_id, b.label_ids) group by b.id 
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
    if (keyword) {
      sql += `and name LIKE '%${keyword}%' or author LIKE '%${keyword}%' or cvName LIKE '%${keyword}%' `
    }
    sql += `
    order by ${mes.query.sort == 1 ? 'likes desc,create_time desc'
        : mes.query.sort == 2 ? 'collect desc, create_time desc'
          : mes.query.sort == -1 ? 'RAND()'
            : 'create_time desc'} 
    limit ${limit[0]},${limit[1]};`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res,
      code: 200
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
    b_t.type_name,b_w.website_name from book b 
    left join book_type b_t on b.type_id = b_t.type_id 
    left join book_website b_w on b.website_id = b_w.website_id 
    left join book_label b_l on find_in_set(b_l.label_id, b.label_ids) 
    left join book_derive b_d on find_in_set(b_d.derive_id, b.derive_ids) group by b.id ) 
    as new_b 
    where new_b.id=? ;`;
    let result = await db.query(sql, params);
    let obj = ''
    if (result.length > 0) {
      obj = result[0]
    }
    resp.json({
      data: obj,
      code: 200
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
    /* 
     防止前端不传的时候存了undefined,别的参数不判断是因为前端不会传undefined
     除非直接请求接口，需要进行数据库操作报错时的处理 todo
    */
    let params = [
      commen.isExsistfilterEmoji(mes.query.name),
      commen.isExsistfilterEmoji(mes.query.author),
      mes.query.words ? mes.query.words : null,
      mes.query.type_id,
      mes.query.label_ids,
      mes.query.website_id ? mes.query.website_id : null,
      mes.query.publish_time, mes.query.images,
      commen.isExsistfilterEmoji(mes.query.top),
      commen.isExsistfilterEmoji(mes.query.bottom),
      commen.isExsistfilterEmoji(mes.query.cpName),
      commen.isExsistfilterEmoji(mes.query.cvName),
      mes.query.derive_ids,
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
    let params = [
      commen.isExsistfilterEmoji(mes.query.name),
      commen.isExsistfilterEmoji(mes.query.author),
      mes.query.words,
      mes.query.type_id,
      mes.query.label_ids,
      mes.query.website_id,
      mes.query.publish_time,
      mes.query.images,
      commen.isExsistfilterEmoji(mes.query.top),
      commen.isExsistfilterEmoji(mes.query.bottom),
      commen.isExsistfilterEmoji(mes.query.cpName),
      commen.isExsistfilterEmoji(mes.query.cvName),
      mes.query.derive_ids,
      mes.query.scoreWriting,
      mes.query.scoreFeeling,
      mes.query.scorePlot,
      mes.query.id
    ]
    params = params.map((it, i) => {
      if (i == 2) {
        return it == 'null' ? null : it // 书的字数类型不能为空字符串''
      }
      return it == 'null' ? '' : it // 前端将null传过来时会自动转换成字符串
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
  // ------------------删除书籍------------------
  del_book: async (mes, resp, next) => {
    let sql = `DELETE FROM book
      where id = ?;`;
    let params = [mes.query.id]
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
    // 删除包含此书的 中间记录表中的书单
    let sql2 = `DELETE FROM user_bookshelf_mid
    where book_id = ?;`;
    db.query(sql2, params);
    // 删除此书的 相关句子
    let sql3 = `DELETE FROM sentence
    where book_id = ?;`;
    db.query(sql3, params);
    // 删除此书的 相关推文
    let sql4 = `DELETE FROM recommend
    where book_id = ?;`;
    db.query(sql4, params);
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
      data: res,
      code: 200
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
      data: res,
      code: 200
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
      data: res,
      code: 200
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
      data: res,
      code: 200
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
    let sql = `select a.name,a.id,count(b.bookshelf_id) as count
    from user_bookshelf a 
    left join user_bookshelf_mid b on a.id = b.bookshelf_id
    where a.user_id = ? group by a.id order by a.id;`;
    let params = [mes.query.user_id]
    let result = await db.query(sql, params);
    let res = []
    if (result.length > 0) {
      res = JSON.parse(JSON.stringify(result))
      for (let i = 0; i < res.length; i++) {
        let sql = `select read_time,
        b.book_id,b.add_time,book.name book_name,book_type.type_name,book.images 
        from user_bookshelf a
        left join user_bookshelf_mid b on a.id = b.bookshelf_id
        left join book on book.id = b.book_id
        left join book_type on book_type.type_id = book.type_id
        where a.user_id = ${mes.query.user_id} and ${res[i].id} = b.bookshelf_id
        order by read_time desc, add_time desc;
         `;
        let _result = await db.query(sql, []);
        res[i].child = _result
      }
    }
    resp.json({
      data: res,
      code: 200
    })
  },
  // ------------------书籍加入书单------------------
  bookshelfs_addBook: async (mes, resp, next) => {
    let sql = `insert into user_bookshelf_mid (user_id,book_id,read_time,bookshelf_id) values (?,?,?,?);`;
    let params = [mes.query.user_id, mes.query.book_id, mes.query.read_time, mes.query.id,]
    let result = await db.query(sql, params);
    let code = ''
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
    let params = [mes.query.user_id, commen.isExsistfilterEmoji(mes.query.name)]
    let result = await db.query(sql, params);
    let code = ''
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
    where a.user_id = ? and a.bookshelf_id = ? order by a.read_time desc, a.add_time desc;`;
    let params = [mes.query.user_id, mes.query.id]
    let result = await db.query(sql, params);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res,
      code: 200
    })
  },
  // ------------------获取用户某书单的时间线------------------
  /*
    where xx group 先查再对结果分组
    having xx group 先分组再筛选
  */
  getUser_bookshelf_timeline: async (mes, resp, next) => {
    let sql = `
      select count(book_id) as count,bookshelf_id,
      DATE_FORMAT(read_time, '%y%m') y_month,
      DATE_FORMAT(read_time, '%Y') year,
      DATE_FORMAT(read_time, '%m') month from user_bookshelf_mid where bookshelf_id = ${mes.query.id}
      group by y_month  order by read_time desc,add_time desc`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = JSON.parse(JSON.stringify(result))
      for (let i = 0; i < res.length; i++) {
        let sql = `
        select a.*,book.*,book_type.type_name,a.id record_id ,
        DATE_FORMAT(read_time, '%D') day
        from user_bookshelf_mid a
        left join book on book.id = a.book_id
        left join book_type on book_type.type_id = book.type_id
           having bookshelf_id = ${mes.query.id} and DATE_FORMAT(read_time, '%y%m') = ${res[i].y_month}
           order by read_time desc,add_time desc
           `;
        let result = await db.query(sql, []);
        res[i].child = result
      }
    }
    resp.json({
      data: res,
      code: 200
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
    let params = [commen.isExsistfilterEmoji(mes.query.name), mes.query.user_id, mes.query.id]
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
      data: res,
      code: 200,
    })
  },
  // ------------------添加句子标签------------------
  add_sentence_label: async (mes, resp, next) => {
    let sql = `insert into sentence_label 
    (label_name,weight)
    values (?,?);`;
    let result = await db.query(sql, [commen.isExsistfilterEmoji(mes.query.label_name), mes.query.weight]);
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
    let params = [mes.query.id, mes.query.label_ids, commen.isExsistfilterEmoji(mes.query.content), mes.query.user_id, 0]
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
      可选  user_id  用户id   和书籍id只能传一个
    */
    let sql = `
      select s.*,book.name book_name,group_concat(distinct l.label_name) as label_names
      from sentence s
      left join book on s.book_id = book.id
      left join sentence_label l on find_in_set(l.label_id , s.sentence_label_ids) group by s.sentence_id
      ${mes.query.id && mes.query.id != 'undefined' ? `having book_id = ${mes.query.id}` : ``} 
      ${mes.query.user_id && mes.query.user_id != 'undefined' ? `having user_id = ${mes.query.user_id}` : ''} 
      ${mes.query.random ? 'ORDER BY RAND() LIMIT ' + mes.query.random : 'order by creat_time desc'}
      `;
    if (mes.query.page) {
      let limit = [(mes.query.page - 1) * mes.query.count, mes.query.count]
      sql += ` limit ${limit[0]},  ${limit[1]}`
    }
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res,
      code: 200
    })
  },
  // ------------------获取用户所有句子的时间线------------------
  /*
    DATE_FORMAT(NOW(), '%Y')
  */
  getUser_Sentences_timeline: async (mes, resp, next) => {
    let sql = `
    select count(sentence_id) as count,
    DATE_FORMAT(creat_time, '%y%m') y_month,
    DATE_FORMAT(creat_time, '%Y') year,
    DATE_FORMAT(creat_time, '%m') month,user_id from sentence 
    group by DATE_FORMAT(creat_time, '%y%m') having user_id = ${mes.query.user_id} order by creat_time desc`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = JSON.parse(JSON.stringify(result))
      for (let i = 0; i < res.length; i++) {
        let sql = `
         select s.*,book.name book_name,group_concat(distinct l.label_name) as label_names,
         DATE_FORMAT(creat_time, '%l%p') hour,DATE_FORMAT(creat_time, '%d') day
         from sentence s
         left join book on s.book_id = book.id
         left join sentence_label l on find_in_set(l.label_id , s.sentence_label_ids) group by s.sentence_id
         having user_id = ${mes.query.user_id} and DATE_FORMAT(creat_time, '%y%m') = ${res[i].y_month}
         order by creat_time desc
         `;

        let result = await db.query(sql, []);
        res[i].child = result
      }
    }
    resp.json({
      data: res,
      code: 200
    })
  },
  // ------------------删除句子------------------
  del_sentence: async (mes, resp, next) => {
    let sql = `DELETE FROM sentence
      where sentence_id = ?;`;
    let params = [mes.query.id]
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
let Recommend = {
  // ------------------添加推文------------------
  book_add_recommend: async (mes, resp, next) => {
    let params = [mes.query.id, commen.isExsistfilterEmoji(mes.query.title), commen.isExsistfilterEmoji(mes.query.content), mes.query.user_id, 0]
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
    ${mes.query.id && mes.query.id != 'undefined' ? 'having book_id = ' + mes.query.id : ''} 
    ${mes.query.user_id && mes.query.user_id != 'undefined'? `having user_id = ${mes.query.user_id} ` : ''} 
    ${mes.query.random ? 'ORDER BY RAND() LIMIT ' + mes.query.random : ' order by recommend.creat_time desc'} 
    `;
    if (mes.query.page) {
      let limit = [(mes.query.page - 1) * mes.query.count, mes.query.count]
      sql += ` limit ${limit[0]},  ${limit[1]}`
    }
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res,
      code: 200
    })
  },
  // ------------------删除推文------------------
  del_recommend: async (mes, resp, next) => {
    let sql = `DELETE FROM recommend
      where recommend_id = ?;`;
    let params = [mes.query.id]
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
let Suggestion = {
  // ------------------添加反馈------------------
  add_suggestion: async (mes, resp, next) => {
    let params = [commen.isExsistfilterEmoji(mes.query.content), mes.query.user_id, mes.query.contact ? commen.isExsistfilterEmoji(mes.query.contact) : null, mes.query.id ? mes.query.id : null, mes.query.name ? mes.query.name : null]
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
      data: res,
      code: 200
    })
  },
}
let nshFace = {
  // ------------------获取书籍类型------------------
  get_nshFace_type: async (mes, resp, next) => {
    let sql = `select * from nsh_face_type`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res,
      code: 200
    })
  },
  // ------------------捏脸搜索------------------
  get_nshFace: async (mes, resp, next) => {
    /*
      返回所有列： 表名.* 
      返回固定列： 表名.字段名 
      重命名： 旧名 as 新名
      排序： order by 字段名 desc
      查找固定数量： limit 个数
      模糊查询： like %字符%
      查找第几条到第几条： limit 开始下标,个数
      联表查询： 表a left join 表b on 表a.字段名 = 表b.字段名
      带逗号的关联查询：group_concat，find_in_set，详见ipad笔记
    */
    /*
      page 必填
      count 必填
      sort 默认时间 1热度 2收藏 -1随机
    */
    let limit = [(mes.query.page - 1) * mes.query.count, mes.query.count]
    let type_id = mes.query.type_id == -1 ? '' : mes.query.type_id
    let sql = `
      select f.*, 
      f_t.type_name 
      from nsh_face f
      left join nsh_face_type f_t on f.type_id = f_t.type_id 
      having id > 0 `;
    if (type_id) {
      sql += ` and type_id = '${type_id}'`;
    }
    sql += `
    order by ${mes.query.sort == 1 ? 'likes desc,create_time desc'
        : mes.query.sort == 2 ? 'collect desc, create_time desc'
          : mes.query.sort == -1 ? 'RAND()'
            : 'create_time desc'} 
    limit ${limit[0]},${limit[1]};`;
    let result = await db.query(sql, []);
    let res = []
    if (result.length > 0) {
      res = result
    }
    resp.json({
      data: res,
      code: 200
    })
  },
  // ------------------捏脸添加------------------
  add_nshFace: async (mes, resp, next) => {
    /* 
     防止前端不传的时候存了undefined,别的参数不判断是因为前端不会传undefined
     除非直接请求接口，需要进行数据库操作报错时的处理 todo
    */
    let params = [
      commen.isExsistfilterEmoji(mes.query.name),
      mes.query.type_id,
      mes.query.images,
      commen.isExsistfilterEmoji(mes.query.data),
      mes.query.user_id]
    let sql = `insert into nsh_face 
      (name,type_id,images,data,user_id)
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
  // ------------------捏脸编辑------------------
  edit_nshFace: async (mes, resp, next) => {
    let params = [
      commen.isExsistfilterEmoji(mes.query.name),
      mes.query.type_id,
      mes.query.images,
      commen.isExsistfilterEmoji(mes.query.data),
      mes.query.id]
    let sql = `UPDATE nsh_face set 
    name=?,type_id=?,images=?,data=?
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
  // ------------------删除捏脸------------------
  del_nshFace: async (mes, resp, next) => {
    let sql = `DELETE FROM nsh_face
      where id = ?;`;
    let params = [mes.query.id]
    let result = await db.query(sql, params);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
    // 删除包含此脸型的 收藏记录
    let sql2 = `DELETE FROM nsh_face_collection
    where face_id = ?;`;
    db.query(sql2, params);
  },
  // ------------------增加捏脸热度------------------
  add_nshFace_like: async (mes, resp, next) => {
    let sql = `UPDATE nsh_face set likes = likes +
     1 where id= ${mes.query.id};`
    let result = await db.query(sql, []);
    let code = ''
    if (result.fieldCount == 0) {
      code = 200
    }
    resp.json({
      code
    })
  },
  // ------------------获取捏脸详情------------------
  get_nshFace_detail: async (mes, resp, next) => {
    let params = [mes.query.id]
    let sql = `select f.*,f_t.* from nsh_face f
    left join nsh_face_type f_t on f.type_id = f_t.type_id 
    having id=? ;`;
    let result = await db.query(sql, params);
    let obj = ''
    if (result.length > 0) {
      obj = result[0]
    }
    resp.json({
      data: obj,
      code: 200
    })
  },
}
