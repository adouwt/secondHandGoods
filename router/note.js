var formidable = require("formidable");
var db = require("../model/db.js");
var ds = require("../model/datastruct.js").ds;
var util = require("../util/util.js");
var mongo = require('mongodb');

var selftable = ds.NOTE;
//自由贴列表页
exports.list = function(req,res,next){
    console.log("router :[/notelistMsg]:exports.notelistMsg");
    var userinfo = util.getLoginUser(req);
    //这个页面接收一个参数，页面
    var page = req.query.page;
    db.find(selftable,{},{"pageamount":10,"page":page,"sort":{"publicTime":-1}},function(err,result){
        for (var idx in result){
            result[idx]["router"] = "/note/getdetail";
        }
        res.render("note-list",{
            userdata:userinfo,
            pagedata:{
              result:result
            }
        });
    });
};
//自由贴详情页
exports.detail = function(req,res,next){
    console.log("router :[/notedetail]:exports.noteDetail");
    var userinfo = util.getLoginUser(req);
    var obid = req.query.targetid;
    db.find(selftable,{"_id":mongo.ObjectID(obid)},function(err,result){
        for (var idx in result){
            result[idx]["publicTime"] = util.GetDateStrFromTS(result[idx]["publicTime"]);
        }
        res.render("note-detail",{
            userdata:userinfo,
            pagedata:{
              result:result
            }
        });
    });
};
//自由贴提交页面
exports.showadd = function (req,res,next) {
    if(req.session.login != "1") {
        res.send("-10");
        return;
    }
    var userinfo = util.getLoginUser(req);
    res.render("add_note", {
        userdata:userinfo
    });
};

//自由帖子发布api
exports.submit = function(req,res,next) {
    if (req.session.login != "1") {
        res.send("-10");
        return;
    }
    var userinfo = util.getLoginUser(req);

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var username           = userinfo.username;
        var noteTitle          = fields.noteTitle;
        var noteContent        = fields.noteContent;
        var publicTime         = util.GetNowTS();

        var userImgOne         = fields.userImgOne;
        var userImgTwo         = fields.userImgTwo;
        var userImgThree       = fields.userImgThree;
        var userImgFore        = fields.userImgFore;
        var imgBase64Arr       = [userImgOne,userImgTwo,userImgThree,userImgFore];

        db.insertOne(selftable,{
            "username"          :  userinfo.username,
            "uid"               :  userinfo.uid,
            "noteTitle"         :  noteTitle,
            "noteContent"       :  noteContent,
            "publicTime"        :  publicTime,
            "imgBase64Arr"      :  imgBase64Arr
        },function(err,result){
            if(err){
                res.send("-3");//服务器错误
                return;
            }
            res.send("1");//发布成功
        });
    });
}
//捐总数分页总数
exports.count = function(req,res,next){
    db.getAllCount(selftable,function(count){
        res.send(count.toString());
    });
};
