var formidable = require("formidable");
var db = require("../model/db.js");
var ds = require("../model/datastruct.js").ds;
var util = require("../util/util.js");
var mongo = require('mongodb');


////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function getSendMsgCountByUserID(uid, cb){
    console.log(ds.MSGBOX);
    db.count(ds.MSGBOX, {from:uid}, function(count){
        cb(count);
    });
}
//////
exports.doContact = function (req,res,next) {
    var logPre = "(/doContact)[router/msgbox.js](doContact)"; 
    console.log(logPre);
    if(req.session.login != "1") {
        res.end("没有登录，请登录");
        return;
    }
    var userinfo = util.getLoginUser(req);
    var username = userinfo.username;
    var nickname = userinfo.nickname;
    var login = userinfo.login;
    var avatar = userinfo.avatar;
    var uid = userinfo.uid;
    getSendMsgCountByUserID(uid, function(count){
        if(count > 50){
            console.log(logPre, "send msgs > 50");
            res.end("您的发件过多，请清理后再发件。");
            return;
        }
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var whichkind = fields.kind;
            var itemID = fields.itemID;
            var targetUid = fields.targetid;
            var msg = fields.msg;
            db.insertOne(ds.MSGBOX,{
                "username":userinfo.username,
                "uid":mongo.ObjectID(userinfo.uid),
                "kind":whichkind,
                "itemid":itemID,
                "targetUid":targetUid,
                "msg":msg
            },function(err,result){
                if(err){
                    res.send("-3");//服务器错误
                    return;
                }
                res.send("1");
            });
        });
    })
}
//我的收件
exports.userReceive = function(req,res,next){
    console.log("router :[/userReceive]:exports.sendlistMsg");
    //必须登录
    if(req.session.login != "1") {
        res.send("-10");
        return;
    }
    var userinfo = util.getLoginUser(req);
    //这个页面接收一个参数，页面
    var page = req.query.page;
    db.find("sendlist",{},{"pageamount":10,"page":page,"sort":{"publicTime":-1}},function(err,result){
        res.render("receive",{
            userdata:userinfo,
            pagedata:{
              result:result
            }
          });
    });
};



////
// {
//     userdata:{
//         uid:
//         uname:
//         nickname:
//         avatar:
//     },
//     pagedata:{
//         result:{

//         }
//     }
// }