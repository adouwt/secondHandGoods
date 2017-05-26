//又提交，引入formidable
var formidable = require("formidable");
//引入封装好的db.js，从setting走
var db = require("../model/db.js");

var md5 = require("../model/md5.js");

var path = require("path");

var fs = require("fs");

var file = require("../model/file.js");

//显示主页
exports.showIndex = function (req, res, next) {
    // var pageData = {};
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

    //已经登陆了，那么就要检索数据库，查登陆这个人的头像
    db.find("users", {username: username}, function (err, result) {
        if (result.length == 0) {
            var avatar = "default.jpg";
        } else {
            var avatar = result[0].avatar;
        }

        loginInfo = {
            login: login,
            username: username,
            avatar: avatar
        }

        db.find("goodslist",{},function(err,result) {
          res.render("index",{
            "result"    : result,
            "loginInfo" : loginInfo
          });      
        })

    });

};

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

exports.add_product = function (req,res,next) {
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

      res.render("add_product", {
          "newpath":"",
          "login": login,
          "username": username,
          "avatar":  "default.jpg",
          "index_url": "/img/down_img.jpg"
      });
  });
};

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


exports.show_product_img = function (req,res,next) {
    var albumName = req.params.albumName;
    //具体业务交给model
    file.getAllImagesByAlbumName(albumName,function(err,imagesArray){
        if(err){
            next(); //交给下面的中间件
            return;
        }
        res.render("album",{
            "albumname" : albumName,
            "images" : imagesArray
        });
    });
}
//发布商品
exports.goodsSubmit = function(req,res,next) {
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
      var username           = req.session.username;
      var userGoodsSort      = fields.userGoodsSort;
      var userGoodsPrice     = fields.userGoodsPrice;
      var userGoodsName      = fields.userGoodsName;
      var userGoodsUseTime   = fields.userGoodsUseTime;
      var userGoodsaddText   = fields.userGoodsaddText;
      var userChangeTar      = fields.userChangeTar;
      var userName           = fields.userName;
      var userPhone          = fields.userPhone;

      var userImgOne         = fields.userImgOne;
      var userImgTwo         = fields.userImgTwo;
      var userImgThree       = fields.userImgThree;
      var userImgFore        = fields.userImgFore;
      var imgBase64Arr       = [userImgOne,userImgTwo,userImgThree,userImgFore];

      for(var i = 0;i<imgBase64Arr.length;i++) {
        var path       = 'assets/img/'+ username + userGoodsName + i + '.png';
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
      db.find("goodslist",{"username": username},function (err,result) {
        if(err) {
          res.send("-3");
          return;
        }
        // console.log(username);
        //返回result.length的长度为０，说明数据库中没有此名字
        db.insertOne("goodslist",{
          "username"          :  username,
          "userGoodsSort"     :  userGoodsSort,
          "userGoodsPrice"    :  userGoodsPrice,
          "userGoodsName"     :  userGoodsName,
          "userGoodsUseTime"  :  userGoodsUseTime,
          "userGoodsaddText"  :  userGoodsaddText,
          "userName"          :  userName,
          "userChangeTar"     :  userChangeTar,
          "userPhone"         :  userPhone,
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


