//又提交，引入formidable
var formidable = require("formidable");
//引入封装好的db.js，从setting走
var db = require("../model/db.js");

var md5 = require("../model/md5.js");

var path = require("path");

var fs = require("fs");

var file = require("../model/file.js");

//socket.io 公式

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
    res.end("没有登录，请登录");
    return;
  }
  res.render("setavatar",{
    "login" : true ,
    "username" : req.session.username || "default",
    "avatar":  avatar
  });
};
//
// //执行设置图片
exports.doSetavatar = function (req,res,next) {
    var form = new formidable.IncomingForm();
    var userDir = req.session.username;
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

          //必须登录
          if(req.session.login != "1") {
            res.end("没有登录，请登录");
            return;
          }
          //检索数据库，查找此人的头像
          if (req.session.login == "1") {
              //如果登陆了
              var username = req.session.username;
              var login = true;
              var avatar = req.session.avatar;
          }

          db.find("users", {username: username}, function (err, result) {
              res.render("add_product", {
                  "newpath":newpath,
                  "login": login,
                  "username": username,
                  "avatar":  "default.jpg",
                  "index_url": "/img/down_img.jpg"
              });
          });

      });
    });


};


//显示交换 提交页面
exports.showAddExchangeProduct = function (req,res,next) {
  //必须登录
  if(req.session.login != "1") {
    res.end("没有登录，请登录");
    return;
  }
  //检索数据库，查找此人的头像
  if (req.session.login == "1") {
      //如果登陆了
      var username = req.session.username;
      var login = true;
      var avatar = req.session.avatar;
  }

  //已经登陆了，那么就要检索数据库，查登陆这个人的头像
  db.find("users", {username: username}, function (err, result) {

      res.render("add_exchange_product", {
          "login":    login,
          "username": username,
          "avatar":  "default.jpg",
      });
  });
};

//显示赠送 提交页面
exports.showAddSendProduct = function (req,res,next) {
  //必须登录
  if(req.session.login != "1") {
    res.end("没有登录，请登录");
    return;
  }
  //检索数据库，查找此人的头像
  if (req.session.login == "1") {
      //如果登陆了
      var username = req.session.username;
      var login = true;
      var avatar = req.session.avatar;
  }

  //已经登陆了，那么就要检索数据库，查登陆这个人的头像
  db.find("users", {username: username}, function (err, result) {

      res.render("add_send_product", {
          "login": login,
          "username": username,
          "avatar":  "default.jpg",
      });
  });
};

//显示变卖 提交页面
exports.showAddSailProduct = function (req,res,next) {
  //必须登录
  if(req.session.login != "1") {
    res.end("没有登录，请登录");
    return;
  }
  //检索数据库，查找此人的头像
  if (req.session.login == "1") {
      //如果登陆了
      var username = req.session.username;
      var login = true;
      var avatar = req.session.avatar;
  }

  //已经登陆了，那么就要检索数据库，查登陆这个人的头像
  db.find("users", {username: username}, function (err, result) {

      res.render("add_sale_product", {
          "login": login,
          "username": username,
          "avatar":  "default.jpg",
      });
  });
};

//显示捐 提交页面
exports.showAddDonateProduct = function (req,res,next) {
  //必须登录
  if(req.session.login != "1") {
    res.end("没有登录，请登录");
    return;
  }
  //检索数据库，查找此人的头像
  if (req.session.login == "1") {
      //如果登陆了
      var username = req.session.username;
      var login = true;
      var avatar = req.session.avatar;
  }

  //已经登陆了，那么就要检索数据库，查登陆这个人的头像
  db.find("users", {username: username}, function (err, result) {

      res.render("add_donate_product", {
          "login": login,
          "username": username,
          "avatar":  "default.jpg",
      });
  });
};

