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

//展示主页(exchange)
// app.get("/",router.showExchange);

//展示变卖页
// app.get("/sale",router.showSale);

//展示赠送
// app.get("/send",router.showSend);

//展示捐献
// app.get("/donate",router.showDonate);


//获得交换商品提交页面
app.get("/add_exchange_product",router.showAddExchangeProduct);

//获得变卖商品提交页面
app.get("/add_sale_product",router.showAddSailProduct);

//获得赠送商品提交页面
app.get("/add_send_product",router.showAddSendProduct);

//获得捐赠商品提交页面
app.get("/add_donate_product",router.showAddDonateProduct);

//执行注册业务
app.post("/doRegist",router.doRegist);

//执行登陆业务
app.post("/doLogin",router.doLogin);

//执行交换发布商品业务
app.post("/exchangeGoodsSubmit",router.exchangeGoodsSubmit);

//执行变卖发布商品业务
app.post("/saleGoodsSubmit",router.saleGoodsSubmit);

// //执行赠送发布商品业务
app.post("/sendGoodsSubmit",router.sendGoodsSubmit);

// //执行捐赠发布商品业务
app.post("/donateGoodsSubmit",router.donateGoodsSubmit);


//获取所有商品内容的图表统计
app.get("/",router.dataCount);

//获取捐赠所有商品内容
app.get("/donatelistMsg",router.donatelistMsg);

//商品内容分页总数
app.get("/donateNumberAmount",router.donateNumberAmount);  

//获取交换所有商品内容
app.get("/exchangelistMsg",router.exchangelistMsg);

//交换内容分页总数
app.get("/exchangeNumberAmount",router.exchangeNumberAmount); 

//获取赠与所有商品内容
app.get("/sendlistMsg",router.sendlistMsg);

//交换内容分页总数
app.get("/sendNumberAmount",router.sendNumberAmount); 

//获取变卖所有商品内容
app.get("/salelistMsg",router.salelistMsg);

//变卖内容分页总数
app.get("/saleNumberAmount",router.saleNumberAmount); 


//搜索
app.post("/search-sql",router.searchSql);  


//退出
app.get("/user_exit",router.index);

//设置头像的业务
app.get("/setavatar",router.showSetavatar);


//上传图片
//执行设置头像的业务
app.post("/doSetavatar",router.doSetavatar);
//app.get("/doSetavatar",router.doSetavatar);


app.listen(80,function () {
	console.log("项目启动成功！");
});
