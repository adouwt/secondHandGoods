$(function(){
    window.common = {};
    common.errArr = [];
    //事件格式化
    common.FormatDate = function FormatDate (strTime) {
        var date = new Date(strTime);
        return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate() + "-" +date.getHours() + "：" +date.getMinutes();
    }
    //表单验证
    common.isNothing = function isNothing (dom) {
        var domValue = dom.val();
        if(domValue.length<1) {
        dom.addClass("error-border").parent("div").next(".error-msg").addClass("error-fadeIn");
        common.errArr.push("error");
        return false;
        }
    }
    //电话号码的验证
    common.isPhone = function isPhone(dom) {
        var domValue = dom.val();
        if(domValue.length>1 && !(/^1[34578]\d{9}$/.test(domValue))){
            dom.addClass("error-border").parent("div").next().next(".error-msg-formate").addClass("error-fadeIn");
             common.errArr.push("error");
            return false;
        }
    }


    
    return common;
})