//交换商品表单提交
exports.exchangeGoodsSubmit = function(req,res,next) {
    //检索数据库，查找此人的头像
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    var userDir = req.session.username;

    // if(!fs.existsSync(userDir)){
    //     fs.mkdir(userDir);//创建到asset指定文件下
    // }

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      // console.log(fields);
      var username           = req.session.username;
      var selectWay          = fields.selectWay;
      var userGoodsSort      = fields.userGoodsSort;
      var userGoodsPrice     = fields.userGoodsPrice;
      var userGoodsName      = fields.userGoodsName;
      var userGoodsUseTime   = fields.userGoodsUseTime;
      var userGoodsaddText   = fields.userGoodsaddText;
      var userChangeTar      = fields.userChangeTar;
      var userName           = fields.userName;
      var userPhone          = fields.userPhone;
      var publicTime         = fields.publicTime;

      var userImgOne         = fields.userImgOne;
      var userImgTwo         = fields.userImgTwo;
      var userImgThree       = fields.userImgThree;
      var userImgFore        = fields.userImgFore;
      var imgBase64Arr       = [userImgOne,userImgTwo,userImgThree,userImgFore];

      for(var i = 0;i<imgBase64Arr.length;i++) {

        var path       = 'assets/img/'+ username + userGoodsName + selectWay + i + '.png';
        var base64     = imgBase64Arr[i].replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
        var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，

        console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
        fs.writeFile(path,dataBuffer,function(err){//用fs写入文件
            if(err){
                console.log(err);
            }else{
               console.log('图片上传成功！');
            }
        })
      }
      //查询数据库的名字是否重复
      db.find("exchangelist",{"selectWay": selectWay},function (err,result) {
        if(err) {
          res.send("-3");
          return;
        }
        // console.log(username);
        //返回result.length的长度为０，说明数据库中没有此名字
        db.insertOne("exchangelist",{
          "username"          :  username,
          "selectWay"         :  selectWay,
          "userGoodsSort"     :  userGoodsSort,
          "userGoodsPrice"    :  userGoodsPrice,
          "userGoodsName"     :  userGoodsName,
          "userGoodsUseTime"  :  userGoodsUseTime,
          "userGoodsaddText"  :  userGoodsaddText,
          "userName"          :  userName,
          "userChangeTar"     :  userChangeTar,
          "userPhone"         :  userPhone,
          "publicTime"        :  publicTime,
          "goodsStatus"       :  'unfinish',
          "imgBase64Arr"      :  imgBase64Arr,
        },function(err,result){
          if(err){
            res.send("-3");//服务器错误
            return;
          }
          req.session.login = "1";
          req.session.username = username;
          res.send("1");//发布成功
        });
       });

    });

}

//添加卖的商品提交
exports.saleGoodsSubmit = function(req,res,next) {
    //检索数据库，查找此人的头像
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

      // console.log(fields);
      var username           = req.session.username;
      var selectWay          = fields.selectWay;
      var userGoodsSort      = fields.userGoodsSort;
      var userGoodsPrice     = fields.userGoodsPrice;
      var userGoodsSalePrice = fields.userGoodsSalePrice;
      var userGoodsName      = fields.userGoodsName;
      var userGoodsUseTime   = fields.userGoodsUseTime;
      var userGoodsaddText   = fields.userGoodsaddText;
      var userName           = fields.userName;
      var userPhone          = fields.userPhone;
      var publicTime         = fields.publicTime;

      var userImgOne         = fields.userImgOne;
      var userImgTwo         = fields.userImgTwo;
      var userImgThree       = fields.userImgThree;
      var userImgFore        = fields.userImgFore;
      var imgBase64Arr       = [userImgOne,userImgTwo,userImgThree,userImgFore];

      for(var i = 0;i<imgBase64Arr.length;i++) {
        var path       = 'assets/img/'+ username + userGoodsName + selectWay + i + '.png';
        var base64     = imgBase64Arr[i].replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
        var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，

        console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
        fs.writeFile(path,dataBuffer,function(err){//用fs写入文件
            if(err){
                console.log(err);
            }else{
               console.log('图片上传成功！');
            }
        })
      }
      //查询数据库的名字是否重复
      db.find("salelist",{"selectWay": selectWay},function (err,result) {
        if(err) {
          res.send("-3");
          return;
        }
        // console.log(username);
        //返回result.length的长度为０，说明数据库中没有此名字
        db.insertOne("salelist",{
          "username"          :  username,
          "selectWay"         :  selectWay,
          "userGoodsSort"     :  userGoodsSort,
          "userGoodsPrice"    :  userGoodsPrice,
          "userGoodsSalePrice":  userGoodsSalePrice,
          "userGoodsName"     :  userGoodsName,
          "userGoodsUseTime"  :  userGoodsUseTime,
          "userGoodsaddText"  :  userGoodsaddText,
          "userName"          :  userName,
          "userPhone"         :  userPhone,
          "publicTime"        :  publicTime,
          "goodsStatus"       :  'unfinish',
          "imgBase64Arr"      :  imgBase64Arr,
        },function(err,result){
          if(err){
            res.send("-3");//服务器错误
            return;
          }
          req.session.login = "1";
          req.session.username = username;
          res.send("1");//发布成功
        });
       });
    });
}

