var formidable = require("formidable");
var db = require("../model/db.js");
var ds = require("../model/datastruct.js").ds;
var util = require("../util/util.js");
var selftable = ds.EVENT;
//校园大事件列表页
exports.list = function(req,res,next){
    console.log("router :[/campuslistMsg]:exports.campuslistMsg");
    var userinfo = util.getLoginUser(req);
    //这个页面接收一个参数，页面
    var page = req.query.page;
    db.find(selftable,{},{"pageamount":10,"page":page,"sort":{"publicTime":-1}},function(err,result){
        res.render("campus-event-list",{
            userdata:userinfo,
            pagedata:{
              result:result
            }
          });
    });
};


//校园大事件页面提交页面
exports.showadd = function (req,res,next) {
    if(req.session.login != "1") {
        res.send("-10");
        return;
    }
    var userinfo = util.getLoginUser(req);  
    if(userinfo.authority) {
        res.render("no-authority",{
            userdata:userinfo
        });
        return;
    }
    //已经登陆了，那么就要检索数据库，查登陆这个人的头像
    res.render("add_campusEvent", {
        userdata:userinfo
    });
};

//校园大事件页面提交api
exports.submit = function(req,res,next) {

    //检索数据库，查找此人的头像
    if (req.session.login != "1") {
        res.send("-10");
        return;
    }
    var userinfo = util.getLoginUser(req);
    if (!userinfo.authority){
        res.render("no-authority",{
            userdata:userinfo
        });
        return;      
    }
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var username           = userinfo.username;
        var eventTitle         = fields.eventTitle;
        var eventAddress       = fields.eventAddress;
        var eventPeople        = fields.eventPeople;
        var eventTime          = fields.eventTime;
        var eventContent       = fields.eventContent;
        var publicTime         = util.GetNowTS();
        var userImgOne         = fields.userImgOne;
        var userImgTwo         = fields.userImgTwo;
        var userImgThree       = fields.userImgThree;
        var userImgFore        = fields.userImgFore;
        var imgBase64Arr       = [userImgOne,userImgTwo,userImgThree,userImgFore];
        db.insertOne(selftable,{
            "usename":userinfo.username,
            "uid":userinfo.uid,
            "eventTitle"        :  eventTitle,
            "eventAddress"      :  eventAddress,
            "eventPeople"       :  eventPeople,
            "eventTime"         :  eventTime,
            "eventContent"      :  eventContent,
            "publicTime"        :  publicTime,
            "imgName"           :  imgName,
            "imgBase64Arr"      :  imgBase64Arr
        },function(err,result){
          if(err){
            res.send("-3");//服务器错误
            return;
          }
          res.send("1");//发布成功
        });
    });
};

exports.detail = function(req,res,next){
    var userinfo = util.getLoginUser(req);
    var obid = req.query.targetid;
    db.find(selftable,{"_id":mongo.ObjectID(obid)},function(err,result){
        for (var idx in result){
            result[idx]["publicTime"] = util.GetDateStrFromTS(result[idx]["publicTime"]);
        }
        res.render("campus-event-detail",{
            userdata:userinfo,
            pagedata:{
              result:result
            }
        });
    });
};

exports.count = function(req,res,next){
    db.getAllCount(selftable,function(count){
        res.send(count.toString());
    });
};

