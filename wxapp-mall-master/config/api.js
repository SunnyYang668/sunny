const urlPath = "http://localhost:8080/api";

module.exports = {
  UserAdd: urlPath + '/user/wxAdd', //保存用户信息
  AuthLogin: urlPath + '/auth/login', //微信登录
  AuthUserInfo: urlPath + '/user/userInfo', //微信登录

}