// //添加送的商品提交
exports.sendGoodsSubmit = function(req,res,next) {
    //检索数据库，查找此人的头像
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      var username           = req.session.username;
      var selectWay          = fields.selectWay;
      var userGoodsSort      = fields.userGoodsSort;
      var userGoodsPrice     = fields.userGoodsPrice;
      var userGoodsName      = fields.userGoodsName;
      var userGoodsUseTime   = fields.userGoodsUseTime;
      var userGoodsaddText   = fields.userGoodsaddText;
      var userChangeTar      = fields.userChangeTar;
      var userName           = fields.userName;
      var userPhone          = fields.userPhone;
      var publicTime         = fields.publicTime;

      var userImgOne         = fields.userImgOne;
      var userImgTwo         = fields.userImgTwo;
      var userImgThree       = fields.userImgThree;
      var userImgFore        = fields.userImgFore;
      var imgBase64Arr       = [userImgOne,userImgTwo,userImgThree,userImgFore];

      for(var i = 0;i<imgBase64Arr.length;i++) {
        var path       = 'assets/img/'+ username + userGoodsName + selectWay + i + '.png';
        var base64     = imgBase64Arr[i].replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
        var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，

        console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
        fs.writeFile(path,dataBuffer,function(err){//用fs写入文件
            if(err){
                console.log(err);
            }else{
               console.log('图片上传成功！');
            }
        })
      }
      //查询数据库的名字是否重复
      db.find("sendlist",{"selectWay": selectWay},function (err,result) {
        if(err) {
          res.send("-3");
          return;
        }
        // console.log(username);
        //返回result.length的长度为０，说明数据库中没有此名字
        db.insertOne("sendlist",{
          "username"          :  username,
          "selectWay"         :  selectWay,
          "userGoodsSort"     :  userGoodsSort,
          "userGoodsPrice"    :  userGoodsPrice,
          "userGoodsName"     :  userGoodsName,
          "userGoodsUseTime"  :  userGoodsUseTime,
          "userGoodsaddText"  :  userGoodsaddText,
          "userName"          :  userName,
          "userChangeTar"     :  userChangeTar,
          "userPhone"         :  userPhone,
          "publicTime"        :  publicTime,
          "goodsStatus"       :  'unfinish',
          "imgBase64Arr"      :  imgBase64Arr,
        },function(err,result){
          if(err){
            res.send("-3");//服务器错误
            return;
          }
          req.session.login = "1";
          req.session.username = username;
          res.send("1");//发布成功
        });
       });
    });
}

