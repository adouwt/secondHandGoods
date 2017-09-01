exports.getLoginUser = function(req){
    var re = {};
    re.username = "";
    re.nickname = "";
    re.login = false;
    re.avatar = "";
    re.uid = "";
    if (req.session.login == "1") {
        re.username  = req.session.username;
        re.login     = true;
        re.nickname = req.session.nickname;
        re.avatar = req.session.avatar;
        re.uid = req.session.uid;
    }
    return re;
};

    //0～9 a~z A~Z 的随机不重复字符串

exports.randomStr = function randomStr (length, str) {
    if (!length) {
      len = 32;
    }

    var samples = str || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var randString = ''
    for (var i = 0; i < len; i++) {
      var randIndex = Math.floor(Math.random() * samples.length);
      randString += samples[randIndex];
    }
    return randString;

};
exports.GetDateStrFromTS = function(ts){
    var newDate = new Date();
    newDate.setTime(ts);
    return newDate.toLocaleDateString();
};
exports.GetNowTS = function(){
    return Date.parse(new Date());
}
