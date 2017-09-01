//又提交，引入formidable
var formidable = require("formidable");
//引入封装好的db.js，从setting走
var db = require("../model/db.js");

var md5 = require("../model/md5.js");

var path = require("path");

var fs = require("fs");

var file = require("../model/file.js");

var util = require("../util/util.js");
var mongo = require('mongodb');

var userData = {};

//注册业务
exports.doRegist = function (req,res,next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var username = fields.username;
    var userpassword = fields.userpassword;
    //console.log(username, userpassword);
    //查询数据库的名字是否重复
    db.find("users",{"username": username},function (err,result) {
    	if(err) {
    		res.send("-3");
    		return;
    	}
    	if(result.length !=0) {//数据库查询到有数据占用
    		res.send("-1");//被占用
    		return;
    	}
    	//设置MD5加密
    	userpassword = md5(md5(userpassword)+"adou");
    	//返回result.length的长度为０，说明数据库中没有此名字
    	db.insertOne("users",{
    		"username" :  username,
    		"userpassword" :  userpassword,
        "avatar" : "default.jpg"
    	},function(err,result){
    		if(err){
    			res.send("-3");//服务器错误
    			return;
    		}
			req.session.login = "1";
    	req.session.username = username;
    	res.send("1");//注册成功

    	});
     });
  });
}

// //执行登录
exports.doLogin = function (req,res,next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    //表单数据
    var username = fields.username;
    var userpassword = fields.userpassword;
    userpassword_handel= md5(md5(userpassword)+"adou");
    db.find("users",{"username" : username},function(err,result){

      if(err){
          res.send("-5");//随便去，服务器错误
          return;
      }
      if(result.length == 0){
          res.send("-1");//用户名不存在
          return;
      }
      if(userpassword_handel == result[0].userpassword){
          req.session.login = "1";
          req.session.username= username;
          req.session.nickname = result[0].nickname || "";
          req.session.avatar = result[0].avatar || "default.jpg";
          req.session.uid = result[0]._id;
          console.log(req.session.uid);
          res.send("1");
          return;
      }else{
          res.send("-2");//密码错误
          return;
      }
    })
  })
}

// //退出登录  处理不好，有问题
exports.index= function (req,res,next) {
    req.session.login=false;
    req.session.username=false;
    res.render("index");
}
// //显示更改图片页面
exports.showSetavatar = function (req,res,next) {
  //必须登录
  if(req.session.login != "1") {
    res.redirect("/");
  	return;
  }
  res.render("setavatar",{
    userdata:util.getLoginUser(req)
  });
};
//
// //执行设置图片
exports.doSetavatar = function (req,res,next) {
  if(req.session.login != "1") {
    res.end("没有登录，请登录");
    return;
  }
  var userinfo = util.getLoginUser(req);
  var form = new formidable.IncomingForm();
  var userDir = userinfo.username;
  if(!fs.existsSync(userDir)){
      fs.mkdir(userDir);//要创建到product_img文件夹里
  }
  form.uploadDir = path.normalize(__dirname + "/../"+userDir);
  form.parse(req, function(err, fields, files) {
    var oldpath = files.mainImg.path;
    var newpath = path.normalize(__dirname+ "/../"+userDir) + "/" + new Date().getTime() +".jpg";

    fs.rename(oldpath,newpath,function (err) {
        if(err){
            res.send("失败");
            return;
        }
        db.find("users", {username: userinfo.username}, function (err, result) {
            res.render("add_product", {
                userdata:userinfo,
                pagedata:{
                  newpath:newpath,
                  index_url:"/img/down_img.jpg"
                }
            });
        });

    });
  });
};





// 超级垃圾的嵌套查询
exports.dataCount = function (req,res,next) {
    console.log("router: [/]:exports.dataCount");
    var userinfo = util.getLoginUser(req);
  db.find("donatelist",{},function(err,result){
    if(err){
      res.send("-5");//随便去，服务器错误
      return;
    }
    var donatelistCount = result.length;
    db.find("exchangelist",{},function(err,result){
      if(err){
          res.send("-5");//随便去，服务器错误
          return;
      }
      var exchangelistCount = result.length;
      db.find("sendlist",{},function(err,result){
          if(err){
              res.send("-5");//随便去，服务器错误
              return;
          }
          var sendlistCount = result.length;
          db.find("salelist",{},function(err,result){
              if(err){
                  res.send("-5");//随便去，服务器错误
                  return;
              }
              var salelistCount = result.length;


              db.find("helplist",{},function(err,result){ 

              var helplistCount = result.length;
              
              var dataArr = [exchangelistCount,salelistCount,sendlistCount,donatelistCount,helplistCount];
                res.render("data-count",{
                    userdata:userinfo,
                    pagedata:{
                      result:{
                        "exchangelistCount" : exchangelistCount,
                        "salelistCount"     : salelistCount,
                        "sendlistCount"     : sendlistCount,
                        "donatelistCount"   : donatelistCount,
                        "helplistCount"     : helplistCount,    
                      }
                    }
                  });
            });
        });

      });
   });
  });
}