// //添加捐的商品提交
exports.donateGoodsSubmit = function(req,res,next) {
    //检索数据库，查找此人的头像
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      var username           = req.session.username;
      var selectWay          = fields.selectWay;
      var userGoodsSort      = fields.userGoodsSort;
      var userGoodsPrice     = fields.userGoodsPrice;
      var userGoodsName      = fields.userGoodsName;
      var userGoodsUseTime   = fields.userGoodsUseTime;
      var userGoodsaddText   = fields.userGoodsaddText;
      var userChangeTar      = fields.userChangeTar;
      var userName           = fields.userName;
      var userPhone          = fields.userPhone;
      var publicTime         = fields.publicTime;

      var userImgOne         = fields.userImgOne;
      var userImgTwo         = fields.userImgTwo;
      var userImgThree       = fields.userImgThree;
      var userImgFore        = fields.userImgFore;
      var imgBase64Arr       = [userImgOne,userImgTwo,userImgThree,userImgFore];

      for(var i = 0;i<imgBase64Arr.length;i++) {
        var path       = 'assets/img/'+ username + userGoodsName + selectWay + i + '.png';
        var base64     = imgBase64Arr[i].replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
        var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，

        console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
        fs.writeFile(path,dataBuffer,function(err){//用fs写入文件
            if(err){
                console.log(err);
            }else{
               console.log('图片上传成功！');
            }
        })
      }
      //查询数据库的名字是否重复
      db.find("donatelist",{"selectWay": selectWay},function (err,result) {
        if(err) {
          res.send("-3");
          return;
        }
        // console.log(username);
        //返回result.length的长度为０，说明数据库中没有此名字
        db.insertOne("donatelist",{
          "username"          :  username,
          "selectWay"         :  selectWay,
          "userGoodsSort"     :  userGoodsSort,
          "userGoodsPrice"    :  userGoodsPrice,
          "userGoodsName"     :  userGoodsName,
          "userGoodsUseTime"  :  userGoodsUseTime,
          "userGoodsaddText"  :  userGoodsaddText,
          "userName"          :  userName,
          "userChangeTar"     :  userChangeTar,
          "userPhone"         :  userPhone,
          "publicTime"        :  publicTime,
          "goodsStatus"       :  'unfinish',
          "imgBase64Arr"      :  imgBase64Arr,
        },function(err,result){
          if(err){
            res.send("-3");//服务器错误
            return;
          }
          req.session.login = "1";
          req.session.username = username;
          res.send("1");//发布成功
        });
       });
    });
}

//获取捐总数
exports.donatelistMsg = function(req,res,next){

   if (req.session.login == "1") {
        //如果登陆了
        var username  = req.session.username;
        var login     = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }
    //这个页面接收一个参数，页面
    var page = req.query.page;
    db.find("donatelist",{},{"pageamount":2,"page":page,"sort":{"publicTime":-1}},function(err,result){
        res.render("donate",{
            "result"    : result,
            "username"  : username,
            "login"     : login
          });
    });
};

//捐总数分页总数
exports.donateNumberAmount = function(req,res,next){
    db.getAllCount("donatelist",function(count){
        res.send(count.toString());
    });
};

