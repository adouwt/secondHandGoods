var express = require("express");
var app = express();
var router = require("./router/router.js");
var routerExchange = require("./router/exchange.js");
var routerSale = require("./router/sale.js");
var routerSend = require("./router/send.js");
var routerDonate = require("./router/donate.js");
var routerHelp = require("./router/help.js");
var routerNote = require("./router/note.js");
var routerCampusevent = require("./router/campusevent.js");
var routerMsgbox = require("./router/msgbox.js");
// var router = require("./router/router.js");
var session = require('express-session');
var config = require("./config.js");
//socket.io 公式
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
app.use("/goodsImg",express.static("./goodsImg"));


//确认登录，检查此人是否有用户名，并且不能重复
  app.get("/check",function (req,res,next) {
  	var username = req.query.username;
  	if(!username){
  		res.send("必须有用户名");
  		return;
  	}
  	if(alluser.indexOf(username) != -1){
  		res.send("该名字被占用");
  		return;
  	}
  	alluser.push(username);

  	//赋给session
  	req.session.username = username;
  	//充定向
  	res.redirect("/chat");
  });

  //聊天室
  app.get("/chat",function (req,res,next) {
  	if(!req.session.username){
  		res.redirect("/");
  		return;
  	}
  	res.render("chat",{
		  "username":req.session.username
		});
});
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/",router.dataCount);
app.get("/userGoodsNumberAmount",router.userGoodsNumberAmount);
//获得交换商品提交页面////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/exchange/showadd",routerExchange.showadd);
app.post("/exchange/submit",routerExchange.submit);
app.get("/exchange/list",routerExchange.list);
app.get("/exchange/count",routerExchange.count);
app.post("/exchange/change",routerExchange.change);
app.get("/exchange/getdetail",routerExchange.detail);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//获得变卖商品提交页面
app.get("/sale/showadd",routerSale.showadd);
app.post("/sale/submit",routerSale.submit);
app.get("/sale/list",routerSale.list);	
app.get("/sale/count",routerSale.count);
app.post("/sale/change",routerSale.change);
app.get("/sale/getdetail", routerSale.detail);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//获得赠送商品提交页面
app.get("/send/showadd",routerSend.showadd);
app.post("/send/submit",routerSend.submit);
app.get("/send/list",routerSend.list);	
app.post("/send/change",routerSend.change);
app.get("/send/count",routerSend.count);
app.get("/send/getdetail", routerSend.detail);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//获得捐赠商品提交页面
app.get("/donate/showadd",routerDonate.showadd);
app.post("/donate/submit",routerDonate.submit);
app.get("/donate/list",routerDonate.list);
app.get("/donate/count",routerDonate.count);
app.post("/donate/change",routerDonate.change);
app.get("/donate/getdetail",routerDonate.detail);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//自由帖/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/note/showadd",routerNote.showadd);
app.get("/note/list",routerNote.list);
app.post("/note/submit",routerNote.submit);
app.get("/note/getdetail", routerNote.detail);
app.get("/note/count", routerNote.count);
//校园大事件//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/event/showadd",routerCampusevent.showadd);
app.get("/event/list",routerCampusevent.list);
app.post("/event/submit",routerCampusevent.submit);
app.get("/event/count", routerCampusevent.count);
///help 帮帮忙/////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/help/showadd",routerHelp.showadd);
app.get("/help/list",routerHelp.list);
app.post("/help/submit",routerHelp.submit);
app.get("/help/count",routerHelp.count);
app.post("/help/change",routerHelp.change);
app.get("/help/getdetail",routerHelp.detail);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//执行注册业务
app.post("/doRegist",router.doRegist);
//执行登陆业务
app.post("/doLogin",router.doLogin);
//个人中心页
app.get("/usercenter",router.showUserCenter);
//搜索
app.post("/search-sql",router.searchSql);


//退出
app.get("/user_exit",router.index);

//设置头像的业务
app.get("/setavatar",router.showSetavatar);

app.get("/hello",router.hello);

app.get("/adou-intro",router.adou);


//我的信息
app.get("/user-msg",router.userMsg);
//提交修改密码
app.post("/reviseMyMsg",router.reviseMyMsg);
//添加昵称
app.post("/addNickName",router.addNickName);



//上传图片
//执行设置头像的业务
app.post("/doSetavatar",router.doSetavatar);
//app.get("/doSetavatar",router.doSetavatar);

//立即联系
app.post("/doContact",routerMsgbox.doContact);
app.get("/user-receive", routerMsgbox.userReceive);





io.on("connection",function(socket){//socket实际在运行的时候，表示用户的客户端
	socket.on("chats",function (msg) {
	  //把接受到的信息在返回到页面中去 （广播）
	  io.emit("chats",msg);
	});
});



http.listen(config.port, function () {
	console.log("项目启动成功: " + config.port);
});
