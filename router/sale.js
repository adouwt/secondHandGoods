var formidable = require("formidable");
var db = require("../model/db.js");
var ds = require("../model/datastruct.js").ds;
var util = require("../util/util.js");
var mongo = require('mongodb');

var selftable = ds.SALE;
//显示变卖 提交页面
exports.showadd = function (req,res,next) {
    //必须登录
    if(req.session.login != "1") {
      res.redirect("/");
        return;
    }
      var userinfo = util.getLoginUser(req);
    //已经登陆了，那么就要检索数据库，查登陆这个人的头像
      res.render("add_sale_product", {
        userdata:userinfo
      });
  };

  //添加卖的商品提交
exports.submit = function(req,res,next) {
    
      if(req.session.login != "1") {
        res.send("-10");
          return;
      }
    
      var userinfo = util.getLoginUser(req);
      var form = new formidable.IncomingForm();
    
      form.parse(req, function(err, fields, files) {
    
        // console.log(fields);
        var username           = userinfo.username;
        var selectWay          = fields.selectWay;
        var userGoodsSort      = fields.userGoodsSort;
        var userGoodsPrice     = fields.userGoodsPrice;
        var userGoodsSalePrice = fields.userGoodsSalePrice;
        var userGoodsName      = fields.userGoodsName;
        var userGoodsUseTime   = fields.userGoodsUseTime;
        var userGoodsaddText   = fields.userGoodsaddText;
        var userName           = fields.userName;
        var userPhone          = fields.userPhone;
        var publicTime         = util.GetNowTS();
    
        var userImgOne         = fields.userImgOne;
        var userImgTwo         = fields.userImgTwo;
        var userImgThree       = fields.userImgThree;
        var userImgFore        = fields.userImgFore;
        var imgBase64Arr       = [userImgOne,userImgTwo,userImgThree,userImgFore];
    
        db.insertOne(ds.SALE,{
          "uid"               : mongo.ObjectID(userinfo.uid),
          "username"          :  userinfo.username,
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
          res.send("1");//发布成功
        });
      });
};
exports.list = function(req,res,next){
    console.log("router: [/salelistMsg]:exports.salelistMsg");
    var userinfo = util.getLoginUser(req);
    var username = userinfo.username;
    var nickname = userinfo.nickname;
    var login = userinfo.login;
    var avatar = userinfo.avatar;
  
    //这个页面接收一个参数，页面
    var page = req.query.page;
    db.find(ds.SALE,{},{"pageamount":10,"page":page,"sort":{"publicTime":-1}},function(err,result){
      for (var idx in result){
        result[idx]["router"] = "/sale/getdetail";
      }

        res.render("sale-list",{
          userdata:userinfo,
          pagedata:{
            result:result
          }
        });
    });
};
exports.count = function(req,res,next){
    db.getAllCount(ds.SALE,function(count){
        res.send(count.toString());
    });
};
//改变交易状态--变卖
exports.change = function (req,res,next) {
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
		db.find(ds.SALE,{username : username},function (err,result) {
			if(err) {
				res.send("-5");
				return;
			}
			db.updateMany(ds.SALE,{"goodsStatus" : "unfinish" },{
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
};

exports.detail = function(req,res,next){
  var userinfo = util.getLoginUser(req);
  var obid = req.query.targetid;
  db.find(selftable,{"_id":mongo.ObjectID(obid)},function(err,result){
      for (var idx in result){
          result[idx]["publicTime"] = util.GetDateStrFromTS(result[idx]["publicTime"]);
      }
      res.render("sale-detail",{
          userdata:userinfo,
          pagedata:{
            result:result
          }
      });
  });
};