//我的交易中心
exports.showUserCenter = function (req,res,next) {
  console.log("route:[/showUserCenter]:exports.showUserCenter");
  var userinfo = util.getLoginUser(req);
  //必须登录
  if(req.session.login != "1") {
    res.redirect("/");
    return;
  }
  db.find("donatelist",{"uid" :mongo.ObjectID(userinfo.uid)},function(err,result1){
    if(err){
      res.send("-5");//随便去，服务器错误
      return;
    }
    var donatelistCount = result1;

    db.find("exchangelist",{"uid" : userinfo.uid},function(err,result2){
      if(err){
          res.send("-5");//随便去，服务器错误
          return;
      }
      var exchangelistCount = result2;

      db.find("sendlist",{"uid" : userinfo.uid},function(err,result3){
          if(err){
              res.send("-5");//随便去，服务器错误
              return;
          }
          var sendlistCount = result3;
          db.find("salelist",{"uid" : userinfo.uid},function(err,result4){
              if(err){
                  res.send("-5");//随便去，服务器错误
                  return;
              }
              var salelistCount = result4;
              db.find("helplist",{"uid" : userinfo.uid},function(err,result5){ 
              var helplistCount = result5;
              console.log(helplistCount.length)  
              console.log(exchangelistCount.length)
              res.render("usercenter",{
                userdata:userinfo,
                pagedata:{
                  result:{
                    "exchangelistCount" : exchangelistCount,
                    "salelistCount"     : salelistCount,
                    "sendlistCount"     : sendlistCount,
                    "donatelistCount"   : donatelistCount,
                    "helplistCount"     : helplistCount
                  }
                }
              });
            })
        });

      });
   });
  });
}

//个人中心的分页总数
exports.userGoodsNumberAmount = function(req,res,next){
    db.getAllCount("salelist",function(saleCount){
				var saleCount = saleCount;
				db.getAllCount("exchangelist",function (exchangeCount) {
					var exchangeCount = exchangeCount;
						db.getAllCount("sendlist",function (sendCount) {
							var sendCount = sendCount;
								db.getAllCount("donatelist",function (donateCount) {
									var donateCount = donateCount;
                  db.getAllCount("helplist",function (donateCount) {
                    var helpCount = helpCount;
                    var allCount = saleCount + exchangeCount + sendCount + donateCount;
                    res.send(allCount.toString());
                  })
								})
            })
				})
    });
};





exports.adou = function (req,res,next) {
  res.send("The author is so lazy, nothing to leave.")
}


// 搜索框 数据库查询
exports.searchSql = function (req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

      //表单数据
      var searchGoodContents = fields.searchGoodContents;
      console.log(searchGoodContents);
      db.find("donatelist",{
        "username"          :  searchGoodContents
      },
      function(err,result){
        if(err){
            res.send("-5");//随便去，服务器错误
            return;
        }
      })
    })

}

//我的信息
exports.userMsg = function (req,res,next) {
  //必须登录
  if(req.session.login != "1") {
    res.redirect("/");
  	return;
  }
  var userinfo = util.getLoginUser(req);
  res.render("user-msg", {
    userdata:userinfo
  });
};

//修改我的密码
exports.reviseMyMsg = function (req,res,next) {

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

      //表单数据
      console.log(fields);
      var username = fields.username;

      var nickName = fields.nickName;

      var userpassword = fields.oldPwd;

      var userNewPwd = fields.newPwd;

      var useravatar = fields.useravatar;

      userNewPwd_handel= md5(md5(userNewPwd)+"adou");

      userpassword_handel= md5(md5(userpassword)+"adou");

      // console.log(username)

      db.find("users",{"username" : username},function(err,result){

          // console.log(result)

          if(err){
              res.send("-5");//随便去，服务器错误
              return;
          }

          if(result[0].userpassword == userpassword_handel) {

          } else {

            // console.log("原密码不正确");
            res.send("4");//
            return;
          }


          db.updateMany("users",{"username" :  username},{
            $set : {
              "userpassword" : userNewPwd_handel,
              "nickName"     : nickName,
              "avatar"       : useravatar
            }
          },function (err,result) {

            // console.log(result)
            if(err) {
              // console.log(err);
              res.send("-4");
              return;
            }
            res.send("1");//发布成功
          })    
      })
    })
}

//只添加我的昵称
exports.addNickName = function (req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var username = fields.username;
      var nickName = fields.nickName;
      var useravatar = fields.useravatar;
      db.find("users",{"username" : username},function(err,result){
        db.updateMany("users",{"username" :  username},{
            $set : {
              "nickName" : nickName,
               "avatar"  : useravatar
            }
          },function (err,result) {
            if(err) {
              // console.log(err);
              res.send("-4");
              return;
            }
            res.send("1");//发布成功
          });
      });
    });
}



//test
exports.hello = function (req,res,next) {
  res.json({
    a:"1",
    b:"2"
  })
}






