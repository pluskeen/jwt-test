const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)
const {SECRET} = require('../conf/constants')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

// 登录
router.post('/login', async (ctx, next) => {
  const {userName, password} = ctx.request.body;

  let userInfo;
  if (userName === 'zs' && password === 'abc') {
    userInfo = {
      userId: 1,
      userName: 'zs',
      nickName: '张三',
      gender: 1
    }
  }

  // 加密 userInfo
  let token
  if (userInfo) {
    token = jwt.sign(userInfo, SECRET, {expiresIn: '1h'})
  }


  if (userInfo === null) {
    ctx.body = {
      errno: -1,
      msg: '登录失败'
    }
    return
  }

  ctx.body = {
    errno: 0,
    data: token,
  }
})

// 获取用户信息
router.get('/getUserInfo', async (ctx, next) => {
  // 获取 header 头里的 authorization
  const token = ctx.header.authorization;

  try {
    const payload = await verify(token.split(' ')[1], SECRET)
    ctx.body = {
      errno: 0,
      userInfo: payload
    }
  } catch (ex) {
    ctx.body = {
      errno: -1,
      msg: 'token 验证失败'
    }
  }

})

module.exports = router
