var express = require("express");
var app = express();
var router = require("./router/router.js");
var session = require('express-session');
//使用session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  //cookie: { secure: true }//不能要
  //将此设置为true时，如果浏览器没有使用HTTPS连接，客户端将不会将cookie发送回服务器。
}))

app.set("view engine","ejs");
app.use(express.static("./assets"));
app.use("/avatar",express.static("./avatar"));
app.use("/product_img",express.static("./product_img"));

//路由表

//展示主页
app.get("/",router.showIndex);
//显示发布商品
app.get("/add_product",router.add_product);

//执行注册业务
app.post("/doRegist",router.doRegist);

//执行登陆业务
app.post("/doLogin",router.doLogin);

//执行发布商品业务
app.post("/goodsSubmit",router.goodsSubmit);


//退出
app.get("/user_exit",router.index);

//设置头像的业务
app.get("/setavatar",router.showSetavatar);


//上传图片
//执行设置头像的业务
app.post("/doSetavatar",router.doSetavatar);
//app.get("/doSetavatar",router.doSetavatar);


app.listen(3000,function () {
	console.log("项目启动成功！");
});