// //获取exchange总数
exports.exchangelistMsg = function(req,res,next){

    if (req.session.login == "1") {
        //如果登陆了
        var username  = req.session.username;
        var login     = true;

    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    //这个页面接收一个参数，页面
    var page = req.query.page;
    db.find("exchangelist",{},{"pageamount":2,"page":page,"sort":{"publicTime":-1}},function(err,result){
        res.render("exchange",{
            "result"    : result,
            "username"  : username,
            "login"     : login
          });
    });
};

//商品exchange分页总数
exports.exchangeNumberAmount = function(req,res,next){
    db.getAllCount("exchangelist",function(count){
        res.send(count.toString());
    });
};

// //获取send总数
exports.sendlistMsg = function(req,res,next){

    if (req.session.login == "1") {
        //如果登陆了
        var username  = req.session.username;
        var login     = true;

    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    //这个页面接收一个参数，页面
    var page = req.query.page;
    db.find("sendlist",{},{"pageamount":2,"page":page,"sort":{"publicTime":-1}},function(err,result){
        res.render("send",{
            "result"    : result,
            "username"  : username,
            "login"     : login
          });
    });
};

//商品send分页总数
exports.sendNumberAmount = function(req,res,next){
    db.getAllCount("sendlist",function(count){
        res.send(count.toString());
    });
};

// //获取sale总数
exports.salelistMsg = function(req,res,next){

    if (req.session.login == "1") {
        //如果登陆了
        var username  = req.session.username;
        var login     = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    //这个页面接收一个参数，页面
    var page = req.query.page;
    db.find("salelist",{},{"pageamount":2,"page":page,"sort":{"publicTime":-1}},function(err,result){
        res.render("sale",{
            "result"    : result,
            "username"  : username,
            "login"     : login
          });
    });
};

//商品sale分页总数
exports.saleNumberAmount = function(req,res,next){
    db.getAllCount("salelist",function(count){
        res.send(count.toString());
    });
};


//数据统计页面的图表显示

// 超级垃圾的嵌套查询

exports.dataCount = function (req,res,next) {

  //检索数据库，查找此人的头像
  if (req.session.login == "1") {
      //如果登陆了
      var username  = req.session.username;
      var login     = true;

  } else {
      //没有登陆
      var username = "";  //制定一个空用户名
      var login = false;
  }

  db.find("donatelist",{},function(err,result){
    if(err){
      res.send("-5");//随便去，服务器错误
      return;
    }
    var donatelistCount = result.length;

    // if(result.length == 0){
    //   res.send("-1");//
    //   return;
    // }

    db.find("exchangelist",{},function(err,result){
      if(err){
          res.send("-5");//随便去，服务器错误
          return;
      }
      var exchangelistCount = result.length;

      // if(result.length == 0){
      //     res.send("-1");//
      //     return;
      // }

      db.find("sendlist",{},function(err,result){
          if(err){
              res.send("-5");//随便去，服务器错误
              return;
          }

          var sendlistCount = result.length;

          // if(result.length == 0){
          //     res.send("-1");//
          //     return;
          // }


          db.find("salelist",{},function(err,result){
              if(err){
                  res.send("-5");//随便去，服务器错误
                  return;
              }
              var salelistCount = result.length;

              // if(result.length == 0){
              //     res.send("-1");/
              //     return;
              // }
              var dataArr = [exchangelistCount,salelistCount,sendlistCount,donatelistCount];
              res.render("data-count",{
                "exchangelistCount" : exchangelistCount,
                "salelistCount"     : salelistCount,
                "sendlistCount"     : sendlistCount,
                "donatelistCount"   : donatelistCount,
                "login"             : login,
                "username"          : username
              });
        });

      });
   });
  });
}

exports.showUserCenter = function (req,res,next) {
  //检索数据库，查找此人的头像
  if (req.session.login == "1") {
      //如果登陆了
      var username  = req.session.username;
      var login     = true;

  } else {
      //没有登陆
      var username = "";  //制定一个空用户名
      var login = false;
  }


  db.find("donatelist",{"username" : username},function(err,result1){
    if(err){
      res.send("-5");//随便去，服务器错误
      return;
    }
    var donatelistCount = result1;

    db.find("exchangelist",{"username" : username},function(err,result2){
      if(err){
          res.send("-5");//随便去，服务器错误
          return;
      }
      var exchangelistCount = result2;

      // if(result.length == 0){
      //     res.send("-1");//
      //     return;
      // }

      db.find("sendlist",{"username" : username},function(err,result3){
          if(err){
              res.send("-5");//随便去，服务器错误
              return;
          }

          var sendlistCount = result3;

          // if(result.length == 0){
          //     res.send("-1");//
          //     return;
          // }


          db.find("salelist",{"username" : username},function(err,result4){
              if(err){
                  res.send("-5");//随便去，服务器错误
                  return;
              }
              var salelistCount = result4;

              // console.log(result4,result3,result2,result1);
              // console.log("当前用户名字：" + username);
              res.render("usercenter",{
                "exchangelistCount" : exchangelistCount,
                "salelistCount"     : salelistCount,
                "sendlistCount"     : sendlistCount,
                "donatelistCount"   : donatelistCount,
                "login"             : login,
                "username"          : username
              });
        });

      });
   });
  });
}

//个人中心的分页总数
exports.userGoodsNumberAmount = function(req,res,next){
    db.getAllCount("salelist",function(saleCount){
        // res.send(count.toString());
				var saleCount = saleCount;
				db.getAllCount("exchangelist",function (exchangeCount) {
					var exchangeCount = exchangeCount;
						db.getAllCount("sendlist",function (sendCount) {
							var sendCount = sendCount;
								db.getAllCount("donatelist",function (donateCount) {
									var donateCount = donateCount;
									var allCount = saleCount + exchangeCount + sendCount + donateCount;
									res.send(allCount.toString());
								})
						})
				})
    });
};

//改变交易状态--交换
exports.changeExchangeStatus = function (req,res,next) {
	//检索数据库，查找此人的头像
	if (req.session.login == "1") {
			//如果登陆了
			var username = req.session.username;
			var login = true;
	} else {
			//没有登陆
			var username = "";  //制定一个空用户名
			var login = false;
	}

	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		var goodsStatus = fields.goodsStatus;
		// console.log(goodsStatus);
		db.find("exchangelist",{username : username},function (err,result) {
			if(err) {
				res.send("-5");
				return;
			}
			db.updateMany("exchangelist",{"goodsStatus" : "unfinish" },{
				$set : {
					goodsStatus : "finish"
				}
			},function (err,result) {
				if(err) {
					console.log(err);
					res.send("-4");
					return;
				}
				res.send("1");//发布成功
			})
		})
	})
}

//改变交易状态--变卖
exports.changeSaleStatus = function (req,res,next) {
	//检索数据库，查找此人的头像
	if (req.session.login == "1") {
			//如果登陆了
			var username = req.session.username;
			var login = true;
	} else {
			//没有登陆
			var username = "";  //制定一个空用户名
			var login = false;
	}

	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		var goodsStatus = fields.goodsStatus;
		// console.log(goodsStatus);
		db.find("salelist",{username : username},function (err,result) {
			if(err) {
				res.send("-5");
				return;
			}
			db.updateMany("salelist",{"goodsStatus" : "unfinish" },{
				$set : {
					goodsStatus : "finish"
				}
			},function (err,result) {
				if(err) {
					console.log(err);
					res.send("-4");
					return;
				}
				res.send("1");//发布成功
			})
		})
	})
}

