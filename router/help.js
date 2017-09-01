var formidable = require("formidable");
var db = require("../model/db.js");
var ds = require("../model/datastruct.js").ds;
var util = require("../util/util.js");
var mongo = require('mongodb');
var selftable = ds.HELP;
//help 提交页
exports.submit = function(req,res,next) {
    
      if(req.session.login != "1") {
        res.send("-10");
          return;
      }
      var userinfo = util.getLoginUser(req);
      
      var form = new formidable.IncomingForm();
    
      form.parse(req, function(err, fields, files) {
        var username           = userinfo.username;
        var userGoodsSort      = fields.userGoodsSort;
        var userGoodsPrice     = fields.userGoodsPrice;
        var userGoodsName      = fields.userGoodsName;
        var userGoodsUseTime   = fields.userGoodsUseTime;
        var userGoodsaddText   = fields.userGoodsaddText;
        var userChangeTar      = fields.userChangeTar;
        var userName           = fields.userName;
        var userPhone          = fields.userPhone;
        var publicTime         = util.GetNowTS();
    
        var userImgOne         = fields.userImgOne;
        var userImgTwo         = fields.userImgTwo;
        var userImgThree       = fields.userImgThree;
        var userImgFour        = fields.userImgFour;
        var imgBase64Arr       = [userImgOne,userImgTwo,userImgThree,userImgFour];
        //查询数据库的名字是否重复
          // console.log(username);
          //返回result.length的长度为０，说明数据库中没有此名字
          db.insertOne(selftable,{
            "username"          :  userinfo.username,
            "uid"               : mongo.ObjectID(userinfo.uid),
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
            res.send("1");//发布成功
          });
      });
};
    //显示help提交页
exports.showadd = function (req,res,next) {
    //必须登录
    if(req.session.login != "1") {
    res.send("-10");
        return;
    }
    var userinfo = util.getLoginUser(req);
    res.render("add_need_help", {
    userdata:userinfo
    });
};
    //help 分页总数
exports.count = function(req,res,next){
    db.getAllCount(selftable,function(count){
        res.send(count.toString());
    });
};
    //help 列表显示页
exports.list = function(req,res,next){
    console.log("router :[/HelpListMsg]:exports.HelpListMsg");
    var userinfo = util.getLoginUser(req);
    //这个页面接收一个参数，页面
    var page = req.query.page;
    db.find(selftable,{},{"pageamount":10,"page":page,"sort":{"publicTime":-1}},function(err,result){
        for (var idx in result){
            result[idx]["router"] = "/help/getdetail";
        }
        res.render("help-list",{
            userdata:userinfo,
            pagedata:{
                result:result
            }
        });
    });
};
//改变状态--need help
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
  
      db.find(selftable,{username : username,},function (err,result) {//通过用户名查找有问题，就选中当前用户的所有的商品,可复合查询
        //http://docs.mongoing.com/manual-zh/tutorial/query-documents.html
        if(err) {
          res.send("-5");
          return;
        }
        db.updateMany(selftable,{"helpStatus" : "unfinish" },{
          $set : {
            "helpStatus" : goodsStatus
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
};

exports.detail = function(req,res,next){
    var userinfo = util.getLoginUser(req);
    var obid = req.query.targetid;
    db.find(selftable,{"_id":mongo.ObjectID(obid)},function(err,result){
        for (var idx in result){
            result[idx]["publicTime"] = util.GetDateStrFromTS(result[idx]["publicTime"]);
        }
        res.render("help-detail",{
            userdata:userinfo,
            pagedata:{
              result:result
            }
        });
    });
};
  