//改变交易状态--送
exports.changeSendStatus = function (req,res,next) {
	//检索数据库，查找此人的头像
	if (req.session.login == "1") {
			//如果登陆了
			var username = req.session.username;
			var login = true;
	} else {
			//没有登陆
			var username = "";  //制定一个空用户名
			var login = false;
	}

	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		var goodsStatus = fields.goodsStatus;
		// console.log(goodsStatus);
		db.find("sendlist",{username : username},function (err,result) {
			if(err) {
				res.send("-5");
				return;
			}
			db.updateMany("sendlist",{"goodsStatus" : "unfinish" },{
				$set : {
					goodsStatus : "finish"
				}
			},function (err,result) {
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

//改变交易状态--捐献
exports.changeDonateStatus = function (req,res,next) {
	//检索数据库，查找此人的头像
	if (req.session.login == "1") {
			//如果登陆了
			var username = req.session.username;
			var login = true;
	} else {
			//没有登陆
			var username = "";  //制定一个空用户名
			var login = false;
	}

	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		var goodsStatus = fields.goodsStatus;

		db.find("donatelist",{username : username,},function (err,result) {//通过用户名查找有问题，就选中当前用户的所有的商品,可复合查询
			//http://docs.mongoing.com/manual-zh/tutorial/query-documents.html
			if(err) {
				res.send("-5");
				return;
			}
			db.updateMany("donatelist",{"goodsStatus" : "unfinish" },{
				$set : {
					"goodsStatus" : goodsStatus
				}
			},function (err,result) {
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

exports.hello = function (req,res,next) {
  res.json({
    a:"1",
    b:"2"
  })
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

//立即联系


